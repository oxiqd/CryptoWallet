export const getTransactions = (request, signal) => request('/transactions', { signal });
export const createTransaction = (request, body) =>
  request('/transactions', { method: 'POST', body });
