import { FC } from 'react';
import { MIN_FLOORS, MAX_FLOORS, MIN_ELEVATORS, MAX_ELEVATORS } from '@/store/constants';
import styles from './index.module.scss';

interface ControlPanelProps {
  numFloors: number;
  numElevators: number;
  onFloorsChange: (value: number) => void;
  onElevatorsChange: (value: number) => void;
  onReset: () => void;
  queueLength: number;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  numFloors,
  numElevators,
  onFloorsChange,
  onElevatorsChange,
  onReset,
}) => {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Settings</h2>
      <div className={styles.controls}>
        <div className={styles.control}>
          <label htmlFor="floors">Floors</label>
          <div className={styles.inputGroup}>
            <button
              onClick={() => numFloors > MIN_FLOORS && onFloorsChange(numFloors - 1)}
              disabled={numFloors <= MIN_FLOORS}
              aria-label="Decrease floors"
            >
              −
            </button>
            <input
              id="floors"
              type="number"
              min={MIN_FLOORS}
              max={MAX_FLOORS}
              value={numFloors}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                if (v >= MIN_FLOORS && v <= MAX_FLOORS) onFloorsChange(v);
              }}
              aria-label="Number of floors"
            />
            <button
              onClick={() => numFloors < MAX_FLOORS && onFloorsChange(numFloors + 1)}
              disabled={numFloors >= MAX_FLOORS}
              aria-label="Increase floors"
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.control}>
          <label htmlFor="elevators">Elevators</label>
          <div className={styles.inputGroup}>
            <button
              onClick={() => numElevators > MIN_ELEVATORS && onElevatorsChange(numElevators - 1)}
              disabled={numElevators <= MIN_ELEVATORS}
              aria-label="Decrease elevators"
            >
              −
            </button>
            <input
              id="elevators"
              type="number"
              min={MIN_ELEVATORS}
              max={MAX_ELEVATORS}
              value={numElevators}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                if (v >= MIN_ELEVATORS && v <= MAX_ELEVATORS) onElevatorsChange(v);
              }}
              aria-label="Number of elevators"
            />
            <button
              onClick={() => numElevators < MAX_ELEVATORS && onElevatorsChange(numElevators + 1)}
              disabled={numElevators >= MAX_ELEVATORS}
              aria-label="Increase elevators"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        Reset
      </button>
    </div>
  );
};
