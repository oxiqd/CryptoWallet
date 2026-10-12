import { pool } from '../../db/pool.js';

export const getUserByEmail = async (email, db = pool) => {
  const result = await db.query(
    `
      SELECT
        id,
        email,
        password_hash,
        created_at
      FROM users
      WHERE email = $1;
    `,
    [email],
  );

  return result.rows[0];
};

export const getUserById = async (id, db = pool) => {
  const result = await db.query(
    `
      SELECT
        id,
        email,
        created_at
      FROM users
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0];
};

export const createUser = async (data, db = pool) => {
  const result = await db.query(
    `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING
        id,
        email,
        created_at;
    `,
    [data.email, data.passwordHash],
  );

  return result.rows[0];
};
