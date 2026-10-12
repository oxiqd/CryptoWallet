import { pool } from '../../db/pool.js';

export const getTransactionsByWalletId = async (walletId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      wallet_id,
      type,
      asset,
      amount,
      created_at
    FROM transactions
    WHERE wallet_id = $1
    ORDER BY id;
  `,
    [walletId],
  );

  return result.rows;
};

export const getTransactionById = async (walletId, transactionId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      wallet_id,
      type,
      asset,
      amount,
      created_at
    FROM transactions
    WHERE wallet_id = $1
      AND id = $2;
  `,
    [walletId, transactionId],
  );

  return result.rows[0];
};

export const createTransaction = async (db, data) => {
  const result = await db.query(
    `
    INSERT INTO transactions (wallet_id, type, asset, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      wallet_id,
      type,
      asset,
      amount,
      created_at;
  `,
    [data.walletId, data.type, data.asset, data.amount],
  );

  return result.rows[0];
};
