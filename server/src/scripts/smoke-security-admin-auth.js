import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from '../app.js';
import { openDatabase } from '../db/connection.js';
import { runMigrations } from '../db/migrations.js';

const adminToken = 'smoke-admin-token';
const tempRoot = resolve(process.cwd(), '..', 'tmp');
mkdirSync(tempRoot, { recursive: true });
const tempDir = mkdtempSync(resolve(tempRoot, 'security-'));
const dbPath = resolve(tempDir, 'smoke.sqlite');
const db = openDatabase(dbPath);
const migrationsDir = resolve(import.meta.dirname, '../../..', 'migrations');

runMigrations(db, migrationsDir);

const app = createApp({
  db,
  env: {
    nodeEnv: 'production',
    port: 3000,
    databasePath: dbPath,
    corsAllowedOrigins: 'http://localhost:5173',
    tistoryHomeUrl: 'https://example.tistory.com',
    adminApiToken: adminToken
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
    ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
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
    body,
    headers: response.headers
  };
}

try {
  let response = await request('/api/admin/quiz-sets');
  assert(response.status === 401, 'admin list without token should return 401');
  assert(response.body.error.code === 'ADMIN_AUTH_REQUIRED', 'missing token should return auth code');

  response = await request('/api/admin/quiz-sets', { token: 'wrong-token' });
  assert(response.status === 401, 'admin list with wrong token should return 401');

  response = await request('/api/admin/quiz-sets', { token: adminToken });
  assert(response.status === 200, 'admin list with token should return 200');

  response = await request('/api/admin/quiz-sets', {
    method: 'OPTIONS',
    headers: {
      origin: 'http://localhost:5173',
      'access-control-request-method': 'GET',
      'access-control-request-headers': 'authorization'
    }
  });
  assert(response.status === 204, 'admin preflight should return 204');
  assert(
    response.headers.get('access-control-allow-headers')?.includes('Authorization'),
    'preflight should allow Authorization header'
  );

  response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    token: adminToken,
    body: {
      postSlug: 'security-smoke',
      postTitle: 'Security Smoke',
      status: 'draft'
    }
  });
  assert(response.status === 201, 'authenticated set create should return 201');
  const setId = response.body.id;

  for (let index = 1; index <= 3; index += 1) {
    response = await request(`/api/admin/quiz-sets/${setId}/quizzes`, {
      method: 'POST',
      token: adminToken,
      body: {
        question: `Question ${index}`,
        choices: ['A', 'B', 'C', 'D'],
        correctPosition: 1,
        explanation: `Explanation ${index}`
      }
    });
    assert(response.status === 201, `authenticated quiz ${index} create should return 201`);
  }

  response = await request(`/api/admin/quiz-sets/${setId}`, {
    method: 'PATCH',
    token: adminToken,
    body: {
      status: 'published'
    }
  });
  assert(response.status === 200, 'authenticated publish should return 200');

  response = await request('/api/embed/security-smoke/quizzes');
  assert(response.status === 200, 'public embed should remain unauthenticated');
  assert(response.body.length === 3, 'public embed should return published quizzes');

  console.log('Security admin auth smoke test passed');
} finally {
  await new Promise((resolveServer) => server.close(resolveServer));
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
}
