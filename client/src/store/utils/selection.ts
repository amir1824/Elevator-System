import type { Elevator, Config } from '@/store/types';
import { selectByETA } from '@/store/planner/dispatcher';

export const findBestElevator = (
    elevators: Elevator[], 
    targetFloor: number,
    now: number = Date.now(),
    config?: Config
): Elevator | null => {
    if (!config) {
        throw new Error('Config required for ETA-based dispatch');
    }
    
    const result = selectByETA({ elevators, targetFloor, now, config });
    return result ? elevators.find(e => e.id === result.elevatorId) ?? null : null;
};
