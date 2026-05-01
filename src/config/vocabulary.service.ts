import { VocabItem } from "@/types/vocabulary.types";
import { db } from "./database";

export const insertWord = (item: VocabItem) => {
  db.runSync(
    `INSERT OR IGNORE INTO vocabulary (word, meaning, phonetic, example, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [
      item.word,
      item.meaning,
      item.phonetic || '',
      item.example || '',
      new Date().toISOString(),
    ]
  );
};

export const getWords = (limit = 10, offset = 0) => {
  try {
    return db.getAllSync(
      `SELECT * FROM vocabulary
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  } catch (e) {
    console.error('DB Error:', e);
    return [];
  }
};

export const searchWords = (query: string) => {
  return db.getAllSync(
    `SELECT * FROM vocabulary
    WHERE word LIKE ? COLLATE NOCASE
    ORDER BY word
    LIMIT 20`,
    [`%${query}%`]
  );
};

export const toggleFavorite = (id: number) => {
  db.runSync(
    `UPDATE vocabulary
     SET isFavorite = NOT isFavorite
     WHERE id = ?`,
    [id]
  );
};

export const importJSON = (data: VocabItem[]) => {
  db.execSync('BEGIN TRANSACTION');

  try {
    data.forEach(item => {
      db.runSync(
        `INSERT INTO vocabulary (word, meaning, phonetic, example, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.word,
          item.meaning,
          item.phonetic || '',
          item.example || '',
          new Date().toISOString(),
        ]
      );
    });

    db.execSync('COMMIT');
  } catch (e) {
    db.execSync('ROLLBACK');
    throw e;
  }
};

export const insertManyWords = (items: any[]) => {
  db.execSync('BEGIN TRANSACTION');

  try {
    items.forEach(item => {
      db.runSync(
        `INSERT INTO vocabulary (word, meaning, phonetic, example, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.word,
          item.meaning,
          item.phonetic || '',
          item.example || '',
          new Date().toISOString(),
        ]
      );
    });

    db.execSync('COMMIT');
  } catch (e) {
    db.execSync('ROLLBACK');
    console.log('Bulk insert failed:', e);
  }
};
