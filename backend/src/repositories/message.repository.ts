import { run, get, all } from "../db/db";

export async function createMessage(data: {
  dutyId: number;
  message: string;
}) {
  const result = await run(
    `
    INSERT INTO duty_messages
    (dutyId, message)
    VALUES (?, ?)
    `,
    [data.dutyId, data.message]
  );

  return get(
    `
    SELECT *
    FROM duty_messages
    WHERE id = ?
    `,
    [result.id]
  );
}

export async function getAllMessages(
  dutyId?: number,
  sort: string = "createdAt",
  order: string = "DESC"
) {
  let sql = `
    SELECT *
    FROM duty_messages
  `;

  const params: any[] = [];

  if (dutyId) {
    sql += `
      WHERE dutyId = ?
    `;
    params.push(dutyId);
  }

  const allowedSorts = [
    "id",
    "createdAt"
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

export async function getMessageById(id: number) {
  return get(
    `
    SELECT *
    FROM duty_messages
    WHERE id = ?
    `,
    [id]
  );
}

export async function updateMessage(
  id: number,
  data: {
    dutyId: number;
    message: string;
  }
) {
  const result = await run(
    `
    UPDATE duty_messages
    SET
      dutyId = ?,
      message = ?
    WHERE id = ?
    `,
    [
      data.dutyId,
      data.message,
      id
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return getMessageById(id);
}

export async function deleteMessage(id: number) {
  const result = await run(
    `
    DELETE FROM duty_messages
    WHERE id = ?
    `,
    [id]
  );

  return result.changes > 0;
}

export async function getMessagesWithDuty(id: number) {
  return get(
    `
    SELECT
      m.id,
      m.message,
      m.createdAt,
      d.id as dutyId,
      d.name as dutyName,
      d.date,
      d.time
    FROM duty_messages m
    JOIN duties d
      ON m.dutyId = d.id
    WHERE m.id = ?
    `,
    [id]
  );
}