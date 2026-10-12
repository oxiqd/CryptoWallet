import {
  createTransaction,
  getTransactionById,
  getTransactionsByWalletId,
} from './transaction.repository.js';

import {
  depositWalletData,
  getBalance,
  getWalletByUserId,
  withdrawalWalletData,
} from '../wallet/wallet.repository.js';

import { withTransaction } from '../../db/with-transaction.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { AppError } from '../../errors/app-error.js';

const getRequiredWalletByUserId = async (userId, db) => {
  const wallet = await getWalletByUserId(userId, db);

  if (!wallet) {
    throw new AppError(ERROR_CODES.WALLET_NOT_FOUND);
  }

  return wallet;
};

export const transactionGetService = async (userId) => {
  const wallet = await getRequiredWalletByUserId(userId);

  return await getTransactionsByWalletId(wallet.id);
};

export const transactionGetByIdService = async (userId, transactionId) => {
  const wallet = await getRequiredWalletByUserId(userId);

  const transaction = await getTransactionById(wallet.id, transactionId);

  if (!transaction) {
    throw new AppError(ERROR_CODES.TRANSACTION_NOT_FOUND);
  }

  return transaction;
};

export const transactionCreateService = async (userId, data) => {
  return await withTransaction(async (db) => {
    const wallet = await getRequiredWalletByUserId(userId, db);

    if (data.type === 'deposit') {
      await depositWalletData(db, data.asset, data.amount, wallet.id);
    }

    if (data.type === 'withdrawal') {
      const balance = await getBalance(db, wallet.id, data.asset);

      if (Number(balance) < data.amount) {
        throw new AppError(ERROR_CODES.INSUFFICIENT_FUNDS);
      }

      await withdrawalWalletData(db, data.asset, data.amount, wallet.id);
    }

    return await createTransaction(db, {
      walletId: wallet.id,
      type: data.type,
      asset: data.asset,
      amount: data.amount,
    });
  });
};
