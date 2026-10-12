import { pool } from '../../db/pool.js';

export const getWalletByUserId = async (userId, db = pool) => {
  const result = await db.query(
    `
      SELECT
        id,
        user_id,
        created_at
      FROM wallets
      WHERE user_id = $1;
    `,
    [userId],
  );

  return result.rows[0];
};

export const getBalancesByWalletId = async (walletId, db = pool) => {
  const result = await db.query(
    `
      SELECT
        id,
        wallet_id,
        asset,
        amount,
        created_at
      FROM balances
      WHERE wallet_id = $1
      ORDER BY asset;
    `,
    [walletId],
  );

  return result.rows;
};

export const getBalance = async (db, walletId, asset) => {
  const result = await db.query(
    `
      SELECT amount
      FROM balances
      WHERE wallet_id = $1 AND asset = $2;
    `,
    [walletId, asset],
  );

  return result.rows[0]?.amount;
};

export const depositWalletData = async (db, asset, amount, walletId) => {
  const result = await db.query(
    `
      UPDATE balances
      SET amount = amount + $1
      WHERE wallet_id = $2 AND asset = $3
      RETURNING
        id,
        wallet_id,
        asset,
        amount,
        created_at;
    `,
    [amount, walletId, asset],
  );

  return result.rows[0];
};

export const withdrawalWalletData = async (db, asset, amount, walletId) => {
  const result = await db.query(
    `
      UPDATE balances
      SET amount = amount - $1
      WHERE wallet_id = $2 AND asset = $3
      RETURNING
        id,
        wallet_id,
        asset,
        amount,
        created_at;
    `,
    [amount, walletId, asset],
  );

  return result.rows[0];
};

export const createWallet = async (userId, db) => {
  const result = await db.query(
    `
      INSERT INTO wallets (user_id)
      VALUES ($1)
      RETURNING
        id,
        user_id,
        created_at;
    `,
    [userId],
  );

  return result.rows[0];
};

export const createInitialBalances = async (walletId, db) => {
  const result = await db.query(
    `
      INSERT INTO balances (wallet_id, asset, amount)
      VALUES
        ($1, 'BTC', 0),
        ($1, 'ETH', 0),
        ($1, 'USDT', 0)
      RETURNING
        id,
        wallet_id,
        asset,
        amount,
        created_at;
    `,
    [walletId],
  );

  return result.rows;
};
