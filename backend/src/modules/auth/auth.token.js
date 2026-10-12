import { env } from '../../config/env.js';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const createAccessToken = (jwt, user) => {
  return jwt.sign({
    sub: String(user.id),
    email: user.email,
  });
};

export const createRefreshToken = (jwt, user) => {
  return jwt.refresh.sign({
    sub: String(user.id),
  });
};

export const setRefreshTokenCookie = (reply, refreshToken) => {
  const isProduction = env.nodeEnv === 'production';

  reply.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    path: '/auth',
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
};

export const clearRefreshTokenCookie = (reply) => {
  const isProduction = env.nodeEnv === 'production';

  reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    path: '/auth',
  });
};

export const verifyRefreshToken = (jwt, refreshToken) => {
  return jwt.refresh.verify(refreshToken);
};
