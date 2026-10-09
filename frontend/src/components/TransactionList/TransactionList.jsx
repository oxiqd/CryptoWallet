import { useState } from 'react';
import { formatAmount, formatDate } from '../../utils/format';
import styles from './TransactionList.module.css';
export default function TransactionList({ transactions, loading, error }) {
  const [filter, setFilter] = useState('all');
  if (loading && !transactions)
    return (
      <p className={styles.empty} role="status">
        Загружаем историю…
      </p>
    );
  if (error && !transactions)
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  const items = (transactions || [])
    .filter((item) => filter === 'all' || item.type === filter)
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id));
  return (
    <div aria-busy={loading}>
      <div className={styles.filters} role="group" aria-label="Фильтр операций">
        {[
          ['all', 'Все операции'],
          ['deposit', 'Пополнения'],
          ['withdrawal', 'Списания'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            className={filter === value ? styles.active : ''}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {!items.length ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            ⇄
          </span>
          <h3>{filter === 'all' ? 'История начинается здесь' : 'Таких операций пока нет'}</h3>
          <p>
            {filter === 'all'
              ? 'Пополните кошелёк — первая операция появится в этом списке.'
              : 'Выберите другой фильтр или создайте новую операцию.'}
          </p>
        </div>
      ) : (
        <div className={styles.scroll}>
          <table>
            <caption className={styles.srOnly}>История операций кошелька</caption>
            <thead>
              <tr>
                <th>Операция</th>
                <th>Актив</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span
                      className={`${styles.direction} ${item.type === 'deposit' ? styles.deposit : styles.withdrawal}`}
                      aria-hidden="true"
                    >
                      {item.type === 'deposit' ? '↙' : '↗'}
                    </span>
                    {item.type === 'deposit' ? 'Пополнение' : 'Списание'}
                  </td>
                  <td>{item.asset}</td>
                  <td className={item.type === 'deposit' ? styles.positive : ''}>
                    {item.type === 'deposit' ? '+' : '−'}
                    {formatAmount(item.amount)}
                  </td>
                  <td className={styles.date}>{formatDate(item.created_at)}</td>
                  <td className={styles.date}>#{item.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
