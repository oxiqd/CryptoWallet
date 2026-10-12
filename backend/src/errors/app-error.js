import { ERROR_MESSAGES } from './error-codes.js';

export class AppError extends Error {
  constructor(code) {
    super(ERROR_MESSAGES[code]);

    this.name = 'AppError';
    this.code = code;
  }
}
