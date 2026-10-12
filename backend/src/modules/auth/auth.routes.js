import { loginUser, logoutUser, refreshUserSession, registerUser } from './auth.controller.js';

import { loginSchema, registerSchema } from './auth.schema.js';

export const authRoutes = async (app) => {
  app.post('/register', {
    schema: registerSchema,
    handler: registerUser,
  });

  app.post('/login', {
    schema: loginSchema,
    handler: loginUser,
  });

  app.post('/refresh', refreshUserSession);

  app.post('/logout', logoutUser);
};
