import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./data/database.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("SQLite connected");

    db.run("PRAGMA foreign_keys = ON");
  }
});

export default db;

export function run(
  sql: string,
  params: any[] = []
): Promise<{ id: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        changes: this.changes,
      });
    });
  });
}

export function get(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

export function all(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}