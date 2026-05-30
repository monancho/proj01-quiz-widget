import { buildApiUrl } from './apiConfig.js';

export async function fetchEmbedQuizzes(postSlug, signal) {
  if (!postSlug) {
    return [];
  }

  const response = await fetch(buildApiUrl(`/api/embed/${encodeURIComponent(postSlug)}/quizzes`), { signal });

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Quiz API returned a non-JSON response (${response.status}). Check VITE_API_BASE_URL.`);
  }

  if (!response.ok) {
    throw new Error(`Quiz API failed with ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Quiz API returned an invalid payload');
  }

  return data;
}
