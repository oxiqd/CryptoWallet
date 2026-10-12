import pg from 'pg';

import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool(
  env.db.connectionString
    ? {
        connectionString: env.db.connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: env.db.host,
        port: env.db.port,
        database: env.db.database,
        user: env.db.user,
        password: env.db.password,
      },
);
