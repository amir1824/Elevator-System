import { FC, memo, useMemo } from 'react';
import clsx from 'clsx';
import { Floor } from '@/components/Floor';
import { ElevatorVisual } from '@/components/ElevatorVisual';
import { Timer } from '@/components/Timer';
import type { Elevator, FloorStatus } from '@/store/types';
import { calculateRemainingTime } from '@/store/utils/timeCalculations';

interface FloorRowProps {
  floorNumber: number;
  floorName: string;
  elevators: Elevator[];
  floorStatus: FloorStatus;
  msPerFloor: number;
  arrivalDelay: number;
  onCall: (floor: number) => void;
  isSourceFloor: boolean;
  styles: Record<string, string>;
}

const FloorRowComponent: FC<FloorRowProps> = ({
  floorNumber,
  floorName,
  elevators,
  floorStatus,
  msPerFloor,
  arrivalDelay,
  onCall,
  isSourceFloor,
  styles
}) => {
  const timerData = useMemo(() => {
    return elevators.map(e => {
      const hasDestinations = (e.status === 'moving' || e.status === 'arrived') && e.destinations?.length > 0;
      const isInDestinations = hasDestinations && e.destinations.includes(floorNumber);
      
      const isAtIntermediateStop = e.status === 'arrived' && e.floor !== floorNumber;
      const isMovingToTarget = e.status === 'moving';
      const shouldShow = isInDestinations && (isMovingToTarget || isAtIntermediateStop);
      
      return {
        elevatorId: e.id,
        shouldShow,
        key: `timer-${e.id}-${floorNumber}-${e.revision}`,
        elevator: e
      };
    });
  }, [elevators, floorNumber]);

  return (
    <tr
      className={styles.row}
      style={{ zIndex: isSourceFloor ? 100 : 1 }}
      data-testid={`floor-${floorNumber}`}
    >
      <td className={clsx(styles.floorLabel, styles.leftSticky)}>
        {floorName}
      </td>

      <td className={styles.elevatorsContainer}>
        <div style={{ display: 'flex', position: 'relative' }}>
          {timerData.map(({ elevatorId, shouldShow, key, elevator }) => (
            <div key={elevatorId} className={styles.shaft}>
              <div className={styles.shaftContent}>
                {shouldShow && (
                  <Timer
                    elevatorId={elevatorId}
                    targetFloor={floorNumber}
                    calculateTime={() => calculateRemainingTime(elevator, floorNumber, msPerFloor, arrivalDelay)}
                    uniqueKey={key}
                  />
                )}
              </div>
            </div>
          ))}

          {elevators.map((e, idx) => {
            const showElevator = e.floor === floorNumber;
            if (!showElevator) return null;

            return (
              <ElevatorVisual
                key={`elevator-${e.id}`}
                elevator={e}
                msPerFloor={msPerFloor}
                elevatorIndex={idx}
                totalElevators={elevators.length}
                className={styles.elevatorWrapper}
              />
            );
          })}
        </div>
      </td>

      <td className={clsx(styles.buttonCell, styles.rightSticky)}>
        <Floor
          floorNumber={floorNumber}
          status={floorStatus}
          onCall={onCall}
        />
      </td>
    </tr>
  );
};

const arePropsEqual = (prev: FloorRowProps, next: FloorRowProps): boolean => {
  if (
    prev.floorNumber !== next.floorNumber ||
    prev.floorName !== next.floorName ||
    prev.floorStatus !== next.floorStatus ||
    prev.msPerFloor !== next.msPerFloor ||
    prev.arrivalDelay !== next.arrivalDelay ||
    prev.isSourceFloor !== next.isSourceFloor
  ) {
    return false;
  }

  if (prev.elevators.length !== next.elevators.length) {
    return false;
  }

  return prev.elevators.every((prevElevator, index) => {
    const nextElevator = next.elevators[index];
    return prevElevator.revision === nextElevator.revision;
  });
};

export const FloorRow = memo(FloorRowComponent, arePropsEqual);
