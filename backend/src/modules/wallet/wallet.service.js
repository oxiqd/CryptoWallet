import { getBalancesByWalletId, getWalletByUserId } from './wallet.repository.js';

import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';

export const walletGetService = async (userId) => {
  const wallet = await getWalletByUserId(userId);

  if (!wallet) {
    throw new AppError(ERROR_CODES.WALLET_NOT_FOUND);
  }

  const balances = await getBalancesByWalletId(wallet.id);

  return {
    id: wallet.id,
    userId: wallet.user_id,
    createdAt: wallet.created_at,
    balances,
  };
};
