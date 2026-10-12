import cors from '@fastify/cors';

const allowedOrigins = ['http://localhost:5173'];

export const corsPlugin = async (app) => {
  app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST'],
  });
};
