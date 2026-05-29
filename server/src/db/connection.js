import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { getEnv } from '../config/env.js';

export function resolveDatabasePath(databasePath = getEnv().databasePath) {
  return resolve(process.cwd(), databasePath);
}

export function openDatabase(databasePath = getEnv().databasePath) {
  const resolvedPath = resolveDatabasePath(databasePath);
  mkdirSync(dirname(resolvedPath), { recursive: true });

  const db = new DatabaseSync(resolvedPath);
  db.exec('PRAGMA foreign_keys = ON;');

  return db;
}

