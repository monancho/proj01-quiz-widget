const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

export async function fetchEmbedQuizzes(postSlug, signal) {
  if (!postSlug) {
    return [];
  }

  const response = await fetch(
    `${apiBaseUrl}/api/embed/${encodeURIComponent(postSlug)}/quizzes`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Quiz API failed with ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Quiz API returned an invalid payload');
  }

  return data;
}
