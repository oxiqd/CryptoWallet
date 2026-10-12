import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-codes.js';

export const setupAuthenticate = (app) => {
  app.decorate('authenticate', async (request) => {
    try {
      await request.jwtVerify();

      if (!request.user?.sub) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED);
      }
    } catch {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }
  });
};
