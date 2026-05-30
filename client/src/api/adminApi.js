import { buildApiUrl } from './apiConfig.js';
import { getAdminToken } from '../utils/adminSession.js';

async function request(path, options = {}) {
  const adminToken = getAdminToken();
  const response = await fetch(buildApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = text && isJson ? JSON.parse(text) : null;

  if (text && !isJson) {
    throw new Error(`API returned a non-JSON response (${response.status}). Check VITE_API_BASE_URL.`);
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.code = payload?.error?.code;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function listQuizSets({ query = '', status = '' } = {}) {
  const params = new URLSearchParams();

  if (query) {
    params.set('query', query);
  }

  if (status) {
    params.set('status', status);
  }

  const search = params.toString();
  return request(`/api/admin/quiz-sets${search ? `?${search}` : ''}`);
}

export function checkPostSlug(postSlug, excludeId) {
  const params = new URLSearchParams({ postSlug });

  if (excludeId) {
    params.set('excludeId', String(excludeId));
  }

  return request(`/api/admin/quiz-sets/check-slug?${params.toString()}`);
}

export function createQuizSet(payload) {
  return request('/api/admin/quiz-sets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateQuizSet(id, payload) {
  return request(`/api/admin/quiz-sets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteQuizSet(id) {
  return request(`/api/admin/quiz-sets/${id}`, {
    method: 'DELETE',
  });
}

export function listQuizzes(setId) {
  return request(`/api/admin/quiz-sets/${setId}/quizzes`);
}

export function createQuiz(setId, payload) {
  return request(`/api/admin/quiz-sets/${setId}/quizzes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getQuiz(id) {
  return request(`/api/admin/quizzes/${id}`);
}

export function updateQuiz(id, payload) {
  return request(`/api/admin/quizzes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteQuiz(id) {
  return request(`/api/admin/quizzes/${id}`, {
    method: 'DELETE',
  });
}

export function reorderQuizzes(setId, orderedQuizIds) {
  return request(`/api/admin/quiz-sets/${setId}/quizzes/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ orderedQuizIds }),
  });
}
