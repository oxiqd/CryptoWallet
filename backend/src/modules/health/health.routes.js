import { getHealth } from './health.controller.js';

export const healthRoutes = async (app) => {
  app.get('/', getHealth);
};
