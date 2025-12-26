import { useEffect, useRef } from 'react';
import type { Elevator } from '@/store/types';

interface Callbacks {
  onArrived: (id: number) => void;
  onRelease: (id: number) => void;
}

interface ScheduledEvent {
  timeoutId: ReturnType<typeof setTimeout>;
  revision: number;
}

export const useElevatorScheduler = (
  elevators: Elevator[],
  { onArrived, onRelease }: Callbacks
) => {
  const timersRef = useRef<Map<number, ScheduledEvent>>(new Map());

  useEffect(() => {
    elevators.forEach(elevator => {
      const { nextEvent, id, revision } = elevator;
      
      if (!nextEvent) {
        const existing = timersRef.current.get(id);
        if (existing) {
          clearTimeout(existing.timeoutId);
          timersRef.current.delete(id);
        }
        return;
      }
      
      const existing = timersRef.current.get(id);
      if (existing && existing.revision === nextEvent.revision) {
        return;
      }
      
      if (existing) {
        clearTimeout(existing.timeoutId);
      }
      
      const delay = Math.max(0, nextEvent.at - Date.now());
      
      const timeoutId = setTimeout(() => {
        timersRef.current.delete(id);
        
        if (nextEvent.revision !== revision) return;
        
        if (nextEvent.type === 'ARRIVE') {
          onArrived(id);
        } else if (nextEvent.type === 'RELEASE') {
          onRelease(id);
        }
      }, delay);
      
      timersRef.current.set(id, { timeoutId, revision: nextEvent.revision });
    });
  }, [elevators, onArrived, onRelease]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(({ timeoutId }) => clearTimeout(timeoutId));
      timersRef.current.clear();
    };
  }, []);
};