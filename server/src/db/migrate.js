import { config } from 'dotenv';
import { resolve } from 'node:path';
import { openDatabase, resolveDatabasePath } from './connection.js';
import { runMigrations } from './migrations.js';

config();

const repoRoot = resolve(import.meta.dirname, '../../..');
const migrationsDir = resolve(repoRoot, 'migrations');
const db = openDatabase();
const appliedFiles = runMigrations(db, migrationsDir);

for (const file of appliedFiles) {
  console.log(`Applied migration: ${file}`);
}

console.log(`Database: ${resolveDatabasePath()}`);
console.log(`Migrations applied: ${appliedFiles.length}`);
