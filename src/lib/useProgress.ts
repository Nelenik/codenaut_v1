'use client';

import { useCallback, useEffect, useState } from 'react';
import { defaultProgress, loadProgress, type Progress } from '@/lib/progress';

/**
 * `localStorage` is unavailable during SSR, so progress cannot be read on the
 * first render. Every screen starts from the default state and switches to the
 * stored one in an effect — `ready` tells a screen when that has happened, so
 * it can show a loader instead of briefly rendering the wrong thing (a name
 * screen for a player who already has a name, or locks for levels they cleared).
 * `refresh` re-reads after something writes, e.g. the name screen.
 */
export function useProgress(): {
  progress: Progress;
  ready: boolean;
  refresh: () => void;
} {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  const refresh = useCallback(() => setProgress(loadProgress()), []);

  return { progress, ready, refresh };
}