import type { ElevatorState } from '@/store/types';
import { removeDestination } from '@/store/utils/destinations';
import { isMoving } from '@/store/utils/guards';
import { findElevatorById, updateElevatorById } from '@/store/reducer/helpers/elevators';
import { toArrived } from '@/store/reducer/transitions';
import { updateMetricsOnArrival } from '@/store/reducer/helpers/stateHelpers';

export const handleArrived = (
  state: ElevatorState,
  elevatorId: number,
  now: number
): ElevatorState => {
  const elevator = findElevatorById(state.elevators, elevatorId);
  if (!elevator || !isMoving(elevator)) return state;

  const remainingDestinations = removeDestination(elevator.destinations, elevator.currentTarget);
  const maxSize = state.config.maxMetricsSize ?? 1000;

  return {
    ...state,
    floors: { ...state.floors, [elevator.currentTarget]: 'arrived' },
    elevators: updateElevatorById(
      state.elevators,
      elevatorId,
      () => toArrived(elevator, now, remainingDestinations, state.config.arrivalDelay)
    ),
    metrics: updateMetricsOnArrival(
      state.metrics,
      elevator.currentTarget,
      elevatorId,
      now,
      maxSize
    )
  };
};
