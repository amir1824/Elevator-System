import { FC } from 'react';
import { FloorRow } from '@/components/FloorRow';
import type { Elevator as ElevatorType, FloorStatus } from '@/store/types';
import styles from './index.module.scss';

interface BuildingProps {
  numFloors: number;
  elevators: ElevatorType[];
  floors: Record<number, FloorStatus>;
  onCall: (floor: number) => void;
  msPerFloor: number;
  arrivalDelay: number;
}

const getFloorName = (n: number): string =>
  n === 0 ? 'Ground Floor' : `${n}${['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : n % 10] || 'th'}`;

export const Building: FC<BuildingProps> = ({ numFloors, elevators, floors, onCall, msPerFloor, arrivalDelay }) => {
  const floorNums = Array.from({ length: numFloors }, (_, i) => numFloors - 1 - i);

  return (
    <div className={styles.building} data-testid="building">
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody className={styles.tbody}>
            {floorNums.map(floorNum => {
              const isSourceFloor = elevators.some(
                e => e.floor === floorNum && e.status === 'moving'
              );

              return (
                <FloorRow
                  key={floorNum}
                  floorNumber={floorNum}
                  floorName={getFloorName(floorNum)}
                  elevators={elevators}
                  floorStatus={floors[floorNum] || 'idle'}
                  msPerFloor={msPerFloor}
                  arrivalDelay={arrivalDelay}
                  onCall={onCall}
                  isSourceFloor={isSourceFloor}
                  styles={styles}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
