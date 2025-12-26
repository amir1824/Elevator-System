import type { Direction, MovingElevator } from '@/store/types';

export const getDirection = (from: number, to: number): Direction =>
    from < to ? 'up' : from > to ? 'down' : 'idle';

export const getTravelTime = (from: number, to: number, msPerFloor: number): number =>
    Math.abs(to - from) * msPerFloor;

export const calculateCurrentPosition = (
    elevator: MovingElevator,
    now: number,
    msPerFloor: number
): number => {
    const elapsed = now - elevator.startTime;
    const traveled = elapsed / msPerFloor;
    return elevator.direction === 'up'
        ? elevator.startFloor + traveled
        : elevator.startFloor - traveled;
};

export const formatTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    return seconds >= 60 
        ? `${Math.floor(seconds / 60)} min. ${seconds % 60} sec.`
        : `${seconds} Sec.`;
};
