import { normalizePostSlug } from '../utils/slug.js';

export function createPublicEmbedService(repository) {
  return {
    listQuizzes(slugValue) {
      const postSlug = normalizePostSlug(slugValue);

      if (!postSlug) {
        return [];
      }

      const quizSet = repository.findPublishedSetBySlug(postSlug);

      if (!quizSet || quizSet.status !== 'published' || quizSet.quiz_count !== 3) {
        return [];
      }

      const quizzes = repository.listPublicQuizzes(quizSet.id);

      if (quizzes.length !== 3) {
        return [];
      }

      return quizzes;
    }
  };
}

