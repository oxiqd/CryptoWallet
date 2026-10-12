const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const messages = {
  'Invalid email or password': 'Неверный email или пароль.',
  'User already exists': 'Аккаунт с таким email уже существует.',
  'Insufficient funds': 'Недостаточно средств для списания.',
  Unauthorized: 'Сессия завершена. Войдите снова.',
  'Invalid request data': 'Проверьте заполненные поля.',
  'Wallet not found': 'Кошелёк не найден.',
  'Transaction not found': 'Операция не найдена.',
};

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiClient(path, { method = 'GET', body, token, signal } = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: 'include',
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(
      'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.',
    );
  }
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      messages[result?.error] ||
        (response.status >= 500
          ? 'На сервере произошла ошибка. Попробуйте позже.'
          : 'Не удалось выполнить запрос. Попробуйте снова.'),
      response.status,
    );
  }
  if (!result || !Object.hasOwn(result, 'data')) {
    throw new ApiError('Сервер вернул неожиданный ответ.', response.status);
  }
  return result.data;
}
