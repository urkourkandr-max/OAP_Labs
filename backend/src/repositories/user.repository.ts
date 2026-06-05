import { run, get, all } from "../db/db";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const result = await run(
    `
    INSERT INTO users
    (name, email, password)
    VALUES (?, ?, ?)
    `,
    [
      data.name,
      data.email,
      data.password,
    ]
  );

  return get(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [result.id]
  );
}

export async function getAllUsers(
  sort: string = "createdAt",
  order: string = "DESC",
  email?: string
) {
  let sql = `
    SELECT *
    FROM users
  `;

  const params: any[] = [];

  if (email) {
    sql += `
      WHERE email LIKE ?
    `;
    params.push(`%${email}%`);
  }

  const allowedSorts = [
    "id",
    "name",
    "email",
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

export async function getUserById(id: number) {
  return get(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [id]
  );
}

export async function updateUser(
  id: number,
  data: {
    name: string;
    email: string;
    password: string;
  }
) {
  const result = await run(
    `
    UPDATE users
    SET
      name = ?,
      email = ?,
      password = ?
    WHERE id = ?
    `,
    [
      data.name,
      data.email,
      data.password,
      id,
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return getUserById(id);
}

export async function deleteUser(id: number) {
  const result = await run(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [id]
  );

  return result.changes > 0;
}