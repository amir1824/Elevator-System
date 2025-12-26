import { FC, useState, useEffect, useRef, memo } from 'react';
import styles from './index.module.scss';

interface TimerProps {
  elevatorId: number;
  targetFloor: number;
  calculateTime: () => number | null;
  uniqueKey: string;
}

const TimerComponent: FC<TimerProps> = ({ 
  elevatorId,
  calculateTime,
  uniqueKey
}) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const updateSeconds = () => {
      if (!mountedRef.current) return;
      
      const timeRemaining = calculateTime();
      if (timeRemaining !== null && timeRemaining > 0) {
        setSeconds(Math.ceil(timeRemaining / 1000));
      } else {
        setSeconds(0);
      }
    };

    updateSeconds();
    intervalRef.current = window.setInterval(updateSeconds, 200);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [uniqueKey, calculateTime]);

  if (seconds <= 0) return null;

  const display = seconds >= 60
    ? `${Math.floor(seconds / 60)} min. ${seconds % 60} sec.`
    : `${seconds} Sec.`;

  return (
    <div className={styles.timer} data-testid={`elevator-timer-${elevatorId}`}>
      {display}
    </div>
  );
};

export const Timer = memo(TimerComponent, (prev, next) => {
  return prev.uniqueKey === next.uniqueKey;
});
