import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDatabase } from '../db/connection.js';
import { runMigrations } from '../db/migrations.js';
import { createApp } from '../app.js';

const tempRoot = resolve(process.cwd(), '..', 'tmp');
mkdirSync(tempRoot, { recursive: true });
const tempDir = mkdtempSync(resolve(tempRoot, 'phase2-'));
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

try {
  let response = await request('/health');
  assert(response.status === 200, 'health check should return 200');

  response = await request('/api/admin/quiz-sets/check-slug?postSlug=Intro-To-Marketing');
  assert(response.status === 200, 'check-slug should return 200');
  assert(response.body.postSlug === 'intro-to-marketing', 'check-slug should normalize slug');
  assert(response.body.available === true, 'new slug should be available');

  response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug: 'Intro-To-Marketing',
      postTitle: ' Marketing Basics ',
      status: 'draft'
    }
  });
  assert(response.status === 201, 'create should return 201');
  assert(response.body.postSlug === 'intro-to-marketing', 'create should normalize slug');
  const createdId = response.body.id;

  response = await request('/api/admin/quiz-sets');
  assert(response.status === 200, 'list should return 200');
  assert(response.body.summary.totalSets === 1, 'summary should count created set');
  assert(response.body.items.length === 1, 'list should return created set');

  response = await request('/api/admin/quiz-sets?query=marketing&status=draft');
  assert(response.status === 200, 'filtered list should return 200');
  assert(response.body.items.length === 1, 'filtered list should include matching set');

  response = await request(`/api/admin/quiz-sets/${createdId}`);
  assert(response.status === 200, 'detail should return 200');
  assert(response.body.id === createdId, 'detail should return created set');

  response = await request('/api/admin/quiz-sets/check-slug?postSlug=intro-to-marketing');
  assert(response.status === 200, 'check existing slug should return 200');
  assert(response.body.available === false, 'existing slug should be unavailable');

  response = await request(`/api/admin/quiz-sets/check-slug?postSlug=intro-to-marketing&excludeId=${createdId}`);
  assert(response.status === 200, 'check own slug should return 200');
  assert(response.body.available === true, 'own slug should be available with excludeId');

  response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug: 'intro-to-marketing',
      postTitle: 'Duplicate',
      status: 'draft'
    }
  });
  assert(response.status === 409, 'duplicate slug should return 409');

  response = await request('/api/admin/quiz-sets', {
    method: 'POST',
    body: {
      postSlug: 'bad_slug',
      postTitle: 'Bad Slug',
      status: 'draft'
    }
  });
  assert(response.status === 400, 'invalid slug should return 400');

  response = await request(`/api/admin/quiz-sets/${createdId}`, {
    method: 'PATCH',
    body: {
      postSlug: 'intro-to-marketing',
      postTitle: 'Marketing Basics Updated',
      status: 'published'
    }
  });
  assert(response.status === 400, 'incomplete set should not publish');

  response = await request(`/api/admin/quiz-sets/${createdId}`, {
    method: 'PATCH',
    body: {
      postSlug: 'intro-to-marketing',
      postTitle: 'Marketing Basics Updated',
      status: 'private'
    }
  });
  assert(response.status === 400, 'incomplete set should not use private status');

  response = await request(`/api/admin/quiz-sets/${createdId}`, {
    method: 'PATCH',
    body: {
      postTitle: 'Marketing Basics Updated'
    }
  });
  assert(response.status === 200, 'partial update should return 200');
  assert(response.body.postSlug === 'intro-to-marketing', 'partial update should preserve slug');

  response = await request(`/api/admin/quiz-sets/${createdId}`, {
    method: 'PATCH',
    body: {
      postSlug: 'marketing-basics',
      status: 'draft'
    }
  });
  assert(response.status === 200, 'update should return 200');
  assert(response.body.postSlug === 'marketing-basics', 'update should change slug');

  response = await request(`/api/admin/quiz-sets/${createdId}`, {
    method: 'DELETE'
  });
  assert(response.status === 200, 'delete should return 200');
  assert(response.body.deleted === true, 'delete should return deleted true');

  response = await request(`/api/admin/quiz-sets/${createdId}`);
  assert(response.status === 404, 'deleted set should return 404');

  console.log('Phase 2 smoke test passed');
} finally {
  await new Promise((resolveServer) => server.close(resolveServer));
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
}
