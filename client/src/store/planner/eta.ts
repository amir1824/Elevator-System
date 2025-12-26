import type { Elevator, MovingElevator, ArrivedElevator } from '@/store/types';
import { isMoving, isIdle } from '@/store/utils/guards';

interface ETAParams {
  elevator: Elevator;
  targetFloor: number;
  now: number;
  msPerFloor: number;
  arrivalDelay: number;
}

const calculateTravelTime = (
  from: number,
  to: number,
  msPerFloor: number
): number => Math.abs(to - from) * msPerFloor;

const calculateStopDelays = (
  stops: readonly number[],
  arrivalDelay: number
): number => stops.length * arrivalDelay;

const etaForIdle = (
  elevator: Elevator,
  targetFloor: number,
  now: number,
  msPerFloor: number
): number => {
  if (elevator.floor === targetFloor) {
    return now;
  }
  return now + calculateTravelTime(elevator.floor, targetFloor, msPerFloor);
};

const etaForMoving = (
  elevator: MovingElevator,
  targetFloor: number,
  now: number,
  msPerFloor: number,
  arrivalDelay: number
): number => {
  const { destinations, startFloor, startTime, currentTarget, direction } = elevator;
  
  const elapsed = now - startTime;
  const floorsTraveled = elapsed / msPerFloor;
  
  const currentPosition = direction === 'up'
    ? Math.min(startFloor + floorsTraveled, currentTarget)
    : Math.max(startFloor - floorsTraveled, currentTarget);
  
  const timeToCurrentTarget = calculateTravelTime(currentPosition, currentTarget, msPerFloor);
  
  const allDestinations = [...destinations];
  
  const inDirection = allDestinations.filter(dest => 
    direction === 'up' ? dest >= currentTarget : dest <= currentTarget
  );
  
  const oppositeDirection = allDestinations.filter(dest =>
    direction === 'up' ? dest < currentTarget : dest > currentTarget
  );
  
  const isTargetInDirection = direction === 'up' 
    ? targetFloor >= currentPosition 
    : targetFloor <= currentPosition;
  
  let totalTime = timeToCurrentTarget;
  let currentFloor = currentTarget;
  let stopsCount = 1;
  
  if (isTargetInDirection) {
    const stopsBeforeTarget = inDirection.filter(dest =>
      direction === 'up' ? dest <= targetFloor : dest >= targetFloor
    );
    
    if (stopsBeforeTarget.length > 0) {
      const lastStop = stopsBeforeTarget[stopsBeforeTarget.length - 1];
      totalTime += calculateTravelTime(currentFloor, lastStop, msPerFloor);
      currentFloor = lastStop;
      stopsCount += stopsBeforeTarget.length;
    }
    
    if (currentFloor !== targetFloor) {
      totalTime += calculateTravelTime(currentFloor, targetFloor, msPerFloor);
    }
  } else {
    if (inDirection.length > 0) {
      const lastInDirection = inDirection[inDirection.length - 1];
      totalTime += calculateTravelTime(currentFloor, lastInDirection, msPerFloor);
      currentFloor = lastInDirection;
      stopsCount += inDirection.length;
    }
    
    const stopsInOpposite = oppositeDirection.filter(dest =>
      direction === 'up' ? dest >= targetFloor : dest <= targetFloor
    );
    
    if (stopsInOpposite.length > 0) {
      const lastBeforeTarget = stopsInOpposite[stopsInOpposite.length - 1];
      totalTime += calculateTravelTime(currentFloor, lastBeforeTarget, msPerFloor);
      currentFloor = lastBeforeTarget;
      stopsCount += stopsInOpposite.length;
    }
    
    if (currentFloor !== targetFloor) {
      totalTime += calculateTravelTime(currentFloor, targetFloor, msPerFloor);
    }
  }
  
  const delayTime = calculateStopDelays(Array(stopsCount).fill(0), arrivalDelay);
  
  return now + totalTime + delayTime;
};

const etaForArrived = (
  elevator: ArrivedElevator,
  targetFloor: number,
  now: number,
  msPerFloor: number,
  arrivalDelay: number
): number => {
  const waitEnd = elevator.arrivalTime + arrivalDelay;
  const remainingWait = Math.max(0, waitEnd - now);
  const travelTime = calculateTravelTime(elevator.floor, targetFloor, msPerFloor);
  
  return now + remainingWait + travelTime;
};

export const calculateETA = (params: ETAParams): number | null => {
  const { elevator, targetFloor, now, msPerFloor, arrivalDelay } = params;
  
  if (elevator.status === 'arrived') {
    return etaForArrived(elevator as ArrivedElevator, targetFloor, now, msPerFloor, arrivalDelay);
  }
  
  if (isIdle(elevator)) {
    return etaForIdle(elevator, targetFloor, now, msPerFloor);
  }
  
  if (isMoving(elevator)) {
    return etaForMoving(elevator, targetFloor, now, msPerFloor, arrivalDelay);
  }
  
  return null;
};
