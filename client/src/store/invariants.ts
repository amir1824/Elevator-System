import type { MovingElevator, ArrivedElevator, ElevatorState } from '@/store/types';

const isDev = import.meta.env.DEV;

class InvariantError extends Error {
  constructor(message: string) {
    super(`Invariant violation: ${message}`);
    this.name = 'InvariantError';
  }
}

const assert = (condition: boolean, message: string): void => {
  if (isDev && !condition) {
    throw new InvariantError(message);
  }
};

export const assertMovingInvariants = (e: MovingElevator): void => {
  assert(
    e.destinations.length > 0,
    `Moving elevator ${e.id} must have destinations`
  );
  
  assert(
    e.destinations.includes(e.currentTarget),
    `Moving elevator ${e.id} currentTarget must be in destinations`
  );
  
  assert(
    e.nextEvent?.type === 'ARRIVE',
    `Moving elevator ${e.id} must have ARRIVE event scheduled`
  );
  
  assert(
    e.nextEvent?.elevatorId === e.id,
    `Moving elevator ${e.id} nextEvent must match id`
  );
};

export const assertArrivedInvariants = (e: ArrivedElevator): void => {
  assert(
    e.direction === 'idle',
    `Arrived elevator ${e.id} direction must be idle`
  );
  
  assert(
    e.arrivalTime > 0,
    `Arrived elevator ${e.id} must have valid arrivalTime`
  );
  
  assert(
    e.nextEvent?.type === 'RELEASE',
    `Arrived elevator ${e.id} must have RELEASE event scheduled`
  );
};

export const assertFloorInvariants = (state: ElevatorState): void => {
  const { floors, elevators, queue } = state;
  
  const queueSet = new Set(queue);
  assert(
    queueSet.size === queue.length,
    'Queue must not have duplicates'
  );
  
  Object.entries(floors).forEach(([floorStr, status]) => {
    const floor = parseInt(floorStr, 10);
    
    if (status === 'arrived') {
      const hasArrivedElevator = elevators.some(
        e => e.status === 'arrived' && e.floor === floor
      );
      assert(
        hasArrivedElevator,
        `Floor ${floor} marked 'arrived' but no elevator is there`
      );
    }
  });
};

export const assertDestinationInvariants = (destinations: number[]): void => {
  const destSet = new Set(destinations);
  assert(
    destSet.size === destinations.length,
    'Destinations must not have duplicates'
  );
};

export const assertStateInvariants = (state: ElevatorState): void => {
  if (!isDev) return;
  
  state.elevators.forEach(e => {
    if (e.status === 'moving') {
      assertMovingInvariants(e);
      assertDestinationInvariants(e.destinations);
    }
    
    if (e.status === 'arrived') {
      assertArrivedInvariants(e);
    }
  });
  
  assertFloorInvariants(state);
};
