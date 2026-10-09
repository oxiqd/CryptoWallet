import { apiClient } from './client';

export const login = (body) => apiClient('/auth/login', { method: 'POST', body });
export const register = (body) => apiClient('/auth/register', { method: 'POST', body });
export const refresh = () => apiClient('/auth/refresh', { method: 'POST' });
export const logout = () => apiClient('/auth/logout', { method: 'POST' });
