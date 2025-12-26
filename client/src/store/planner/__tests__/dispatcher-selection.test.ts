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

describe('Dispatcher - Selection Preferences', () => {
  it('prefers moving elevator approaching floor over idle one far away', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createMovingElevator(2, 4, [6], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('prefers idle elevator when significantly closer despite penalty', () => {
    const elevators = [
      createIdleElevator(1, 5),
      createMovingElevator(2, 0, [10], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('penalizes elevator moving away from target', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createMovingElevator(2, 5, [8], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 5));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('selects elevator moving in correct direction even if slightly farther', () => {
    const elevators = [
      createIdleElevator(1, 0),
      createMovingElevator(2, 3, [4, 8], 'up')
    ];
    
    const result = selectByETA(createDispatchParams(elevators, 6));
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });
});
