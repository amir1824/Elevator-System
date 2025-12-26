import type { ElevatorState, FloorStatus } from '@/store/types';
import { isIdle } from '@/store/utils/guards';
import { findElevatorById } from '@/store/reducer/helpers/elevators';
import { selectByETA } from '@/store/planner/dispatcher';
import { calculateNextElevatorState } from '@/store/reducer/helpers/elevatorLogic';
import { queueFloorCall, assignFloorToElevator } from '@/store/reducer/helpers/stateHelpers';

export const handleCall = (
    state: ElevatorState,
    floor: number,
    now: number
): ElevatorState => {
    const currentStatus = state.floors[floor];
    if (currentStatus === 'waiting' || currentStatus === 'arrived') return state;
    if (state.queue.includes(floor)) return state;

    const dispatch = selectByETA({
        elevators: state.elevators,
        targetFloor: floor,
        now,
        config: state.config
    });

    if (!dispatch) return queueFloorCall(state, floor);

    const elevator = findElevatorById(state.elevators, dispatch.elevatorId);
    if (!elevator) return state;

    const updatedElevator = calculateNextElevatorState(
        elevator,
        floor,
        now,
        state.config
    );

    if (!updatedElevator) return state;

    const nextFloorStatus: FloorStatus = 
        (isIdle(elevator) && elevator.floor === floor) ? 'arrived' : 'waiting';

    return assignFloorToElevator(
        state,
        floor,
        elevator.id,
        nextFloorStatus,
        () => updatedElevator,
        now
    );
};
