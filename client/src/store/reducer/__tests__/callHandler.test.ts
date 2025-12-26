import { describe, it, expect, vi } from 'vitest';
import { handleCall } from '@/store/reducer/handlers/callHandler';
import * as dispatcher from '@/store/planner/dispatcher';
import { createIdleElevator, createMovingElevator, createTestState } from '@/store/__tests__/testUtils';

describe('handleCall - Queue Logic', () => {
  it('queues request when dispatcher returns null', () => {
    vi.spyOn(dispatcher, 'selectByETA').mockReturnValue(null);
    
    const busyElevators = [
      createMovingElevator(1, 0, [1,2,3,4,5,6,7,8,9,10], 'up'),
      createMovingElevator(2, 5, [6,7,8,9,10,11,12,13,14,15], 'up')
    ];
    const state = createTestState(busyElevators);
    
    const newState = handleCall(state, 3, Date.now());
    
    expect(newState.queue).toContain(3);
    expect(newState.floors[3]).toBe('waiting');
  });

  it('does not queue if floor already in queue', () => {
    vi.spyOn(dispatcher, 'selectByETA').mockReturnValue(null);
    
    const state = createTestState([createIdleElevator(1, 0)]);
    state.queue = [5, 7];
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState.queue.filter(f => f === 5).length).toBe(1);
  });
});

describe('handleCall - Immediate Arrival', () => {
  it('handles call when idle elevator is already at floor', () => {
    const elevator = createIdleElevator(1, 5);
    const state = createTestState([elevator]);
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).not.toBe(state);
    expect(newState.floors[5]).toBeDefined();
  });

  it('handles call when elevator needs to travel', () => {
    const elevator = createIdleElevator(1, 0);
    const state = createTestState([elevator]);
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).not.toBe(state);
    expect(newState.floors[5]).toBe('waiting');
  });
});

describe('handleCall - Duplicate Prevention', () => {
  it('ignores call if floor is already waiting', () => {
    const state = createTestState([createIdleElevator(1, 0)]);
    state.floors[5] = 'waiting';
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).toBe(state);
  });

  it('ignores call if floor is already arrived', () => {
    const state = createTestState([createIdleElevator(1, 0)]);
    state.floors[5] = 'arrived';
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).toBe(state);
  });
});

describe('handleCall - Elevator Assignment', () => {
  it('creates new state when call is processed', () => {
    const elevator = createIdleElevator(1, 0);
    const state = createTestState([elevator]);
    
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).not.toBe(state);
    expect(newState.floors[5]).toBe('waiting');
  });

  it('handles null elevator gracefully', () => {
    vi.spyOn(dispatcher, 'selectByETA').mockReturnValue({
      elevatorId: 999,
      eta: 5000,
      destinations: [5]
    });
    
    const state = createTestState([createIdleElevator(1, 0)]);
    const newState = handleCall(state, 5, Date.now());
    
    expect(newState).toBe(state);
  });
});
