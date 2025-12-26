export const MS_PER_FLOOR = 500;
export const ARRIVAL_DELAY = 2000;

export const MIN_FLOORS = 2;
export const MAX_FLOORS = 20;
export const MIN_ELEVATORS = 1;
export const MAX_ELEVATORS = 10;

export const MAX_METRICS_SIZE = 1000;
export const IDLE_PREFERENCE_PENALTY = 100;

export const POSITION_EPSILON = 0.5;

export const DEFAULT_CONFIG = {
    numFloors: 10 as number,
    numElevators: 5 as number,
    msPerFloor: MS_PER_FLOOR,
    arrivalDelay: ARRIVAL_DELAY,
    maxMetricsSize: MAX_METRICS_SIZE,
};

export const MOVING_PENALTY = 50;
export const MAX_DESTINATIONS = 10;