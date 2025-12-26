import type { ElevatorState, FloorStatus } from '@/store/types';
import { findElevatorById, updateElevatorById } from '@/store/reducer/helpers/elevators';
import { toIdle, toMoving } from '@/store/reducer/transitions';
import { handleCall } from './callHandler';

const releaseFloor = (state: ElevatorState, floor: number): ElevatorState => ({
    ...state,
    floors: { ...state.floors, [floor]: 'idle' as FloorStatus }
});

const processQueuedCalls = (
    state: ElevatorState,
    now: number
): ElevatorState => {
    if (state.queue.length === 0) return state;
    
    const queuedFloors = [...state.queue];
    const batchState = { ...state, queue: [] };
    
    return queuedFloors.reduce<ElevatorState>((acc, queuedFloor) => {
        const resetFloorState = {
            ...acc,
            floors: { ...acc.floors, [queuedFloor]: 'idle' as FloorStatus }
        };
        return handleCall(resetFloorState, queuedFloor, now);
    }, batchState);
};

export const handleRelease = (
    state: ElevatorState,
    elevatorId: number,
    now: number
): ElevatorState => {
    const elevator = findElevatorById(state.elevators, elevatorId);
    if (!elevator || elevator.status !== 'arrived') return state;
    
    let baseState = releaseFloor(state, elevator.floor);
    
    const idle = toIdle(elevator);
    baseState = {
        ...baseState,
        elevators: updateElevatorById(baseState.elevators, elevatorId, () => idle)
    };
    
    if (baseState.queue.length > 0) {
        return processQueuedCalls(baseState, now);
    }
    
    const destinations = elevator.destinations;
    
    if (destinations.length === 0) {
        return baseState;
    }
    
    const moving = toMoving(idle, destinations, now, state.config.msPerFloor);
    
    if (!moving) return baseState;
    
    return {
        ...baseState,
        elevators: updateElevatorById(baseState.elevators, elevatorId, () => moving)
    };
};
