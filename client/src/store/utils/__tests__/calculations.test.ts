import { describe, it, expect } from 'vitest';
import { calculateCurrentPosition, getDirection, getTravelTime } from '@/store/utils/calculations';
import { createMovingElevator } from '@/store/__tests__/testUtils';
import { POSITION_EPSILON } from '@/store/constants';

describe('calculateCurrentPosition - Physics', () => {
  const msPerFloor = 500;

  it('calculates position for elevator moving up', () => {
    const elevator = createMovingElevator(1, 0, [10], 'up');
    elevator.startTime = 1000;
    elevator.startFloor = 0;
    
    const now = 1000 + (2 * msPerFloor);
    const position = calculateCurrentPosition(elevator, now, msPerFloor);
    
    expect(position).toBe(2);
  });

  it('calculates position for elevator moving down', () => {
    const elevator = createMovingElevator(1, 10, [0], 'down');
    elevator.startTime = 1000;
    elevator.startFloor = 10;
    
    const now = 1000 + (3 * msPerFloor);
    const position = calculateCurrentPosition(elevator, now, msPerFloor);
    
    expect(position).toBe(7);
  });

  it('handles fractional positions correctly', () => {
    const elevator = createMovingElevator(1, 0, [10], 'up');
    elevator.startTime = 1000;
    elevator.startFloor = 0;
    
    const now = 1000 + 750;
    const position = calculateCurrentPosition(elevator, now, msPerFloor);
    
    expect(position).toBe(1.5);
  });

  it('rounds position using EPSILON when extremely close to floor', () => {
    const elevator = createMovingElevator(1, 0, [10], 'up');
    elevator.startTime = 1000;
    elevator.startFloor = 0;
    
    const now = 1000 + (4 * msPerFloor) - 1;
    const position = calculateCurrentPosition(elevator, now, msPerFloor);
    
    const roundedPos = Math.round(position);
    const diff = Math.abs(position - roundedPos);
    
    expect(diff).toBeLessThan(POSITION_EPSILON);
    expect(roundedPos).toBe(4);
  });

  it('handles edge case at exact floor arrival', () => {
    const elevator = createMovingElevator(1, 0, [5], 'up');
    elevator.startTime = 1000;
    elevator.startFloor = 0;
    
    const now = 1000 + (5 * msPerFloor);
    const position = calculateCurrentPosition(elevator, now, msPerFloor);
    
    expect(position).toBe(5);
  });
});

describe('getDirection', () => {
  it('returns up when destination is higher', () => {
    expect(getDirection(0, 5)).toBe('up');
  });

  it('returns down when destination is lower', () => {
    expect(getDirection(5, 0)).toBe('down');
  });

  it('returns idle when already at destination', () => {
    expect(getDirection(5, 5)).toBe('idle');
  });
});

describe('getTravelTime', () => {
  const msPerFloor = 500;

  it('calculates travel time upward', () => {
    expect(getTravelTime(0, 5, msPerFloor)).toBe(2500);
  });

  it('calculates travel time downward', () => {
    expect(getTravelTime(5, 0, msPerFloor)).toBe(2500);
  });

  it('returns zero for same floor', () => {
    expect(getTravelTime(5, 5, msPerFloor)).toBe(0);
  });
});
