import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('vocab.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE,
      meaning TEXT,
      phonetic TEXT,
      example TEXT,
      isFavorite INTEGER DEFAULT 0,
      createdAt TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_word ON vocabulary(word);
  `);
};
