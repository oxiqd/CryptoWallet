import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWallet } from '../../api/wallet.api';
import { getTransactions } from '../../api/transactions.api';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import BalanceList from '../../components/BalanceList/BalanceList';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionList from '../../components/TransactionList/TransactionList';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { request } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [updated, setUpdated] = useState(null);
  const controller = useRef(null);

  const load = useCallback(async () => {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setLoading(true);
    setErrors({});
    const results = await Promise.allSettled([
      getWallet(request, active.signal),
      getTransactions(request, active.signal),
    ]);
    if (active.signal.aborted) return;
    const nextErrors = {};
    if (results[0].status === 'fulfilled') setWallet(results[0].value);
    else nextErrors.wallet = results[0].reason.message;
    if (results[1].status === 'fulfilled') setTransactions(results[1].value);
    else nextErrors.transactions = results[1].reason.message;
    setErrors(nextErrors);
    setLoading(false);
    if (!Object.keys(nextErrors).length) setUpdated(new Date());
  }, [request]);
  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>ОБЗОР КОШЕЛЬКА</p>
            <h1>Ваши активы под рукой</h1>
            <p className={styles.subtitle}>Балансы и операции — всё в одном месте.</p>
          </div>
          <Button variant="secondary" onClick={load} loading={loading}>
            {loading ? 'Обновляем…' : '↻ Обновить'}
          </Button>
        </div>
        <div className={styles.grid}>
          <div className={styles.overview}>
            <Card
              title="Мои активы"
              subtitle="Доступные средства в кошельке"
              action={<span className={styles.tag}>3 актива</span>}
            >
              <BalanceList wallet={wallet} loading={loading} error={errors.wallet} />
              {errors.wallet && wallet && (
                <p className="error" role="alert">
                  Не удалось обновить баланс. {errors.wallet}
                </p>
              )}
              <div className={styles.walletFoot}>
                <span>Кошелёк {wallet ? `#${wallet.id}` : '—'}</span>
                <span>
                  {updated
                    ? `Обновлён в ${updated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Ожидаем данные'}
                </span>
              </div>
            </Card>
            <div className={styles.notice}>
              <span aria-hidden="true">◇</span>
              <div>
                <strong>Пространство для практики</strong>
                <p>
                  Пополняйте и списывайте активы, изучайте историю операций. Все балансы относятся к
                  учебному кошельку.
                </p>
              </div>
            </div>
          </div>
          <Card title="Новая операция" subtitle="Пополните кошелёк или спишите средства">
            <TransactionForm wallet={wallet} onCreated={load} />
          </Card>
        </div>
        <Card
          className={styles.history}
          title="История операций"
          subtitle="Все движения средств в вашем кошельке"
          action={<span className={styles.count}>{transactions?.length ?? '—'}</span>}
        >
          <TransactionList
            transactions={transactions}
            loading={loading}
            error={errors.transactions}
          />
          {errors.transactions && transactions && (
            <p className="error" role="alert">
              Не удалось обновить историю. {errors.transactions}
            </p>
          )}
        </Card>
        <footer className={styles.footer}>
          <span>
            Crypto Wallet{' '}
            <a href="https://github.com/oxiqd" target="_blank">
              by oxiqod
            </a>
          </span>
          <span>BTC · ETH · USDT</span>
        </footer>
      </main>
    </>
  );
}
