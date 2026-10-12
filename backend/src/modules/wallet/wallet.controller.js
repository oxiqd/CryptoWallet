import { walletGetService } from './wallet.service.js';

export const getWallet = async (request) => {
  const userId = Number(request.user.sub);

  const wallet = await walletGetService(userId);

  return {
    data: wallet,
  };
};
