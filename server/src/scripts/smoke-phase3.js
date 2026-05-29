import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDatabase } from '../db/connection.js';
import { runMigrations } from '../db/migrations.js';
import { createApp } from '../app.js';

const tempRoot = resolve(process.cwd(), '..', 'tmp');
mkdirSync(tempRoot, { recursive: true });
const tempDir = mkdtempSync(resolve(tempRoot, 'phase3-'));
const dbPath = resolve(tempDir, 'smoke.sqlite');
const db = openDatabase(dbPath);
const migrationsDir = resolve(import.meta.dirname, '../../..', 'migrations');

runMigrations(db, migrationsDir);

const app = createApp({ db });
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

function quizPayload(sortOrder) {
  return {
    sortOrder,
    question: `Question ${sortOrder}`,
    choices: [
      `Choice ${sortOrder}-1`,
      `Choice ${sortOrder}-2`,
      `Choice ${sortOrder}-3`,
      `Choice ${sortOrder}-4`
    ],
    correctPosition: 2,
    explanation: `Explanation ${sortOrder}`
  };
}

try {
  let response = await request('/health');
  assert(response.status === 200, 'health check should return 200');

  response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug: 'quiz-api-test',
      postTitle: 'Quiz API Test',
      status: 'private'
    }
  });
  assert(response.status === 201, 'quiz set create should return 201');
  const quizSetId = response.body.id;

  response = await request('/api/admin/quiz-sets/999/quizzes');
  assert(response.status === 404, 'missing Slug Group list should return 404');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: {
      ...quizPayload(1),
      postSlug: 'not-allowed'
    }
  });
  assert(response.status === 400, 'quiz create should reject postSlug');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: quizPayload(1)
  });
  assert(response.status === 201, 'quiz create should return 201');
  assert(response.body.sortOrder === 1, 'created quiz should return sortOrder');
  const quizId = response.body.id;

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`);
  assert(response.status === 200, 'quiz list should return 200');
  assert(response.body.items.length === 1, 'quiz list should return created quiz');

  response = await request(`/api/admin/quizzes/${quizId}`);
  assert(response.status === 200, 'quiz detail should return 200');
  assert(response.body.choices.length === 4, 'quiz detail should return 4 choices');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: quizPayload(1)
  });
  assert(response.status === 400, 'duplicate sortOrder should return 400');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: {
      ...quizPayload(4),
      sortOrder: 4
    }
  });
  assert(response.status === 400, 'invalid sortOrder should return 400');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: {
      ...quizPayload(2),
      correctPosition: 5
    }
  });
  assert(response.status === 400, 'invalid correctPosition should return 400');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: quizPayload(2)
  });
  assert(response.status === 201, 'second quiz create should return 201');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: quizPayload(3)
  });
  assert(response.status === 201, 'third quiz create should return 201');

  response = await request(`/api/admin/quiz-sets/${quizSetId}/quizzes`, {
    method: 'POST',
    body: {
      ...quizPayload(3),
      sortOrder: 3
    }
  });
  assert(response.status === 400, 'more than 3 quizzes should return 400');

  response = await request(`/api/admin/quizzes/${quizId}`, {
    method: 'PATCH',
    body: {
      question: 'Updated question',
      choices: ['A', 'B', 'C', 'D'],
      correctPosition: 4,
      explanation: 'Updated explanation'
    }
  });
  assert(response.status === 200, 'quiz update should return 200');
  assert(response.body.question === 'Updated question', 'quiz update should change question');
  assert(response.body.sortOrder === 1, 'partial update should preserve sortOrder');

  response = await request(`/api/admin/quizzes/${quizId}`, {
    method: 'PATCH',
    body: {
      sortOrder: 2
    }
  });
  assert(response.status === 400, 'update duplicate sortOrder should return 400');

  response = await request(`/api/admin/quizzes/${quizId}`, {
    method: 'DELETE'
  });
  assert(response.status === 200, 'quiz delete should return 200');
  assert(response.body.deleted === true, 'delete should return deleted true');

  response = await request(`/api/admin/quizzes/${quizId}`);
  assert(response.status === 404, 'deleted quiz should return 404');

  console.log('Phase 3 smoke test passed');
} finally {
  await new Promise((resolveServer) => server.close(resolveServer));
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
}

