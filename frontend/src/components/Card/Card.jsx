import styles from './Card.module.css';
export default function Card({ title, subtitle, children, action, className = '' }) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && (
        <div className={styles.heading}>
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
