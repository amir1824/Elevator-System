export type Direction = 'up' | 'down' | 'idle';

export type EventType = 'ARRIVE' | 'RELEASE';

export interface NextEvent {
    readonly type: EventType;
    readonly at: number;
    readonly elevatorId: number;
    readonly revision: number;
}

export interface BaseElevator {
    readonly id: number;
    floor: number;
    revision: number;
    nextEvent?: NextEvent;
}

export interface IdleElevator extends BaseElevator {
    status: 'idle';
    direction: 'idle';
}

export interface MovingElevator extends BaseElevator {
    status: 'moving';
    destinations: number[];
    direction: Exclude<Direction, 'idle'>;
    startTime: number;
    startFloor: number;
    currentTarget: number;
}

export interface ArrivedElevator extends BaseElevator {
    status: 'arrived';
    direction: 'idle';
    arrivalTime: number;
    destinations: number[];
}

export type Elevator = IdleElevator | MovingElevator | ArrivedElevator;

export type FloorStatus = 'idle' | 'waiting' | 'arrived';

export interface CallMetric {
  readonly floor: number;
  readonly callCreatedAt: number;
  assignedElevatorId?: number;
  arrivedAt?: number;
  travelMs?: number;
}

export interface ElevatorState {
    elevators: Elevator[];
    floors: Record<number, FloorStatus>;
    queue: number[];
    config: Config;
    metrics: CallMetric[];
}

export interface Config {
    numFloors: number;
    numElevators: number;
    msPerFloor: number;
    arrivalDelay: number;
    maxMetricsSize?: number;
}

export type ElevatorAction =
    | { type: 'CALL'; floor: number; now: number }
    | { type: 'ARRIVED'; elevatorId: number; now: number }
    | { type: 'RELEASE'; elevatorId: number; now: number }
    | { type: 'RESET' }
    | { type: 'CONFIG'; numFloors?: number; numElevators?: number };
