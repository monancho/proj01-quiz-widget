import { badRequest, conflict, notFound } from '../utils/errors.js';
import { validatePostSlug } from '../utils/slug.js';
import { nowIso } from '../utils/time.js';

const VALID_STATUSES = new Set(['draft', 'private', 'published']);

function normalizeStatus(value) {
  return value || 'draft';
}

function validatePostTitle(value) {
  if (typeof value !== 'string') {
    throw badRequest('INVALID_POST_TITLE', 'postTitle is required');
  }

  const postTitle = value.trim();

  if (!postTitle) {
    throw badRequest('INVALID_POST_TITLE', 'postTitle is required');
  }

  return postTitle;
}

function validateStatus(value) {
  const status = normalizeStatus(value);

  if (!VALID_STATUSES.has(status)) {
    throw badRequest('INVALID_STATUS', 'status must be draft, private, or published');
  }

  return status;
}

function parseId(value, name = 'id') {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id < 1) {
    throw badRequest('INVALID_ID', `${name} must be a positive integer`);
  }

  return id;
}

function mapSummary(row) {
  return {
    totalSets: row?.total_sets || 0,
    draftSets: row?.draft_sets || 0,
    publishedSets: row?.published_sets || 0,
    privateSets: row?.private_sets || 0,
    completedSets: row?.completed_sets || 0
  };
}

function normalizeFilters({ query, status } = {}) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : '';
  const normalizedStatus = typeof status === 'string' ? status.trim() : '';

  if (normalizedStatus && !VALID_STATUSES.has(normalizedStatus)) {
    throw badRequest('INVALID_STATUS', 'status must be draft, private, or published');
  }

  return {
    query: normalizedQuery,
    status: normalizedStatus
  };
}

function validateSlugInput(value) {
  const result = validatePostSlug(value);

  if (!result.ok) {
    throw badRequest('INVALID_POST_SLUG_FORMAT', result.message);
  }

  return result.postSlug;
}

function assertStatusAllowed(status, quizCount) {
  if ((status === 'private' || status === 'published') && quizCount !== 3) {
    throw badRequest(
      'INCOMPLETE_QUIZ_SET',
      'Slug Group must have exactly 3 quizzes before using private or published status'
    );
  }
}

function handleUniqueConstraint(error) {
  if (error?.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') {
    throw conflict('DUPLICATE_POST_SLUG', 'postSlug is already in use');
  }

  throw error;
}

export function createQuizSetService(repository) {
  return {
    list(filters) {
      const normalizedFilters = normalizeFilters(filters);

      return {
        summary: mapSummary(repository.summary()),
        items: repository.list(normalizedFilters)
      };
    },

    get(idValue) {
      const id = parseId(idValue);
      const quizSet = repository.findById(id);

      if (!quizSet) {
        throw notFound('QUIZ_SET_NOT_FOUND', 'Slug Group not found');
      }

      return quizSet;
    },

    checkSlug({ postSlug, excludeId }) {
      const normalizedPostSlug = validateSlugInput(postSlug);
      const normalizedExcludeId = excludeId ? parseId(excludeId, 'excludeId') : null;
      const existing = repository.findBySlug(normalizedPostSlug, normalizedExcludeId);

      return {
        postSlug: normalizedPostSlug,
        available: !existing
      };
    },

    create(payload) {
      const postSlug = validateSlugInput(payload?.postSlug);
      const postTitle = validatePostTitle(payload?.postTitle);
      const status = validateStatus(payload?.status);

      assertStatusAllowed(status, 0);

      if (repository.findBySlug(postSlug)) {
        throw conflict('DUPLICATE_POST_SLUG', 'postSlug is already in use');
      }

      const timestamp = nowIso();

      try {
        const id = repository.create({
          postSlug,
          postTitle,
          status,
          createdAt: timestamp,
          updatedAt: timestamp
        });

        return this.get(id);
      } catch (error) {
        handleUniqueConstraint(error);
      }
    },

    update(idValue, payload) {
      const id = parseId(idValue);
      const current = this.get(id);
      const postSlug = payload?.postSlug === undefined
        ? current.postSlug
        : validateSlugInput(payload.postSlug);
      const postTitle = payload?.postTitle === undefined
        ? current.postTitle
        : validatePostTitle(payload.postTitle);
      const status = payload?.status === undefined
        ? current.status
        : validateStatus(payload.status);

      assertStatusAllowed(status, current.quizCount);

      if (repository.findBySlug(postSlug, id)) {
        throw conflict('DUPLICATE_POST_SLUG', 'postSlug is already in use');
      }

      try {
        repository.update(id, {
          postSlug,
          postTitle,
          status,
          updatedAt: nowIso()
        });
      } catch (error) {
        handleUniqueConstraint(error);
      }

      return this.get(id);
    },

    delete(idValue) {
      const id = parseId(idValue);
      const changes = repository.delete(id);

      if (!changes) {
        throw notFound('QUIZ_SET_NOT_FOUND', 'Slug Group not found');
      }

      return {
        deleted: true
      };
    }
  };
}
