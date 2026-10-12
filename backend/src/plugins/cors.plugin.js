import cors from '@fastify/cors';

import { env } from '../config/env.js';

export const corsPlugin = async (app) => {
  app.register(cors, {
    origin: env.cors.allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
};
