import type { IdleElevator, MovingElevator, ArrivedElevator, NextEvent } from '@/store/types';
import { sortDestinationsLOOK } from '@/store/utils/destinations';
import { getDirection, getTravelTime, calculateCurrentPosition } from '@/store/utils/calculations';
import { POSITION_EPSILON } from '@/store/constants';

const createArriveEvent = (
  e: IdleElevator | MovingElevator,
  currentTarget: number,
  now: number,
  msPerFloor: number
): NextEvent => ({
  type: 'ARRIVE',
  at: now + getTravelTime(e.floor, currentTarget, msPerFloor),
  elevatorId: e.id,
  revision: e.revision + 1
});

const createReleaseEvent = (
  e: MovingElevator | IdleElevator,
  now: number,
  arrivalDelay: number
): NextEvent => ({
  type: 'RELEASE',
  at: now + arrivalDelay,
  elevatorId: e.id,
  revision: e.revision + 1
});

export const toMoving = (
  e: IdleElevator,
  destinations: number[],
  now: number,
  msPerFloor: number
): MovingElevator | null => {
  if (destinations.length === 0) return null;

  const firstTarget = destinations[0];
  if (firstTarget === e.floor) return null;

  const initialDirection = getDirection(e.floor, firstTarget);
  if (initialDirection === 'idle') return null;

  const sortedDestinations = sortDestinationsLOOK(destinations, e.floor, initialDirection);
  const currentTarget = sortedDestinations[0];

  const direction = getDirection(e.floor, currentTarget);
  if (direction === 'idle') return null;

  return {
    id: e.id,
    floor: e.floor,
    status: 'moving',
    destinations: sortedDestinations,
    currentTarget,
    direction,
    startTime: now,
    startFloor: e.floor,
    revision: e.revision + 1,
    nextEvent: createArriveEvent(e, currentTarget, now, msPerFloor)
  };
};

export const toArrived = (
  e: MovingElevator,
  now: number,
  remainingDestinations: number[],
  arrivalDelay: number
): ArrivedElevator => ({
  id: e.id,
  floor: e.currentTarget,
  status: 'arrived',
  direction: 'idle',
  arrivalTime: now,
  destinations: remainingDestinations,
  revision: e.revision + 1,
  nextEvent: createReleaseEvent(e, now, arrivalDelay)
});

export const toIdle = (e: ArrivedElevator): IdleElevator => ({
  id: e.id,
  floor: e.floor,
  status: 'idle',
  direction: 'idle',
  revision: e.revision + 1,
  nextEvent: undefined
});

export const updateDestinations = (
  elevator: MovingElevator,
  newFloor: number,
  now: number,
  msPerFloor: number
): MovingElevator => {
  if (elevator.destinations.includes(newFloor)) return elevator;

  const currentPos = calculateCurrentPosition(elevator, now, msPerFloor);

  const effectiveFloor = elevator.direction === 'up'
    ? Math.floor(currentPos)
    : Math.ceil(currentPos);

  const allDestinations = [...elevator.destinations, newFloor];
  const sortedDestinations = sortDestinationsLOOK(
    allDestinations,
    effectiveFloor,
    elevator.direction
  );

  const newTarget = sortedDestinations[0];

  if (newTarget === elevator.currentTarget) {
    return {
      ...elevator,
      destinations: sortedDestinations,
      revision: elevator.revision + 1
    };
  }

  const isPassed = elevator.direction === 'up'
    ? currentPos > newTarget + POSITION_EPSILON
    : currentPos < newTarget - POSITION_EPSILON;

  if (isPassed) {
    const [currentTarget, ...remaining] = elevator.destinations;
    const updatedRemaining = [...remaining, newFloor];
    const sortedRemaining = sortDestinationsLOOK(updatedRemaining, elevator.floor, elevator.direction);
    return {
      ...elevator,
      destinations: [currentTarget, ...sortedRemaining],
      revision: elevator.revision + 1
    };
  }

  return {
    ...elevator,
    destinations: sortedDestinations,
    currentTarget: newTarget,
    revision: elevator.revision + 1,
    nextEvent: createArriveEvent(
      { ...elevator, floor: elevator.startFloor },
      newTarget,
      now,
      msPerFloor
    )
  };
};

export const toArrivedImmediate = (
  e: IdleElevator,
  now: number,
  arrivalDelay: number
): ArrivedElevator => ({
  id: e.id,
  floor: e.floor,
  status: 'arrived',
  direction: 'idle',
  arrivalTime: now,
  destinations: [],
  revision: e.revision + 1,
  nextEvent: createReleaseEvent(e, now, arrivalDelay)
});
