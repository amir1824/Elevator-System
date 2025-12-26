import type { Elevator } from '@/store/types';

const calculateDistance = (from: number, to: number): number => 
  Math.abs(to - from);

const calculateCurrentPosition = (
  elevator: Elevator,
  msPerFloor: number
): number => {
  if (elevator.status === 'idle') return elevator.floor;
  if (elevator.status === 'arrived') return elevator.floor;
  
  const elapsed = Date.now() - elevator.startTime;
  const floorsTraveled = elapsed / msPerFloor;
  
  if (elevator.direction === 'up') {
    return Math.min(elevator.floor + floorsTraveled, elevator.currentTarget);
  } else {
    return Math.max(elevator.floor - floorsTraveled, elevator.currentTarget);
  }
};

const countStopsBeforeTarget = (
  destinations: number[],
  targetFloor: number
): number => {
  const index = destinations.findIndex(f => f === targetFloor);
  return index === -1 ? 0 : index;
};

const calculatePureTravelTime = (
  startFloor: number,
  destinations: number[],
  targetFloor: number,
  msPerFloor: number
): number => {
  const targetIndex = destinations.findIndex(f => f === targetFloor);
  if (targetIndex === -1) return 0;

  const stopsUntilTarget = destinations.slice(0, targetIndex + 1);

  const totalDistance = stopsUntilTarget.reduce(
    (acc, floor, index) => {
      const prevFloor = index === 0 ? startFloor : stopsUntilTarget[index - 1];
      return acc + calculateDistance(prevFloor, floor);
    },
    0
  );

  return totalDistance * msPerFloor;
};

const calculateTotalTimeToTarget = (
  startFloor: number,
  destinations: number[],
  targetFloor: number,
  msPerFloor: number,
  arrivalDelay: number
): number => {
  const travelTime = calculatePureTravelTime(
    startFloor,
    destinations,
    targetFloor,
    msPerFloor
  );

  const stopsBefore = countStopsBeforeTarget(destinations, targetFloor);
  const delayTime = stopsBefore * arrivalDelay;

  return travelTime + delayTime;
};

export const calculateRemainingTime = (
  elevator: Elevator,
  targetFloor: number,
  msPerFloor: number,
  arrivalDelay: number
): number | null => {
  if (elevator.status === 'idle') return null;
  if (!elevator.destinations?.includes(targetFloor)) return null;

  const now = Date.now();

  if (elevator.status === 'arrived') {
    const waitRemaining = Math.max(
      0,
      arrivalDelay - (now - elevator.arrivalTime)
    );

    if (elevator.floor === targetFloor) {
      return waitRemaining;
    }

    const futureTravel = calculateTotalTimeToTarget(
      elevator.floor,
      elevator.destinations,
      targetFloor,
      msPerFloor,
      arrivalDelay
    );

    return waitRemaining + futureTravel;
  }

  if (elevator.status === 'moving') {
    const currentPosition = calculateCurrentPosition(elevator, msPerFloor);
    
    const totalTimeFromNow = calculateTotalTimeToTarget(
      currentPosition,
      elevator.destinations,
      targetFloor,
      msPerFloor,
      arrivalDelay
    );

    return Math.max(0, totalTimeFromNow);
  }

  return null;
};
