import { FC, memo, useCallback } from 'react';
import clsx from 'clsx';
import type { FloorStatus } from '@/store/types';
import styles from './index.module.scss';

interface FloorProps {
  floorNumber: number;
  status: FloorStatus;
  onCall: (floor: number) => void;
}

const buttonText: Record<FloorStatus, string> = {
  idle: 'Call',
  waiting: 'Waiting',
  arrived: 'Arrived',
};

export const Floor: FC<FloorProps> = memo(({ floorNumber, status, onCall }) => {
  const handleClick = useCallback(() => onCall(floorNumber), [floorNumber, onCall]);

  return (
    <button
      className={clsx(styles.button, styles[status])}
      onClick={handleClick}
      disabled={status !== 'idle'}
      aria-label={`${buttonText[status]} elevator to floor ${floorNumber}`}
      data-testid={`call-button-${floorNumber}`}
      data-status={status}
    >
      {buttonText[status]}
    </button>
  );
});
