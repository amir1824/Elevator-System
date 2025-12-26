import { describe, it, expect } from 'vitest';
import { selectByETA } from '@/store/planner/dispatcher';
import { createIdleElevator, createArrivedElevator, createTestConfig } from '@/store/__tests__/testUtils';
import type { Elevator } from '@/store/types';

const config = createTestConfig();
const now = 1000;

const createDispatchParams = (elevators: Elevator[], targetFloor: number) => ({
  elevators,
  targetFloor,
  now,
  config
});

describe('Dispatcher - Arrived Elevator Priority', () => {
  it('prefers just-arrived elevator over distant idle one', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createArrivedElevator(2, 5, now - 500)
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(2);
  });

  it('considers remaining door-open time for arrived elevators', () => {
    const elevators = [
      createIdleElevator(1, 5),
      createArrivedElevator(2, 6, now - 100)
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });
});
