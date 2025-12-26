import { useReducer, useCallback, useEffect, useRef } from 'react';
import { elevatorReducer } from '@/store/reducer';
import { createInitialState } from '@/store/utils/state';
import { formatTime } from '@/store/utils/calculations';
import { DEFAULT_CONFIG } from '@/store/constants';
import type { Elevator, FloorStatus, Config } from '@/store/types';
import { useElevatorScheduler } from '@/hooks/useElevatorScheduler';
import { useElevatorAudio } from '@/hooks/useElevatorAudio';

export interface ElevatorSystem {
  elevators: Elevator[];
  floors: Record<number, FloorStatus>;
  queueLength: number;
  movingElevators: number;
  idleElevators: number;
  arrivedElevators: number;
  totalCallsServed: number;
  avgWaitTime: number | null;
  config: Config;
  call: (floor: number) => void;
  reset: () => void;
  format: typeof formatTime;
}

export function useElevatorSystem(
  numFloors = DEFAULT_CONFIG.numFloors,
  numElevators = DEFAULT_CONFIG.numElevators
): ElevatorSystem {
  const [state, dispatch] = useReducer(
    elevatorReducer,
    { numFloors, numElevators },
    ({ numFloors, numElevators }) =>
      createInitialState({ ...DEFAULT_CONFIG, numFloors, numElevators })
  );

  const callbacksRef = useRef({
    onArrived: (elevatorId: number) => dispatch({ type: 'ARRIVED', elevatorId, now: Date.now() }),
    onRelease: (elevatorId: number) => dispatch({ type: 'RELEASE', elevatorId, now: Date.now() })
  });

  useElevatorScheduler(
    state.elevators,
    callbacksRef.current
  );

  useElevatorAudio(state.elevators);

  useEffect(() => {
    const { config } = state;
    if (config.numFloors !== numFloors || config.numElevators !== numElevators) {
      dispatch({ type: 'CONFIG', numFloors, numElevators });
    }
  }, [numFloors, numElevators, state.config]);

  const call = useCallback((floor: number) => {
    dispatch({ type: 'CALL', floor, now: Date.now() });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const movingElevators = state.elevators.filter(e => e.status === 'moving').length;
  const idleElevators = state.elevators.filter(e => e.status === 'idle').length;
  const arrivedElevators = state.elevators.filter(e => e.status === 'arrived').length;
  
  const completedCalls = state.metrics.filter(m => m.arrivedAt !== undefined && m.travelMs !== undefined && m.travelMs > 0);
  const totalCallsServed = completedCalls.length;
  
  const avgWaitTime = completedCalls.length > 0
    ? completedCalls.reduce((sum, m) => sum + (m.travelMs ?? 0), 0) / completedCalls.length
    : null;

  return {
    elevators: state.elevators,
    floors: state.floors,
    queueLength: state.queue.length,
    movingElevators,
    idleElevators,
    arrivedElevators,
    totalCallsServed,
    avgWaitTime,
    config: state.config,
    call,
    reset,
    format: formatTime
  };
}