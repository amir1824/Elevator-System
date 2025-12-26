import { describe, it, expect } from 'vitest';
import { sortDestinationsLOOK } from '@/store/utils/destinations';

describe('sortDestinationsLOOK - Basic Tests', () => {
  it('going up: sorts [20, 15, 18] from floor 10', () => {
    const result = sortDestinationsLOOK([20, 15, 18], 10, 'up');
    expect(result).toEqual([15, 18, 20]);
  });

  it('going down: sorts [5, 10, 8] from floor 15', () => {
    const result = sortDestinationsLOOK([5, 10, 8], 15, 'down');
    expect(result).toEqual([10, 8, 5]);
  });

  it('mid-journey up: floor 15 going to 20, adds 17,18', () => {
    const result = sortDestinationsLOOK([20, 18, 17], 15, 'up');
    expect(result).toEqual([17, 18, 20]);
  });

  it('mid-journey down: floor 6 going to 1, adds 4,5', () => {
    const result = sortDestinationsLOOK([1, 4, 5], 6, 'down');
    expect(result).toEqual([5, 4, 1]);
  });

  it('backtracking up: floor 10→20, add 5 (behind) -> [20, 5]', () => {
    const result = sortDestinationsLOOK([20, 5], 10, 'up');
    expect(result).toEqual([20, 5]);
  });

  it('backtracking down: floor 10→1, add 15 (behind) -> [1, 15]', () => {
    const result = sortDestinationsLOOK([1, 15], 10, 'down');
    expect(result).toEqual([1, 15]);
  });

  it('overshoot up: at floor 10 going UP, call for 9 -> [15, 9]', () => {
    const result = sortDestinationsLOOK([15, 9], 10, 'up');
    expect(result).toEqual([15, 9]);
  });
});
