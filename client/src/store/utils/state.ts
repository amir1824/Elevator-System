import type { Config, ElevatorState, FloorStatus, IdleElevator } from '@/store/types';
import { DEFAULT_CONFIG } from '@/store/constants';

export const createInitialState = (config: Config = DEFAULT_CONFIG): ElevatorState => ({
    elevators: Array.from({ length: config.numElevators }, (_, i): IdleElevator => ({
        id: i,
        floor: 0,
        status: 'idle',
        direction: 'idle',
        revision: 0,
    })),
    floors: Object.fromEntries(
        Array.from({ length: config.numFloors }, (_, i) => [i, 'idle' as FloorStatus])
    ),
    queue: [],
    config,
    metrics: [],
});
