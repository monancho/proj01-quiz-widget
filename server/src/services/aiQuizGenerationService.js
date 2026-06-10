import { badGateway, badRequest, notFound } from '../utils/errors.js';
import { nowIso } from '../utils/time.js';

const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);
const QUESTION_COUNT = 3;
const OPTION_COUNT = 4;

function parseId(value, name = 'id') {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id < 1) {
    throw badRequest('INVALID_ID', `${name} must be a positive integer`);
  }

  return id;
}

function validateDifficulty(value) {
  if (typeof value !== 'string' || !VALID_DIFFICULTIES.has(value)) {
    throw badRequest('DIFFICULTY_INVALID', 'difficulty must be beginner, intermediate, or advanced');
  }

  return value;
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

function validateRequiredUrl(value, fieldName = 'url') {
  if (typeof value !== 'string') {
    throw badRequest('MISSING_REQUIRED_FIELD', `${fieldName} is required`);
  }

  const url = value.trim();

  if (!url) {
    throw badRequest('MISSING_REQUIRED_FIELD', `${fieldName} is required`);
  }

  return url;
}

function assertQuizSetExists(quizSetRepository, quizSetId) {
  const quizSet = quizSetRepository.findById(quizSetId);

  if (!quizSet) {
    throw notFound('QUIZ_SET_NOT_FOUND', 'Slug Group not found');
  }

  return quizSet;
}

function assertEmptyQuizSet(quizRepository, quizSetId) {
  if (quizRepository.countBySetId(quizSetId) > 0) {
    throw badRequest(
      'AI_GENERATION_REQUIRES_EMPTY_SET',
      'AI generation can only run for an empty Slug Group'
    );
  }
}

function validateGeneratedQuestion(value, index) {
  if (!value || typeof value !== 'object') {
    throw badGateway('OUTPUT_SCHEMA_INVALID', `questions[${index}] must be an object`);
  }

  if (!Array.isArray(value.options) || value.options.length !== OPTION_COUNT) {
    throw badGateway('OUTPUT_SCHEMA_INVALID', `questions[${index}].options must contain exactly 4 items`);
  }

  if (value.answer_index !== 0) {
    throw badGateway('OUTPUT_SCHEMA_INVALID', `questions[${index}].answer_index must be 0`);
  }

  return {
    sortOrder: index + 1,
    question: validateRequiredText(value.question, `questions[${index}].question`),
    choices: value.options.map((option, optionIndex) => (
      validateRequiredText(option, `questions[${index}].options[${optionIndex}]`)
    )),
    correctPosition: 1,
    explanation: validateRequiredText(value.explanation, `questions[${index}].explanation`)
  };
}

function validateGeneratedQuizData(data) {
  if (!data || typeof data !== 'object') {
    throw badGateway('OUTPUT_SCHEMA_INVALID', 'AI Server returned missing quiz data');
  }

  if (!Array.isArray(data.questions) || data.questions.length !== QUESTION_COUNT) {
    throw badGateway('OUTPUT_SCHEMA_INVALID', 'AI Server must return exactly 3 questions');
  }

  return data.questions.map(validateGeneratedQuestion);
}

function storeGeneratedQuizzes({ quizRepository, quizSetId, generatedQuizzes }) {
  const timestamp = nowIso();
  const ids = [];

  for (const quiz of generatedQuizzes) {
    const id = quizRepository.create({
      quizSetId,
      sortOrder: quiz.sortOrder,
      question: quiz.question,
      choices: quiz.choices,
      correctPosition: quiz.correctPosition,
      explanation: quiz.explanation,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    ids.push(id);
  }

  return ids.map((id) => quizRepository.findById(id));
}

function buildGenerationResponse({ data, requestId, items }) {
  return {
    source: data.source || null,
    usage: data.usage || null,
    warning: data.source?.warning || null,
    requestId,
    items
  };
}

export function createAiQuizGenerationService({
  aiServerClient,
  quizRepository,
  quizSetRepository
}) {
  async function generate(setIdValue, payload, invokeAiServer) {
    const quizSetId = parseId(setIdValue, 'setId');
    assertQuizSetExists(quizSetRepository, quizSetId);
    assertEmptyQuizSet(quizRepository, quizSetId);

    const { data, requestId } = await invokeAiServer();
    const generatedQuizzes = validateGeneratedQuizData(data);
    const items = storeGeneratedQuizzes({ quizRepository, quizSetId, generatedQuizzes });

    return buildGenerationResponse({ data, requestId, items });
  }

  return {
    generateText(setIdValue, payload) {
      const content = validateRequiredText(payload?.content, 'content');
      const difficulty = validateDifficulty(payload?.difficulty);

      return generate(setIdValue, payload, () => (
        aiServerClient.generateTextQuiz({ content, difficulty })
      ));
    },

    generateWeb(setIdValue, payload) {
      const url = validateRequiredUrl(payload?.url);
      const difficulty = validateDifficulty(payload?.difficulty);

      return generate(setIdValue, payload, () => (
        aiServerClient.generateWebQuiz({ url, difficulty })
      ));
    },

    generateYoutube(setIdValue, payload) {
      const url = validateRequiredUrl(payload?.url);
      const difficulty = validateDifficulty(payload?.difficulty);

      return generate(setIdValue, payload, () => (
        aiServerClient.generateYoutubeQuiz({ url, difficulty })
      ));
    }
  };
}
