import { describe, it, expect } from 'vitest';
import { selectByETA } from '@/store/planner/dispatcher';
import { createIdleElevator, createMovingElevator, createTestConfig } from '@/store/__tests__/testUtils';
import type { Elevator } from '@/store/types';

const config = createTestConfig();
const now = 1000;

const createDispatchParams = (elevators: Elevator[], targetFloor: number) => ({
  elevators,
  targetFloor,
  now,
  config
});

describe('Dispatcher - Edge Cases', () => {
  it('returns immediately if idle elevator already at target floor', () => {
    const elevators = [
      createIdleElevator(1, 5),
      createMovingElevator(2, 4, [6], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('handles multiple elevators with identical ETA', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createIdleElevator(2, 0),
      createIdleElevator(3, 0)
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('returns null when no elevators available', () => {
    const result = selectByETA(createDispatchParams([], 5));
    expect(result).toBeNull();
  });

  it('accounts for all intermediate stops when calculating ETA', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createMovingElevator(2, 0, [1, 2, 3, 4, 6], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('handles backtracking scenario correctly', () => {
    const elevators = [
      createIdleElevator(1, 5),
      createMovingElevator(2, 8, [10, 3], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 4));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });
});
