import bcrypt from 'bcrypt';
import { withTransaction } from '../../db/with-transaction.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { AppError } from '../../errors/app-error.js';
import { createUser, getUserByEmail, getUserById } from '../users/user.repository.js';
import { createInitialBalances, createWallet } from '../wallet/wallet.repository.js';

const PASSWORD_SALT_ROUNDS = 10;

const normalizeEmail = (email) => email.trim().toLowerCase();

const toPublicUser = (user) => ({ id: user.id, email: user.email, createdAt: user.created_at });

export const registerUserService = async (data) => {
  const email = normalizeEmail(data.email);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);
  }

  const passwordHash = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS);

  return await withTransaction(async (db) => {
    const user = await createUser({ email, passwordHash }, db);

    const wallet = await createWallet(user.id, db);

    await createInitialBalances(wallet.id, db);

    return {
      user: toPublicUser(user),
      wallet: {
        id: wallet.id,
        createdAt: wallet.created_at,
      },
    };
  });
};

export const loginUserService = async (data) => {
  const email = normalizeEmail(data.email);

  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  }

  return {
    user: toPublicUser(user),
  };
};

export const refreshUserSessionService = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  return {
    user: toPublicUser(user),
  };
};
