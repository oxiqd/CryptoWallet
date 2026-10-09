import styles from './Brand.module.css';
export default function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.mark} aria-hidden="true">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 6h13v12H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11M14 10h7v5h-7z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="12.5" r=".8" fill="currentColor" />
        </svg>
      </span>
      Crypto<span className={styles.light}>Wallet</span>
    </span>
  );
}
