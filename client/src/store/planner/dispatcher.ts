import type { Elevator, Config } from '@/store/types';
import type { DispatchResult } from '@/store/planner/types';
import { calculateETA } from '@/store/planner/eta';
import { addDestination } from '@/store/utils/destinations';
import { MOVING_PENALTY, MAX_DESTINATIONS } from '@/store/constants';

interface DispatchParams {
  elevators: readonly Elevator[];
  targetFloor: number;
  now: number;
  config: Config;
}

const calculateTotalCost = (eta: number, isMoving: boolean): number => {
    const penalty = isMoving ? MOVING_PENALTY : 0;
    return eta + penalty;
};

const isOptimalMatch = (elevator: Elevator, targetFloor: number): boolean => {
    return elevator.status === 'idle' && elevator.floor === targetFloor;
};

const hasCapacity = (elevator: Elevator): boolean => {
    if (elevator.status !== 'moving') return true;
    return elevator.destinations.length < MAX_DESTINATIONS;
};

export const selectByETA = (params: DispatchParams): DispatchResult | null => {
    const { elevators, targetFloor, now, config } = params;
    const { msPerFloor, arrivalDelay } = config;
    
    const available = elevators.filter(hasCapacity);
    if (available.length === 0) return null;
    
    let bestElevator: Elevator | null = null;
    let bestCost = Infinity;
    
    for (const elevator of available) {
        const eta = calculateETA({
            elevator,
            targetFloor,
            now,
            msPerFloor,
            arrivalDelay
        });
        
        if (eta === null) continue;
        
        const totalCost = calculateTotalCost(eta, elevator.status === 'moving');
        
        if (totalCost < bestCost) {
            bestCost = totalCost;
            bestElevator = elevator;
            
            if (isOptimalMatch(elevator, targetFloor)) break;
        }
    }
    
    if (!bestElevator) return null;
    
    const destinations = bestElevator.status === 'moving' 
        ? addDestination(bestElevator.destinations, targetFloor)
        : [targetFloor];
    
    return {
        elevatorId: bestElevator.id,
        eta: bestCost,
        destinations
    };
};
