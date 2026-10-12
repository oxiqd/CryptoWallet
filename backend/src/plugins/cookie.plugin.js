import cookie from '@fastify/cookie';

export const cookiePlugin = async (app) => {
  app.register(cookie);
};
