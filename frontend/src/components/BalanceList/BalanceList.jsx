import { ASSETS, assetNames, formatAmount } from '../../utils/format';
import styles from './BalanceList.module.css';
function AssetIcon({ asset }) {
  return (
    <span className={`${styles.icon} ${styles[asset]}`} aria-hidden="true">
      {{ BTC: '₿', ETH: '♦', USDT: '₮' }[asset]}
    </span>
  );
}
export default function BalanceList({ wallet, loading, error }) {
  if (loading && !wallet)
    return (
      <p className={styles.state} role="status">
        Загружаем балансы…
      </p>
    );
  if (error && !wallet)
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  if (!wallet?.balances?.length)
    return <p className={styles.state}>В кошельке пока нет активов.</p>;
  return (
    <div className={styles.list} aria-busy={loading}>
      {ASSETS.map((asset) => {
        const balance = wallet.balances.find((item) => item.asset === asset);
        return (
          <div className={styles.row} key={asset}>
            <AssetIcon asset={asset} />
            <div className={styles.name}>
              <strong>{assetNames[asset]}</strong>
              <span>{asset}</span>
            </div>
            <div className={styles.amount}>
              <strong>{balance ? formatAmount(balance.amount) : '—'}</strong>
              <span>{asset}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
