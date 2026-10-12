import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Brand from '../Brand/Brand';
import Button from '../Button/Button';
import styles from './AuthForm.module.css';

export default function AuthForm({ mode }) {
  const registering = mode === 'register';
  const { login, register, bootstrapError, bootstrap } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (
      password.length < 8 ||
      password.length > 72 ||
      new TextEncoder().encode(password).length > 72
    ) {
      setError('Пароль должен содержать от 8 символов и не более 72 байт.');
      return;
    }
    setBusy(true);
    try {
      await (registering ? register : login)({ email: email.trim(), password });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <Brand />
        <div className={styles.pitch}>
          <p className={styles.eyebrow}>ВАШИ АКТИВЫ. ВАШ ПОРЯДОК.</p>
          <h1>
            Всё, что нужно.
            <br />В одном кошельке<span>.</span>
          </h1>
          <p className={styles.description}>
            Управляйте активами и следите за каждой операцией в простом и понятном интерфейсе.
          </p>
          <div className={styles.art} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.coinB}>₿</div>
            <div className={styles.coinE}>♦</div>
            <div className={styles.coinT}>₮</div>
            <div className={styles.artCard}>
              <span>ВАШ КОШЕЛЁК</span>
              <strong>
                Три актива.
                <br />
                Один обзор.
              </strong>
              <div>
                <i /> Bitcoin <i /> Ethereum <i /> Tether
              </div>
            </div>
          </div>
        </div>
        <p className={styles.footer}>Crypto Wallet · Учебный проект</p>
        <a href="https://github.com/oxiqd" target="_blank" rel="noreferrer">
          by oxiqod
        </a>
      </aside>
      <main className={styles.main}>
        <div className={styles.mobileBrand}>
          <Brand />
        </div>
        <div className={styles.content}>
          <span className={styles.badge}>{registering ? 'НОВЫЙ АККАУНТ' : 'РАДЫ ВАС ВИДЕТЬ'}</span>
          <h2>{registering ? 'Создать кошелёк' : 'С возвращением'}</h2>
          <p className={styles.subtitle}>
            {registering
              ? 'Зарегистрируйтесь, чтобы начать работу с активами.'
              : 'Войдите, чтобы открыть свой кошелёк.'}
          </p>
          {bootstrapError && (
            <div className="error" role="alert">
              {bootstrapError}
              <button className={styles.retry} type="button" onClick={bootstrap}>
                Повторить подключение
              </button>
            </div>
          )}
          <form className={styles.form} onSubmit={submit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">Пароль</label>
            <div className={styles.password}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Не менее 8 символов"
                autoComplete={registering ? 'new-password' : 'current-password'}
                minLength={8}
                maxLength={72}
                required
                value={password}
                disabled={busy}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={busy}>
              {busy ? 'Подождите…' : registering ? 'Создать аккаунт →' : 'Войти в кошелёк →'}
            </Button>
          </form>
          <p className={styles.switch}>
            {registering ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}{' '}
            <Link to={registering ? '/login' : '/register'}>
              {registering ? 'Войти' : 'Зарегистрироваться'}
            </Link>
          </p>
          <p className={styles.disclaimer}>
            Учебный кошелёк для BTC, ETH и USDT.
            <br />
            Без реальных переводов в блокчейне.
          </p>
        </div>
      </main>
    </div>
  );
}
