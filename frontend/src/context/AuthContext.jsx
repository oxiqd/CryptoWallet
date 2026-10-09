import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as authApi from '../api/auth.api';
import { apiClient, ApiError } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState('');
  const sessionRef = useRef(null);
  const refreshRef = useRef(null);
  const generation = useRef(0);

  const saveSession = useCallback((value) => {
    sessionRef.current = value;
    setSession(value);
  }, []);

  const refresh = useCallback(() => {
    if (!refreshRef.current) {
      const current = generation.current;
      const pending = authApi
        .refresh()
        .then((value) => {
          if (generation.current !== current) throw new ApiError('Сессия завершена.', 401);
          saveSession(value);
          return value;
        })
        .catch((error) => {
          if (generation.current === current) saveSession(null);
          throw error;
        })
        .finally(() => {
          if (refreshRef.current === pending) refreshRef.current = null;
        });
      refreshRef.current = pending;
    }
    return refreshRef.current;
  }, [saveSession]);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setBootstrapError('');
    try {
      await refresh();
    } catch (error) {
      if (error.status !== 401) setBootstrapError(error.message);
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const authenticate = async (action, body) => {
    const value = await action(body);
    generation.current += 1;
    saveSession(value);
    setBootstrapError('');
  };

  const logout = async () => {
    // Keep the session on failure: the cookie has not been cleared by the server.
    await authApi.logout();
    generation.current += 1;
    saveSession(null);
  };

  const request = useCallback(
    async (path, options = {}) => {
      const current = generation.current;
      const token = sessionRef.current?.accessToken;
      if (!token) throw new ApiError('Войдите в аккаунт.', 401);
      try {
        return await apiClient(path, { ...options, token });
      } catch (error) {
        if (error.status !== 401 || generation.current !== current) throw error;
        // A parallel request may already have renewed the token.
        const renewed =
          sessionRef.current?.accessToken !== token ? sessionRef.current : await refresh();
        if (!renewed || generation.current !== current) throw error;
        try {
          return await apiClient(path, { ...options, token: renewed.accessToken });
        } catch (retryError) {
          if (retryError.status === 401 && generation.current === current) {
            generation.current += 1;
            saveSession(null);
          }
          throw retryError;
        }
      }
    },
    [refresh, saveSession],
  );

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        accessToken: session?.accessToken,
        isAuthenticated: Boolean(session),
        isLoading,
        bootstrapError,
        bootstrap,
        login: (body) => authenticate(authApi.login, body),
        register: (body) => authenticate(authApi.register, body),
        logout,
        refresh,
        request,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
