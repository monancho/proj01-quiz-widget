import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from '../app.js';
import { openDatabase } from '../db/connection.js';
import { runMigrations } from '../db/migrations.js';

const tempRoot = resolve(process.cwd(), '..', 'tmp');
mkdirSync(tempRoot, { recursive: true });
const tempDir = mkdtempSync(resolve(tempRoot, 'phase4-'));
const dbPath = resolve(tempDir, 'smoke.sqlite');
const db = openDatabase(dbPath);
const migrationsDir = resolve(import.meta.dirname, '../../..', 'migrations');

runMigrations(db, migrationsDir);

const app = createApp({
  db,
  env: {
    corsAllowedOrigins: 'http://localhost:5173,https://proj01.monancho.com'
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
    headers: response.headers,
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

async function createSet({ postSlug, postTitle, status = 'draft' }) {
  const response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug,
      postTitle,
      status
    }
  });
  assert(response.status === 201, `create set ${postSlug} should return 201`);
  return response.body;
}

async function createQuiz(setId, sortOrder) {
  const response = await request(`/api/admin/quiz-sets/${setId}/quizzes`, {
    method: 'POST',
    body: quizPayload(sortOrder)
  });
  assert(response.status === 201, `create quiz ${sortOrder} should return 201`);
  return response.body;
}

try {
  let response = await request('/health');
  assert(response.status === 200, 'health check should return 200');

  response = await request('/api/embed/missing-slug/quizzes');
  assert(response.status === 200, 'missing slug should return 200');
  assert(Array.isArray(response.body), 'missing slug should return array');
  assert(response.body.length === 0, 'missing slug should return empty array');

  const privateSet = await createSet({
    postSlug: 'private-set',
    postTitle: 'Private Set'
  });
  await createQuiz(privateSet.id, 1);
  await createQuiz(privateSet.id, 2);
  await createQuiz(privateSet.id, 3);

  response = await request(`/api/admin/quiz-sets/${privateSet.id}`, {
    method: 'PATCH',
    body: {
      postSlug: 'private-set',
      postTitle: 'Private Set',
      status: 'private'
    }
  });
  assert(response.status === 200, 'complete private set update should return 200');

  response = await request('/api/embed/private-set/quizzes');
  assert(response.status === 200, 'private set should return 200');
  assert(response.body.length === 0, 'private set should return empty array');

  const incompleteSet = await createSet({
    postSlug: 'incomplete-set',
    postTitle: 'Incomplete Set'
  });
  await createQuiz(incompleteSet.id, 1);
  await createQuiz(incompleteSet.id, 2);

  db.prepare("UPDATE quiz_sets SET status = 'published' WHERE id = ?").run(incompleteSet.id);

  response = await request('/api/embed/incomplete-set/quizzes');
  assert(response.status === 200, 'incomplete set should return 200');
  assert(response.body.length === 0, 'incomplete set should return empty array');

  const completeSet = await createSet({
    postSlug: 'complete-set',
    postTitle: 'Complete Set'
  });
  await createQuiz(completeSet.id, 1);
  await createQuiz(completeSet.id, 2);
  await createQuiz(completeSet.id, 3);

  response = await request(`/api/admin/quiz-sets/${completeSet.id}`, {
    method: 'PATCH',
    body: {
      postSlug: 'complete-set',
      postTitle: 'Complete Set',
      status: 'published'
    }
  });
  assert(response.status === 200, 'publishing complete set should return 200');

  response = await request('/api/embed/complete-set/quizzes', {
    headers: {
      origin: 'http://localhost:5173'
    }
  });
  assert(response.status === 200, 'complete published set should return 200');
  assert(response.headers.get('access-control-allow-origin') === 'http://localhost:5173', 'allowed CORS origin should echo');
  assert(Array.isArray(response.body), 'public response should be array');
  assert(response.body.length === 3, 'public response should include 3 quizzes');
  assert(response.body[0].choices.length === 4, 'public quiz should include 4 choices');
  assert(response.body[0].choices[0].position === 1, 'choice should include position');
  assert(response.body[0].answerPosition === 2, 'public quiz should include answerPosition');
  assert(response.body[0].correctAnswer === 'Choice 1-2', 'public quiz should include correctAnswer');
  assert(!Object.hasOwn(response.body, 'items'), 'public response should not be metadata wrapper');
  assert(!Object.hasOwn(response.body[0], 'quizSetId'), 'public quiz should not include admin quizSetId');

  response = await request('/api/embed/complete-set/quizzes', {
    headers: {
      origin: 'https://evil.example'
    }
  });
  assert(response.status === 200, 'disallowed CORS request should still return data');
  assert(response.headers.get('access-control-allow-origin') === null, 'disallowed CORS origin should not be echoed');

  console.log('Phase 4 smoke test passed');
} finally {
  await new Promise((resolveServer) => server.close(resolveServer));
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
}

