import type { Elevator, IdleElevator, MovingElevator } from '@/store/types';

export const isIdle = (e: Elevator): e is IdleElevator => e.status === 'idle';
export const isMoving = (e: Elevator): e is MovingElevator => e.status === 'moving';
