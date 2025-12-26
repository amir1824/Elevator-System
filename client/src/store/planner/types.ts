export type EventType = 'ARRIVE' | 'RELEASE';

export interface NextEvent {
  readonly type: EventType;
  readonly at: number;
  readonly elevatorId: number;
  readonly revision: number;
}

export interface ElevatorPlan {
  readonly elevatorId: number;
  readonly destinations: readonly number[];
  readonly currentFloor: number;
  readonly status: 'idle' | 'moving' | 'arrived';
  readonly eta: number | null;
}

export interface DispatchResult {
  readonly elevatorId: number;
  readonly eta: number;
  readonly destinations: readonly number[];
}
