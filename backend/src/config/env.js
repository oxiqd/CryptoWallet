import { getRequiredEnv } from './get-required-env.js';
import { parseListEnv } from './parse-list-env.js';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  server: {
    host: process.env.SERVER_HOST ?? 'localhost',
    port: Number(process.env.PORT ?? process.env.SERVER_PORT ?? 3000),
  },

  db: {
    connectionString: process.env.DATABASE_URL,

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
  },

  auth: {
    jwtSecret: getRequiredEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',

    jwtRefreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },

  cors: {
    allowedOrigins: parseListEnv(process.env.CORS_ALLOWED_ORIGINS, [
      'http://localhost:5173',
      'http://localhost:5174',
    ]),
  },
};
