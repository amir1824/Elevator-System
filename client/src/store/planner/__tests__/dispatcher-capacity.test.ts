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

describe('Dispatcher - Capacity Management', () => {
  it('returns null when all elevators at MAX_DESTINATIONS', () => {
    const overloadedElevators = [
      createMovingElevator(1, 0, [1,2,3,4,5,6,7,8,9,10], 'up'),
      createMovingElevator(2, 5, [6,7,8,9,10,11,12,13,14,15], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(overloadedElevators, 3));
    
    expect(result).toBeNull();
  });

  it('selects elevator with capacity even if slightly slower', () => {
    const elevators = [
      createMovingElevator(1, 0, [1,2,3,4,5,6,7,8,9,10], 'up'),
      createIdleElevator(2, 8)
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 2));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(2);
  });

  it('filters out moving elevators at capacity before calculating ETA', () => {
    const elevators = [
      createMovingElevator(1, 5, Array.from({length: 10}, (_, i) => i + 1), 'up'),
      createIdleElevator(2, 0),
      createIdleElevator(3, 9)
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect([2, 3]).toContain(result?.elevatorId);
  });
});
