import styles from './Button.module.css';
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  );
}
