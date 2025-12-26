import { describe, it, expect } from 'vitest';
import { updateDestinations } from '@/store/reducer/transitions';
import { createMovingElevator, createTestConfig } from '@/store/__tests__/testUtils';

describe('updateDestinations - Intercept with Re-anchor', () => {
  const config = createTestConfig();

  it('Intercept: at floor 12, going to 20, add 15 -> switches target', () => {
    const moving = createMovingElevator(1, 0, [20], 'up');
    moving.startTime = 0;
    moving.startFloor = 0;
    
    const now = 12 * config.msPerFloor;
    const result = updateDestinations(moving, 15, now, config.msPerFloor);

    expect(result.currentTarget).toBe(15);
    expect(result.startFloor).toBe(0);
    expect(result.startTime).toBe(0);
    
    expect(result.nextEvent?.type).toBe('ARRIVE');
  });

  it('No intercept: at floor 12, going to 20, add 25 -> keeps target', () => {
    const moving = createMovingElevator(1, 0, [20], 'up');
    moving.startTime = 0;
    moving.startFloor = 0;
    
    const now = 12 * config.msPerFloor;
    const result = updateDestinations(moving, 25, now, config.msPerFloor);

    expect(result.currentTarget).toBe(20);
    expect(result.destinations).toEqual([20, 25]);
  });

  it('Passed floor: at floor 18, going to 20, add 15 -> backtrack', () => {
    const moving = createMovingElevator(1, 10, [20], 'up');
    moving.startTime = 0;
    moving.startFloor = 10;
    
    const now = 8 * config.msPerFloor;
    const result = updateDestinations(moving, 15, now, config.msPerFloor);

    expect(result.currentTarget).toBe(20);
    expect(result.destinations).toContain(15);
  });

  it('duplicate floor: no change', () => {
    const moving = createMovingElevator(1, 10, [15, 20], 'up');
    const result = updateDestinations(moving, 15, 1000, config.msPerFloor);

    expect(result).toBe(moving);
  });

  it('preserves direction during intercept', () => {
    const moving = createMovingElevator(1, 0, [10], 'up');
    moving.startTime = 0;
    moving.startFloor = 0;

    const now = 5 * config.msPerFloor;
    const result = updateDestinations(moving, 7, now, config.msPerFloor);

    expect(result.direction).toBe('up');
    expect(result.startFloor).toBe(0);
    expect(result.startTime).toBe(0);
  });
});
