import { badRequest, notFound } from '../utils/errors.js';
import { nowIso } from '../utils/time.js';

function parseId(value, name = 'id') {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id < 1) {
    throw badRequest('INVALID_ID', `${name} must be a positive integer`);
  }

  return id;
}

function validateSortOrder(value) {
  const sortOrder = Number.parseInt(value, 10);

  if (![1, 2, 3].includes(sortOrder)) {
    throw badRequest('INVALID_SORT_ORDER', 'sortOrder must be 1, 2, or 3');
  }

  return sortOrder;
}

function validateCorrectPosition(value) {
  const correctPosition = Number.parseInt(value, 10);

  if (![1, 2, 3, 4].includes(correctPosition)) {
    throw badRequest('INVALID_CORRECT_POSITION', 'correctPosition must be 1, 2, 3, or 4');
  }

  return correctPosition;
}

function validateRequiredText(value, fieldName) {
  if (typeof value !== 'string') {
    throw badRequest('MISSING_REQUIRED_FIELD', `${fieldName} is required`);
  }

  const text = value.trim();

  if (!text) {
    throw badRequest('MISSING_REQUIRED_FIELD', `${fieldName} is required`);
  }

  return text;
}

function validateChoices(value) {
  if (!Array.isArray(value) || value.length !== 4) {
    throw badRequest('INVALID_CHOICES', 'choices must contain exactly 4 items');
  }

  return value.map((choice, index) => validateRequiredText(choice, `choices[${index}]`));
}

function rejectPostSlug(payload) {
  if (payload && Object.hasOwn(payload, 'postSlug')) {
    throw badRequest('POST_SLUG_NOT_ALLOWED', 'postSlug is managed by Slug Group and is not accepted here');
  }
}

function assertQuizSetExists(quizSetRepository, quizSetId) {
  const quizSet = quizSetRepository.findById(quizSetId);

  if (!quizSet) {
    throw notFound('QUIZ_SET_NOT_FOUND', 'Slug Group not found');
  }

  return quizSet;
}

function handleUniqueConstraint(error) {
  if (error?.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') {
    throw badRequest('DUPLICATE_SORT_ORDER', 'sortOrder already exists in this Slug Group');
  }

  throw error;
}

export function createQuizService({ quizRepository, quizSetRepository }) {
  return {
    listBySetId(setIdValue) {
      const quizSetId = parseId(setIdValue, 'setId');
      assertQuizSetExists(quizSetRepository, quizSetId);

      return {
        items: quizRepository.listBySetId(quizSetId)
      };
    },

    get(idValue) {
      const id = parseId(idValue);
      const quiz = quizRepository.findById(id);

      if (!quiz) {
        throw notFound('QUIZ_NOT_FOUND', 'Quiz not found');
      }

      return quiz;
    },

    create(setIdValue, payload) {
      rejectPostSlug(payload);

      const quizSetId = parseId(setIdValue, 'setId');
      assertQuizSetExists(quizSetRepository, quizSetId);

      if (quizRepository.countBySetId(quizSetId) >= 3) {
        throw badRequest('QUIZ_LIMIT_EXCEEDED', 'A Slug Group can contain at most 3 quizzes');
      }

      const sortOrder = validateSortOrder(payload?.sortOrder);

      if (quizRepository.sortOrderExists(quizSetId, sortOrder)) {
        throw badRequest('DUPLICATE_SORT_ORDER', 'sortOrder already exists in this Slug Group');
      }

      const timestamp = nowIso();

      try {
        const id = quizRepository.create({
          quizSetId,
          sortOrder,
          question: validateRequiredText(payload?.question, 'question'),
          choices: validateChoices(payload?.choices),
          correctPosition: validateCorrectPosition(payload?.correctPosition),
          explanation: validateRequiredText(payload?.explanation, 'explanation'),
          createdAt: timestamp,
          updatedAt: timestamp
        });

        return this.get(id);
      } catch (error) {
        handleUniqueConstraint(error);
      }
    },

    update(idValue, payload) {
      rejectPostSlug(payload);

      const id = parseId(idValue);
      const current = this.get(id);
      const sortOrder = payload?.sortOrder === undefined
        ? current.sortOrder
        : validateSortOrder(payload.sortOrder);
      const question = payload?.question === undefined
        ? current.question
        : validateRequiredText(payload.question, 'question');
      const choices = payload?.choices === undefined
        ? current.choices
        : validateChoices(payload.choices);
      const correctPosition = payload?.correctPosition === undefined
        ? current.correctPosition
        : validateCorrectPosition(payload.correctPosition);
      const explanation = payload?.explanation === undefined
        ? current.explanation
        : validateRequiredText(payload.explanation, 'explanation');

      if (quizRepository.sortOrderExists(current.quizSetId, sortOrder, id)) {
        throw badRequest('DUPLICATE_SORT_ORDER', 'sortOrder already exists in this Slug Group');
      }

      try {
        quizRepository.update(id, {
          sortOrder,
          question,
          choices,
          correctPosition,
          explanation,
          updatedAt: nowIso()
        });

        return this.get(id);
      } catch (error) {
        handleUniqueConstraint(error);
      }
    },

    delete(idValue) {
      const id = parseId(idValue);
      const changes = quizRepository.delete(id);

      if (!changes) {
        throw notFound('QUIZ_NOT_FOUND', 'Quiz not found');
      }

      return {
        deleted: true
      };
    }
  };
}

