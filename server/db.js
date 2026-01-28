import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const defaultDbPath = path.resolve('data', 'quiz.db');

const ensureDbDir = (dbPath) => {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
};

export const initDb = async () => {
  const dbPath = process.env.SQLITE_DB_PATH
    ? path.resolve(process.env.SQLITE_DB_PATH)
    : defaultDbPath;

  ensureDbDir(dbPath);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT,
      company TEXT,
      role TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      name TEXT,
      company TEXT,
      role TEXT,
      total_score INTEGER,
      max_score INTEGER,
      percentage REAL,
      tier_name TEXT,
      tier_range TEXT,
      tier_color TEXT,
      tier_emoji TEXT,
      section_scores_json TEXT,
      recommendations_json TEXT,
      answers_json TEXT,
      submitted_at TEXT NOT NULL
    );
  `);

  return db;
};

