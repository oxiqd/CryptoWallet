export const ASSETS = ['BTC', 'ETH', 'USDT'];
export const assetNames = { BTC: 'Bitcoin', ETH: 'Ethereum', USDT: 'Tether' };

// Preserve PostgreSQL NUMERIC strings without rounding through Number.
export function formatAmount(value) {
  const [integer, decimal] = String(value ?? '0').split('.');
  const fraction = decimal?.replace(/0+$/, '');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${fraction ? `,${fraction}` : ''}`;
}
export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
}
