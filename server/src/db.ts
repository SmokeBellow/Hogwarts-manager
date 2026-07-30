import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "hogwarts.db");
export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  backstory_id TEXT NOT NULL,
  house TEXT,
  sorting_answers TEXT NOT NULL DEFAULT '[]',
  year INTEGER NOT NULL DEFAULT 1,
  week INTEGER NOT NULL DEFAULT 1,
  phase TEXT NOT NULL DEFAULT 'sorting',
  stats TEXT NOT NULL DEFAULT '{}',
  grades TEXT NOT NULL DEFAULT '{}',
  friends TEXT NOT NULL DEFAULT '[]',
  relationship TEXT,
  clubs TEXT NOT NULL DEFAULT '[]',
  pet TEXT,
  studied_topics TEXT NOT NULL DEFAULT '[]',
  house_points INTEGER NOT NULL DEFAULT 0,
  seen_events TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  quidditch_position TEXT,
  story_flags TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  week INTEGER NOT NULL,
  event_id TEXT NOT NULL,
  choice_id TEXT,
  outcome_id TEXT,
  outcome_text TEXT NOT NULL,
  deltas TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exam_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade_letter TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// Migration from the old email-based login to nickname-based login. The old
// `users` table had `email TEXT UNIQUE NOT NULL`; SQLite can't drop a NOT NULL
// constraint via ALTER, so the table is rebuilt with the new shape instead.
try {
  const columns = db.prepare(`PRAGMA table_info(users)`).all() as { name: string }[];
  const hasEmail = columns.some((c) => c.name === "email");
  const hasUsername = columns.some((c) => c.name === "username");
  if (hasEmail) {
    db.exec(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      INSERT INTO users_new (id, username, password_hash, created_at)
        SELECT id, ${hasUsername ? "COALESCE(username, email)" : "email"}, password_hash, created_at FROM users;
      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
  }
} catch {
  // best-effort migration; fine to skip on fresh databases
}

// Migrations for databases created before these columns existed.
try {
  db.exec(`ALTER TABLE characters ADD COLUMN quidditch_position TEXT`);
} catch {
  // column already exists
}
try {
  db.exec(`ALTER TABLE characters ADD COLUMN story_flags TEXT NOT NULL DEFAULT '{}'`);
} catch {
  // column already exists
}
