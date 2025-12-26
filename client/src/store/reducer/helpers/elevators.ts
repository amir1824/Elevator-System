import type { Elevator } from '@/store/types';

export const updateElevatorById = (
  elevators: Elevator[],
  id: number,
  updater: (e: Elevator) => Elevator
): Elevator[] => elevators.map(e => e.id === id ? updater(e) : e);

export const findElevatorById = (
  elevators: Elevator[],
  id: number
): Elevator | undefined => elevators.find(e => e.id === id);
