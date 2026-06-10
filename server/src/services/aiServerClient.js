import {
  badGateway,
  badRequest,
  gatewayTimeout,
  serviceUnavailable,
  tooManyRequests,
  unauthorized,
  unprocessableEntity
} from '../utils/errors.js';

const DEFAULT_TIMEOUT_SECONDS = 30;

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function getRequestId(response) {
  return response.headers?.get?.('x-request-id') || null;
}

function buildDetails(requestId) {
  return requestId ? { requestId } : {};
}

function mapAiServerError(code, requestId) {
  const details = buildDetails(requestId);

  switch (code) {
    case 'INVALID_API_KEY':
      return serviceUnavailable(
        'INVALID_API_KEY',
        'AI Server authentication is not configured correctly',
        details
      );
    case 'SERVICE_NOT_READY':
      return serviceUnavailable('SERVICE_NOT_READY', 'AI Server is not ready', details);
    case 'SOURCE_TEXT_TOO_SHORT':
      return badRequest('SOURCE_TEXT_TOO_SHORT', 'Please enter longer source text', details);
    case 'SOURCE_TEXT_TOO_LONG':
      return badRequest('SOURCE_TEXT_TOO_LONG', 'Please shorten the source text', details);
    case 'DIFFICULTY_INVALID':
      return badRequest('DIFFICULTY_INVALID', 'Invalid quiz difficulty', details);
    case 'WEB_URL_INVALID':
      return badRequest('WEB_URL_INVALID', 'Please enter a valid URL', details);
    case 'WEB_URL_BLOCKED':
      return badRequest('WEB_URL_BLOCKED', 'This URL is not allowed', details);
    case 'WEB_CONTENT_EXTRACT_FAILED':
      return unprocessableEntity(
        'WEB_CONTENT_EXTRACT_FAILED',
        'Could not extract content from this page. Try direct text input or another page',
        details
      );
    case 'YOUTUBE_URL_INVALID':
      return badRequest('YOUTUBE_URL_INVALID', 'Please enter a valid YouTube URL', details);
    case 'YOUTUBE_TRANSCRIPT_NOT_FOUND':
      return unprocessableEntity(
        'YOUTUBE_TRANSCRIPT_NOT_FOUND',
        'Please use a YouTube video with available captions',
        details
      );
    case 'AI_RATE_LIMIT_EXCEEDED':
      return tooManyRequests('AI_RATE_LIMIT_EXCEEDED', 'Please try again shortly', details);
    case 'AI_DAILY_USAGE_LIMIT_EXCEEDED':
      return serviceUnavailable(
        'AI_DAILY_USAGE_LIMIT_EXCEEDED',
        'AI generation is temporarily limited',
        details
      );
    case 'QUIZ_GENERATION_FAILED':
      return badGateway('QUIZ_GENERATION_FAILED', 'Quiz generation failed', details);
    case 'OUTPUT_SCHEMA_INVALID':
      return badGateway('OUTPUT_SCHEMA_INVALID', 'AI Server returned an invalid quiz shape', details);
    default:
      return badGateway(code || 'AI_SERVER_ERROR', 'AI Server request failed', details);
  }
}

async function parseJsonResponse(response, requestId) {
  const text = await response.text();

  if (!text) {
    throw badGateway('AI_SERVER_EMPTY_RESPONSE', 'AI Server returned an empty response', buildDetails(requestId));
  }

  try {
    return JSON.parse(text);
  } catch {
    throw badGateway('AI_SERVER_INVALID_JSON', 'AI Server returned invalid JSON', buildDetails(requestId));
  }
}

function createTimeoutController(timeoutSeconds) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
  return { controller, timeout };
}

export function createAiServerClient({
  baseUrl,
  apiKey,
  timeoutSeconds = DEFAULT_TIMEOUT_SECONDS,
  fetchImpl = globalThis.fetch
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedTimeoutSeconds = Number.isInteger(timeoutSeconds) && timeoutSeconds > 0
    ? timeoutSeconds
    : DEFAULT_TIMEOUT_SECONDS;

  function assertConfigured() {
    if (!normalizedBaseUrl) {
      throw serviceUnavailable('AI_SERVER_NOT_CONFIGURED', 'AI Server base URL is not configured');
    }

    if (!apiKey) {
      throw serviceUnavailable('AI_SERVER_NOT_CONFIGURED', 'AI Server API key is not configured');
    }

    if (typeof fetchImpl !== 'function') {
      throw serviceUnavailable('AI_SERVER_NOT_CONFIGURED', 'Fetch implementation is not available');
    }
  }

  async function requestJson(path, { method = 'GET', body, auth = true } = {}) {
    if (auth) {
      assertConfigured();
    } else if (!normalizedBaseUrl) {
      throw serviceUnavailable('AI_SERVER_NOT_CONFIGURED', 'AI Server base URL is not configured');
    }

    const { controller, timeout } = createTimeoutController(normalizedTimeoutSeconds);

    try {
      const headers = {};

      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      if (auth) {
        headers['X-Internal-Api-Key'] = apiKey;
      }

      const response = await fetchImpl(`${normalizedBaseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal
      });
      const requestId = getRequestId(response);
      const parsed = await parseJsonResponse(response, requestId);

      if (!response.ok || parsed?.success === false) {
        throw mapAiServerError(parsed?.error?.code, requestId);
      }

      if (Object.hasOwn(parsed, 'success') && parsed.success !== true) {
        throw badGateway(
          'AI_SERVER_INVALID_RESPONSE',
          'AI Server returned an invalid response wrapper',
          buildDetails(requestId)
        );
      }

      return {
        data: Object.hasOwn(parsed, 'data') ? parsed.data : parsed,
        requestId
      };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw gatewayTimeout('AI_SERVER_TIMEOUT', 'AI Server request timed out');
      }

      if (error?.statusCode && error?.code) {
        throw error;
      }

      throw serviceUnavailable('AI_SERVER_NETWORK_ERROR', 'Could not connect to AI Server');
    } finally {
      clearTimeout(timeout);
    }
  }

  async function requestMultipart(path, formData) {
    assertConfigured();

    const { controller, timeout } = createTimeoutController(normalizedTimeoutSeconds);

    try {
      const response = await fetchImpl(`${normalizedBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          'X-Internal-Api-Key': apiKey
        },
        body: formData,
        signal: controller.signal
      });
      const requestId = getRequestId(response);
      const parsed = await parseJsonResponse(response, requestId);

      if (!response.ok || parsed?.success === false) {
        throw mapAiServerError(parsed?.error?.code, requestId);
      }

      return {
        data: parsed.data,
        requestId
      };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw gatewayTimeout('AI_SERVER_TIMEOUT', 'AI Server request timed out');
      }

      if (error?.statusCode && error?.code) {
        throw error;
      }

      throw serviceUnavailable('AI_SERVER_NETWORK_ERROR', 'Could not connect to AI Server');
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    health() {
      return requestJson('/health', { auth: false });
    },

    ready() {
      return requestJson('/ready', { auth: false });
    },

    generateTextQuiz({ content, difficulty }) {
      return requestJson('/ai/quiz/generate/text', {
        method: 'POST',
        body: { content, difficulty }
      });
    },

    generateWebQuiz({ url, difficulty }) {
      return requestJson('/ai/quiz/generate/web', {
        method: 'POST',
        body: { url, difficulty }
      });
    },

    generateYoutubeQuiz({ url, difficulty }) {
      return requestJson('/ai/quiz/generate/youtube', {
        method: 'POST',
        body: { url, difficulty }
      });
    },

    moderateImage(formData) {
      return requestMultipart('/ai/image/moderate', formData);
    }
  };
}

export function createAiServerClientFromEnv(env) {
  return createAiServerClient({
    baseUrl: env.aiServerBaseUrl,
    apiKey: env.aiServerApiKey,
    timeoutSeconds: env.aiServerTimeoutSeconds,
    fetchImpl: env.aiServerFetch
  });
}
