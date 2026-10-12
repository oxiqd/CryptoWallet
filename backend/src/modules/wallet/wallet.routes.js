import { getWallet } from './wallet.controller.js';

export const walletRoutes = async (app) => {
  app.get('/', {
    preHandler: [app.authenticate],
    handler: getWallet,
  });
};
