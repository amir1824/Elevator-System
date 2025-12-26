import type { Elevator, Config } from '@/store/types';
import { isIdle, isMoving } from '@/store/utils/guards';
import { addDestination } from '@/store/utils/destinations';
import { toMoving, updateDestinations, toArrivedImmediate } from '@/store/reducer/transitions';

export const calculateNextElevatorState = (
    elevator: Elevator,
    targetFloor: number,
    now: number,
    config: Config
): Elevator | null => {
    if (isIdle(elevator)) {
        if (elevator.floor === targetFloor) {
            return toArrivedImmediate(elevator, now, config.arrivalDelay);
        }
        return toMoving(elevator, [targetFloor], now, config.msPerFloor);
    }

    if (isMoving(elevator)) {
        return updateDestinations(elevator, targetFloor, now, config.msPerFloor);
    }

    if (elevator.status === 'arrived') {
        const updatedDestinations = addDestination(elevator.destinations, targetFloor);
        return { 
            ...elevator, 
            destinations: updatedDestinations, 
            revision: elevator.revision + 1 
        };
    }

    return null;
};
