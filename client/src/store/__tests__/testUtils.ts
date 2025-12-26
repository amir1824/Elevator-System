import type { ElevatorState, Elevator, IdleElevator, MovingElevator, ArrivedElevator, Config } from '@/store/types';

export const createTestConfig = (overrides?: Partial<Config>): Config => ({
  numFloors: 10,
  numElevators: 5,
  msPerFloor: 500,
  arrivalDelay: 2000,
  maxMetricsSize: 1000,
  ...overrides
});

export const createIdleElevator = (
  id: number,
  floor: number,
  revision = 0
): IdleElevator => ({
  id,
  floor,
  status: 'idle',
  direction: 'idle',
  revision,
  nextEvent: undefined
});

export const createMovingElevator = (
  id: number,
  floor: number,
  destinations: number[],
  direction: 'up' | 'down',
  revision = 0
): MovingElevator => ({
  id,
  floor,
  status: 'moving',
  direction,
  destinations,
  currentTarget: destinations[0],
  startTime: 0,
  startFloor: floor,
  revision,
  nextEvent: {
    type: 'ARRIVE',
    at: 1000,
    elevatorId: id,
    revision: revision + 1
  }
});

export const createArrivedElevator = (
  id: number,
  floor: number,
  arrivalTime: number,
  destinations: number[] = [],
  revision = 0
): ArrivedElevator => ({
  id,
  floor,
  status: 'arrived',
  direction: 'idle',
  arrivalTime,
  destinations,
  revision,
  nextEvent: {
    type: 'RELEASE',
    at: arrivalTime + 2000,
    elevatorId: id,
    revision: revision + 1
  }
});

export const createTestState = (
  elevators: Elevator[],
  config?: Partial<Config>
): ElevatorState => ({
  elevators,
  floors: {},
  queue: [],
  metrics: [],
  config: createTestConfig(config)
});
