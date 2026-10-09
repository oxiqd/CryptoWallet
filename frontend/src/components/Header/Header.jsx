import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Brand from '../Brand/Brand';
import Button from '../Button/Button';
import styles from './Header.module.css';
export default function Header() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const handleLogout = async () => {
    setBusy(true);
    setError('');
    try {
      await logout();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Brand />
        <span className={styles.section}>Мой кошелёк</span>
        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">
            {user.email[0].toUpperCase()}
          </span>
          <span className={styles.email}>{user.email}</span>
          <Button variant="secondary" loading={busy} onClick={handleLogout}>
            {busy ? 'Выходим…' : 'Выйти'}
          </Button>
        </div>
      </div>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
    </header>
  );
}
