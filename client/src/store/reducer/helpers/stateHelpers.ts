import type { ElevatorState, FloorStatus, Elevator, CallMetric } from '@/store/types';
import { updateElevatorById } from '@/store/reducer/helpers/elevators';

export const createCallMetric = (floor: number, now: number, elevatorId: number): CallMetric => ({
    floor,
    callCreatedAt: now,
    assignedElevatorId: elevatorId
});

export const queueFloorCall = (state: ElevatorState, floor: number): ElevatorState => ({
    ...state,
    queue: [...state.queue, floor],
    floors: { ...state.floors, [floor]: 'waiting' }
});

export const assignFloorToElevator = (
    state: ElevatorState,
    floor: number,
    elevatorId: number,
    floorStatus: FloorStatus,
    elevatorUpdater: (elevator: Elevator) => Elevator,
    now: number
): ElevatorState => ({
    ...state,
    floors: { ...state.floors, [floor]: floorStatus },
    elevators: updateElevatorById(state.elevators, elevatorId, elevatorUpdater),
    metrics: [...state.metrics, createCallMetric(floor, now, elevatorId)]
});

export const updateMetricsOnArrival = (
    metrics: readonly CallMetric[],
    floor: number,
    elevatorId: number,
    now: number,
    maxSize: number
): CallMetric[] => {
    const updated = metrics.map(m => {
        const shouldUpdate = m.floor === floor 
            && m.assignedElevatorId === elevatorId 
            && !m.arrivedAt;
        
        if (!shouldUpdate) return m;
        
        return { 
            ...m, 
            arrivedAt: now, 
            travelMs: now - m.callCreatedAt 
        };
    });
    
    return updated.length > maxSize ? updated.slice(-maxSize) : updated;
};
