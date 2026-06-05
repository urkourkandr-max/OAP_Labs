import sqlite3 from "sqlite3";
import db, { run, get, all } from "../db/db";

export async function createDuty(data: {
  name: string;
  date: string;
  time: string;
  comment?: string;
  userId: number;
}) {
  const result = await run(
    `
    INSERT INTO duties
    (name, date, time, comment, userId)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.date,
      data.time,
      data.comment ?? "",
      data.userId,
    ]
  );

  return get(
    `
    SELECT *
    FROM duties
    WHERE id = ?
    `,
    [result.id]
  );
}

export async function getAllDuties(
  userId?: number,
  sort: string = "createdAt",
  order: string = "DESC"
) {
  let sql = `
    SELECT *
    FROM duties
  `;

  const params: any[] = [];

  if (userId) {
    sql += ` WHERE userId = ?`;
    params.push(userId);
  }

  const allowedSorts = [
    "id",
    "name",
    "date",
    "createdAt",
  ];

  const safeSort = allowedSorts.includes(sort)
    ? sort
    : "createdAt";

  const safeOrder =
    order?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  sql += `
    ORDER BY ${safeSort} ${safeOrder}
  `;

  return all(sql, params);
}

export async function getDutyById(id: number) {
  return get(
    `
    SELECT *
    FROM duties
    WHERE id = ?
    `,
    [id]
  );
}

export async function updateDuty(
  id: number,
  data: {
    name: string;
    date: string;
    time: string;
    comment?: string;
    userId: number;
  }
) {
  const result = await run(
    `
    UPDATE duties
    SET
      name = ?,
      date = ?,
      time = ?,
      comment = ?,
      userId = ?
    WHERE id = ?
    `,
    [
      data.name,
      data.date,
      data.time,
      data.comment ?? "",
      data.userId,
      id,
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return getDutyById(id);
}

export async function deleteDuty(id: number) {
  const result = await run(
    `
    DELETE FROM duties
    WHERE id = ?
    `,
    [id]
  );

  return result.changes > 0;
}

export async function getLatestDutiesByUser(
  userId: number
) {
  return all(
    `
    SELECT *
    FROM duties
    WHERE userId = ?
    ORDER BY createdAt DESC
    LIMIT 10
    `,
    [userId]
  );
}

export async function getDutyWithUser(id: number) {
  return get(
    `
    SELECT
      d.id,
      d.name,
      d.date,
      d.time,
      d.comment,
      d.createdAt,
      u.id AS userId,
      u.name AS userName,
      u.email AS userEmail
    FROM duties d
    JOIN users u
      ON d.userId = u.id
    WHERE d.id = ?
    `,
    [id]
  );
}

export async function createDutyWithMessage(data: {
  name: string;
  date: string;
  time: string;
  comment?: string;
  userId: number;
  firstMessage: string;
}) {
  return new Promise<{ success: boolean; dutyId: number }>(
    (resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run(
          `
          INSERT INTO duties
          (name, date, time, comment, userId)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            data.name,
            data.date,
            data.time,
            data.comment ?? "",
            data.userId,
          ],
          function (this: sqlite3.RunResult, err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            const dutyId = this.lastID;

            db.run(
              `
              INSERT INTO duty_messages
              (dutyId, message)
              VALUES (?, ?)
              `,
              [dutyId, data.firstMessage],
              (err2) => {
                if (err2) {
                  db.run("ROLLBACK");
                  return reject(err2);
                }

                db.run("COMMIT", (err3) => {
                  if (err3) {
                    db.run("ROLLBACK");
                    return reject(err3);
                  }

                  resolve({
                    success: true,
                    dutyId,
                  });
                });
              }
            );
          }
        );
      });
    }
  );
}