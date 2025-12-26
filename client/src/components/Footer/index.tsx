import { FC } from 'react';
import styles from './index.module.scss';

interface FooterProps {
  queueLength: number;
  movingElevators: number;
  idleElevators: number;
  arrivedElevators: number;
  totalCallsServed: number;
  avgWaitTime: number | null;
}

export const Footer: FC<FooterProps> = ({ 
  queueLength, 
  movingElevators,
  idleElevators,
  arrivedElevators,
  totalCallsServed,
  avgWaitTime
}) => {
  const formatWaitTime = (ms: number | null) => {
    if (ms === null) return 'N/A';
    const seconds = ms / 1000;
    if (seconds < 1) return '<1s';
    return `${seconds.toFixed(2)}s`;
  };

  const stats = [
    { label: 'QUEUE', value: queueLength },
    { label: 'MOVING', value: movingElevators },
    { label: 'IDLE', value: idleElevators },
    { label: 'ARRIVED', value: arrivedElevators },
    { label: 'SERVED', value: totalCallsServed },
    { label: 'AVG WAIT', value: formatWaitTime(avgWaitTime) },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.status}>
          <span className={styles.indicator} />
          <span className={styles.label}>LIVE CONTROL ACTIVE</span>
        </div>
        <div className={styles.stats}>
          {stats.map(({ label, value }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statLabel}>{label}:</span>
              <span className={styles.statValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
