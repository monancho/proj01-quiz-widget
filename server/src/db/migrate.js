import { config } from 'dotenv';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { openDatabase, resolveDatabasePath } from './connection.js';

config();

const repoRoot = resolve(import.meta.dirname, '../../..');
const migrationsDir = resolve(repoRoot, 'migrations');
const db = openDatabase();

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL
  );
`);

const appliedRows = db
  .prepare('SELECT name FROM schema_migrations')
  .all();
const applied = new Set(appliedRows.map((row) => row.name));
const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

let appliedCount = 0;

for (const file of files) {
  if (applied.has(file)) {
    continue;
  }

  const sql = readFileSync(resolve(migrationsDir, file), 'utf8');

  try {
    db.exec('BEGIN;');
    db.exec(sql);
    db.prepare(
      'INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)'
    ).run(file, new Date().toISOString());
    db.exec('COMMIT;');
    appliedCount += 1;
    console.log(`Applied migration: ${basename(file)}`);
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

console.log(`Database: ${resolveDatabasePath()}`);
console.log(`Migrations applied: ${appliedCount}`);

