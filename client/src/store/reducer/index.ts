import type { ElevatorState, ElevatorAction } from '@/store/types';
import { handleCall } from '@/store/reducer/handlers/callHandler';
import { handleArrived } from '@/store/reducer/handlers/arrivalHandler';
import { handleRelease } from '@/store/reducer/handlers/releaseHandler';
import { handleConfig, handleReset } from '@/store/reducer/handlers/configHandler';
import { assertStateInvariants } from '@/store/invariants';

type ActionOf<T extends ElevatorAction['type']> = Extract<ElevatorAction, { type: T }>;
type Handler<T extends ElevatorAction['type']> = (state: ElevatorState, action: ActionOf<T>) => ElevatorState;

type Handlers = {
    [K in ElevatorAction['type']]: Handler<K>
};

const actionHandlers: Handlers = {
    CALL: (state, action) => handleCall(state, action.floor, action.now),
    ARRIVED: (state, action) => handleArrived(state, action.elevatorId, action.now),
    RELEASE: (state, action) => handleRelease(state, action.elevatorId, action.now),
    CONFIG: (state, action) => handleConfig(state, action),
    RESET: (state) => handleReset(state),
};

export const elevatorReducer = (
    state: ElevatorState,
    action: ElevatorAction
): ElevatorState => {
    const handler = actionHandlers[action.type] as Handler<typeof action.type>;
    const nextState = handler(state, action);
    
    assertStateInvariants(nextState);
    
    return nextState;
};

export { createInitialState } from '../utils/state';
