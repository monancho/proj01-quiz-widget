import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDatabase } from '../db/connection.js';
import { runMigrations } from '../db/migrations.js';
import { createApp } from '../app.js';
import { createAiServerClient } from '../services/aiServerClient.js';

const tempRoot = resolve(process.cwd(), '..', 'tmp');
mkdirSync(tempRoot, { recursive: true });
const tempDir = mkdtempSync(resolve(tempRoot, 'ai-generation-'));
const dbPath = resolve(tempDir, 'smoke.sqlite');
const db = openDatabase(dbPath);
const migrationsDir = resolve(import.meta.dirname, '../../..', 'migrations');

runMigrations(db, migrationsDir);

let fetchMode = 'success';
let aiRequestCount = 0;

function jsonResponse(status, body, requestId = 'ai-request-id') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'x-request-id': requestId
    }
  });
}

function generatedQuestion(index) {
  return {
    question: `Generated question ${index}`,
    options: [
      `Correct option ${index}`,
      `Wrong option ${index}-2`,
      `Wrong option ${index}-3`,
      `Wrong option ${index}-4`
    ],
    answer_index: 0,
    explanation: `Generated explanation ${index}`
  };
}

function successBody({ warning = null } = {}) {
  return {
    success: true,
    data: {
      source: {
        type: 'text',
        title: null,
        url: null,
        warning
      },
      questions: [
        generatedQuestion(1),
        generatedQuestion(2),
        generatedQuestion(3)
      ],
      usage: {
        question_count: 3,
        input_chars: 300
      }
    }
  };
}

async function mockAiFetch(url, options = {}) {
  aiRequestCount += 1;
  const path = new URL(url).pathname;

  if (path === '/health') {
    return jsonResponse(200, {
      status: 'ok',
      service: 'ai-server',
      version: '0.1.0'
    }, 'health-request-id');
  }

  if (path === '/ready') {
    return jsonResponse(200, {
      status: 'ready',
      service: 'ai-server',
      version: '0.1.0'
    }, 'ready-request-id');
  }

  if (options.headers?.['X-Internal-Api-Key'] !== 'valid-ai-key') {
    return jsonResponse(401, {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid request'
      }
    }, 'invalid-key-request-id');
  }

  if (fetchMode === 'invalid-key') {
    return jsonResponse(401, {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid request'
      }
    }, 'invalid-key-request-id');
  }

  if (fetchMode === 'short-text') {
    return jsonResponse(400, {
      success: false,
      error: {
        code: 'SOURCE_TEXT_TOO_SHORT',
        message: 'Source text is too short'
      }
    }, 'short-text-request-id');
  }

  if (fetchMode === 'invalid-shape') {
    return jsonResponse(200, {
      success: true,
      data: {
        source: { type: 'text', title: null, url: null, warning: null },
        questions: [
          {
            question: 'Only one bad question',
            options: ['A', 'B', 'C', 'D'],
            answer_index: 0,
            explanation: 'Bad response'
          }
        ],
        usage: {
          question_count: 1,
          input_chars: 300
        }
      }
    }, 'invalid-shape-request-id');
  }

  return jsonResponse(200, successBody({ warning: 'CONTENT_TRUNCATED' }), 'success-request-id');
}

const app = createApp({
  db,
  env: {
    nodeEnv: 'development',
    corsAllowedOrigins: 'http://localhost:5173',
    adminApiToken: '',
    aiServerBaseUrl: 'http://ai-server.test',
    aiServerApiKey: 'valid-ai-key',
    aiServerTimeoutSeconds: 30,
    aiServerFetch: mockAiFetch
  }
});
const server = app.listen(0);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const address = server.address();
  const headers = {
    ...(options.body ? { 'content-type': 'application/json' } : {}),
    ...options.headers
  };

  const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  return {
    status: response.status,
    body
  };
}

async function createQuizSet(postSlug) {
  const response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug,
      postTitle: postSlug,
      status: 'draft'
    }
  });

  assert(response.status === 201, `quiz set ${postSlug} should be created`);
  return response.body.id;
}

try {
  let response = await request('/api/admin/ai-server/health');
  assert(response.status === 200, 'AI health should return 200');
  assert(response.body.status === 'ok', 'AI health should return ok');
  assert(response.body.requestId === 'health-request-id', 'AI health should expose request id');

  response = await request('/api/admin/ai-server/ready');
  assert(response.status === 200, 'AI ready should return 200');
  assert(response.body.status === 'ready', 'AI ready should return ready');

  const successSetId = await createQuizSet('ai-generation-success');
  fetchMode = 'success';
  response = await request(`/api/admin/quiz-sets/${successSetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'This is a long enough source text for AI quiz generation smoke testing.',
      difficulty: 'beginner'
    }
  });
  assert(response.status === 201, 'AI text generation should return 201');
  assert(response.body.items.length === 3, 'AI text generation should save 3 quizzes');
  assert(response.body.items[0].correctPosition === 1, 'answer_index 0 should map to correctPosition 1');
  assert(response.body.warning === 'CONTENT_TRUNCATED', 'source warning should be returned');
  assert(response.body.requestId === 'success-request-id', 'success response should expose request id');

  response = await request(`/api/admin/quiz-sets/${successSetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'This is a long enough source text for AI quiz generation smoke testing.',
      difficulty: 'beginner'
    }
  });
  assert(response.status === 400, 'AI generation should reject non-empty Slug Group');
  assert(response.body.error.code === 'AI_GENERATION_REQUIRES_EMPTY_SET', 'non-empty set should use expected code');

  const invalidKeySetId = await createQuizSet('ai-generation-invalid-key');
  fetchMode = 'invalid-key';
  response = await request(`/api/admin/quiz-sets/${invalidKeySetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'This is a long enough source text for AI quiz generation smoke testing.',
      difficulty: 'beginner'
    }
  });
  assert(response.status === 503, 'invalid AI key should map to backend service error');
  assert(response.body.error.code === 'INVALID_API_KEY', 'invalid AI key should preserve code');
  assert(response.body.error.requestId === 'invalid-key-request-id', 'invalid AI key should expose request id');

  const shortTextSetId = await createQuizSet('ai-generation-short-text');
  fetchMode = 'short-text';
  response = await request(`/api/admin/quiz-sets/${shortTextSetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'short',
      difficulty: 'beginner'
    }
  });
  assert(response.status === 400, 'short text should return 400');
  assert(response.body.error.code === 'SOURCE_TEXT_TOO_SHORT', 'short text should preserve AI code');

  const invalidDifficultySetId = await createQuizSet('ai-generation-invalid-difficulty');
  const requestsBeforeInvalidDifficulty = aiRequestCount;
  response = await request(`/api/admin/quiz-sets/${invalidDifficultySetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'This is a long enough source text for AI quiz generation smoke testing.',
      difficulty: 'expert'
    }
  });
  assert(response.status === 400, 'invalid difficulty should return 400');
  assert(response.body.error.code === 'DIFFICULTY_INVALID', 'invalid difficulty should use expected code');
  assert(aiRequestCount === requestsBeforeInvalidDifficulty, 'invalid difficulty should not call AI Server');

  const invalidShapeSetId = await createQuizSet('ai-generation-invalid-shape');
  fetchMode = 'invalid-shape';
  response = await request(`/api/admin/quiz-sets/${invalidShapeSetId}/quizzes/ai-generate/text`, {
    method: 'POST',
    body: {
      content: 'This is a long enough source text for AI quiz generation smoke testing.',
      difficulty: 'beginner'
    }
  });
  assert(response.status === 502, 'invalid AI output shape should return 502');
  assert(response.body.error.code === 'OUTPUT_SCHEMA_INVALID', 'invalid AI output should use expected code');

  response = await request(`/api/admin/quiz-sets/${invalidShapeSetId}/quizzes`);
  assert(response.status === 200, 'invalid shape set quiz list should return 200');
  assert(response.body.items.length === 0, 'invalid AI output should not save quizzes');

  const webSetId = await createQuizSet('ai-generation-web');
  fetchMode = 'success';
  response = await request(`/api/admin/quiz-sets/${webSetId}/quizzes/ai-generate/web`, {
    method: 'POST',
    body: {
      url: 'https://example.com/article',
      difficulty: 'intermediate'
    }
  });
  assert(response.status === 201, 'AI web generation route should return 201');
  assert(response.body.items.length === 3, 'AI web generation should save 3 quizzes');

  const youtubeSetId = await createQuizSet('ai-generation-youtube');
  response = await request(`/api/admin/quiz-sets/${youtubeSetId}/quizzes/ai-generate/youtube`, {
    method: 'POST',
    body: {
      url: 'https://www.youtube.com/watch?v=VIDEO_ID',
      difficulty: 'advanced'
    }
  });
  assert(response.status === 201, 'AI YouTube generation route should return 201');
  assert(response.body.items.length === 3, 'AI YouTube generation should save 3 quizzes');

  const timeoutClient = createAiServerClient({
    baseUrl: 'http://ai-server.test',
    apiKey: 'valid-ai-key',
    timeoutSeconds: 1,
    fetchImpl: (_url, options = {}) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      });
    })
  });

  try {
    await timeoutClient.generateTextQuiz({
      content: 'This is a long enough source text for timeout testing.',
      difficulty: 'beginner'
    });
    assert(false, 'timeout client should throw');
  } catch (error) {
    assert(error.statusCode === 504, 'timeout should map to 504');
    assert(error.code === 'AI_SERVER_TIMEOUT', 'timeout should use expected code');
  }

  const networkClient = createAiServerClient({
    baseUrl: 'http://ai-server.test',
    apiKey: 'valid-ai-key',
    timeoutSeconds: 30,
    fetchImpl: async () => {
      throw new Error('network down');
    }
  });

  try {
    await networkClient.ready();
    assert(false, 'network client should throw');
  } catch (error) {
    assert(error.statusCode === 503, 'network errors should map to 503');
    assert(error.code === 'AI_SERVER_NETWORK_ERROR', 'network errors should use expected code');
  }

  console.log('AI generation smoke test passed');
} finally {
  await new Promise((resolveServer) => server.close(resolveServer));
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
}
