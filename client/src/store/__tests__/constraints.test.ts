import { describe, it, expect } from 'vitest';
import { selectByETA } from '@/store/planner/dispatcher';
import { createIdleElevator, createMovingElevator, createTestConfig } from '@/store/__tests__/testUtils';
import { MAX_DESTINATIONS } from '@/store/constants';

describe('System Constraints', () => {
  const config = createTestConfig();
  const now = 1000;

  it('does not assign new job to elevator with MAX_DESTINATIONS', () => {
    const maxDestinations = Array.from({ length: MAX_DESTINATIONS }, (_, i) => i + 1);
    const overloadedElevator = createMovingElevator(1, 0, maxDestinations, 'up');
    
    const result = selectByETA({
      elevators: [overloadedElevator],
      targetFloor: 15,
      now,
      config
    });
    
    expect(result).toBeNull();
  });

  it('allows assignment when elevator has capacity', () => {
    const destinations = Array.from({ length: MAX_DESTINATIONS - 1 }, (_, i) => i + 1);
    const elevator = createMovingElevator(1, 0, destinations, 'up');
    
    const result = selectByETA({
      elevators: [elevator],
      targetFloor: 15,
      now,
      config
    });
    
    expect(result).not.toBeNull();
  });

  it('respects floor bounds in config', () => {
    const customConfig = createTestConfig({ numFloors: 5 });
    const elevator = createIdleElevator(1, 2);
    
    const result = selectByETA({
      elevators: [elevator],
      targetFloor: 4,
      now,
      config: customConfig
    });
    
    expect(result).not.toBeNull();
    expect(result?.elevatorId).toBe(1);
  });

  it('handles empty elevator array', () => {
    const result = selectByETA({
      elevators: [],
      targetFloor: 5,
      now,
      config
    });
    
    expect(result).toBeNull();
  });

  it('validates msPerFloor constraint', () => {
    const fastConfig = createTestConfig({ msPerFloor: 100 });
    const elevator = createIdleElevator(1, 0);
    
    const result = selectByETA({
      elevators: [elevator],
      targetFloor: 10,
      now,
      config: fastConfig
    });
    
    expect(result).not.toBeNull();
  });
});
