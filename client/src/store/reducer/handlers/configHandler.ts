import type { ElevatorState, ElevatorAction, Config } from '@/store/types';
import { createInitialState } from '@/store/utils/state';
import { MIN_FLOORS, MAX_FLOORS, MIN_ELEVATORS, MAX_ELEVATORS } from '@/store/constants';

const clamp = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

const validateConfig = (config: Partial<Config>, fallback: Config): Config => ({
  ...fallback,
  numFloors: config.numFloors 
    ? clamp(config.numFloors, MIN_FLOORS, MAX_FLOORS) 
    : fallback.numFloors,
  numElevators: config.numElevators 
    ? clamp(config.numElevators, MIN_ELEVATORS, MAX_ELEVATORS) 
    : fallback.numElevators,
});

export const handleConfig = (
  state: ElevatorState,
  action: Extract<ElevatorAction, { type: 'CONFIG' }>
): ElevatorState => {
  const validatedConfig = validateConfig({
    numFloors: action.numFloors,
    numElevators: action.numElevators
  }, state.config);
  
  return createInitialState(validatedConfig);
};

export const handleReset = (state: ElevatorState): ElevatorState => {
  return createInitialState(state.config);
};
