import { useRef, useEffect } from 'react';
import type { Elevator } from '@/store/types';

let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playDing = () => {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain).connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 660;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1);

  osc.start(now);
  osc.stop(now + 1);
};

export const useElevatorAudio = (elevators: Elevator[]) => {
  const prevArrived = useRef<Set<number>>(new Set());

  useEffect(() => {
    const arrivedIds = new Set(
      elevators.filter(e => e.status === 'arrived').map(e => e.id)
    );

    const hasNew = [...arrivedIds].some(id => !prevArrived.current.has(id));
    if (hasNew) playDing();

    prevArrived.current = arrivedIds;
  }, [elevators]);
};
