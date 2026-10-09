import { useState } from 'react';
import { createTransaction } from '../../api/transactions.api';
import { useAuth } from '../../context/AuthContext';
import { ASSETS, formatAmount } from '../../utils/format';
import Button from '../Button/Button';
import styles from './TransactionForm.module.css';

export default function TransactionForm({ wallet, onCreated }) {
  const { request } = useAuth();
  const [type, setType] = useState('deposit');
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const balance = wallet?.balances.find((item) => item.asset === asset)?.amount;
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError('');
    setSuccess('');
    const numericAmount = Number(amount.replace(',', '.'));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Введите сумму больше нуля.');
      return;
    }
    setBusy(true);
    try {
      await createTransaction(request, { type, asset, amount: numericAmount });
      setAmount('');
      setSuccess(type === 'deposit' ? 'Пополнение выполнено.' : 'Списание выполнено.');
      await onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className={styles.form}>
      <label>
        Тип операции
        <select
          value={type}
          disabled={busy}
          onChange={(e) => {
            setType(e.target.value);
            setSuccess('');
          }}
        >
          <option value="deposit">Пополнение</option>
          <option value="withdrawal">Списание</option>
        </select>
      </label>
      <label>
        Актив
        <select value={asset} disabled={busy} onChange={(e) => setAsset(e.target.value)}>
          {ASSETS.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label htmlFor="amount">Сумма</label>
      <div className={styles.amount}>
        <input
          id="amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          value={amount}
          disabled={busy}
          onChange={(e) => setAmount(e.target.value)}
          required
          aria-describedby="available"
        />
        <span>{asset}</span>
      </div>
      <p id="available" className={styles.available}>
        Доступно: {balance === undefined ? '—' : formatAmount(balance)} {asset}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="success" role="status">
          {success}
        </p>
      )}
      <Button type="submit" loading={busy}>
        {busy
          ? 'Выполняем операцию…'
          : type === 'deposit'
            ? '＋ Пополнить кошелёк'
            : '↗ Списать средства'}
      </Button>
      <p className={styles.note}>
        Операции учитываются внутри кошелька.
        <br />
        Переводы в блокчейне не выполняются.
      </p>
    </form>
  );
}
