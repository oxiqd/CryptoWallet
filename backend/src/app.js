import Fastify from 'fastify';

import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { walletRoutes } from './modules/wallet/wallet.routes.js';
import { transactionRoutes } from './modules/transactions/transaction.routes.js';

import { setupErrorHandler } from './plugins/error-handler.plugin.js';
import { jwtPlugin } from './plugins/jwt.plugin.js';
import { setupAuthenticate } from './plugins/authenticate.plugin.js';
import { cookiePlugin } from './plugins/cookie.plugin.js';
import { corsPlugin } from './plugins/cors.plugin.js';

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  setupErrorHandler(app);

  corsPlugin(app);
  cookiePlugin(app);
  jwtPlugin(app);
  setupAuthenticate(app);

  app.register(healthRoutes, {
    prefix: '/health',
  });

  app.register(authRoutes, {
    prefix: '/auth',
  });

  app.register(walletRoutes, {
    prefix: '/wallet',
  });

  app.register(transactionRoutes, {
    prefix: '/transactions',
  });

  return app;
};
