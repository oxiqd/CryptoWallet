import {
  loginUserService,
  refreshUserSessionService,
  registerUserService,
} from './auth.service.js';

import {
  clearRefreshTokenCookie,
  createAccessToken,
  createRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from './auth.token.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { AppError } from '../../errors/app-error.js';

export const registerUser = async (request, reply) => {
  const result = await registerUserService(request.body);

  const accessToken = createAccessToken(request.server.jwt, result.user);
  const refreshToken = createRefreshToken(request.server.jwt, result.user);

  setRefreshTokenCookie(reply, refreshToken);

  return reply.code(201).send({
    data: {
      user: result.user,
      wallet: result.wallet,
      accessToken,
    },
  });
};

export const loginUser = async (request, reply) => {
  const result = await loginUserService(request.body);

  const accessToken = createAccessToken(request.server.jwt, result.user);
  const refreshToken = createRefreshToken(request.server.jwt, result.user);

  setRefreshTokenCookie(reply, refreshToken);

  return reply.send({
    data: {
      user: result.user,
      accessToken,
    },
  });
};

export const refreshUserSession = async (request) => {
  const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  let payload;

  try {
    payload = verifyRefreshToken(request.server.jwt, refreshToken);
  } catch {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  const result = await refreshUserSessionService(Number(payload.sub));

  const accessToken = createAccessToken(request.server.jwt, result.user);

  return {
    data: {
      user: result.user,
      accessToken,
    },
  };
};

export const logoutUser = async (_request, reply) => {
  clearRefreshTokenCookie(reply);

  return reply.send({
    data: {
      success: true,
    },
  });
};
