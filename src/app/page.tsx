'use client';

import { useState, useEffect } from 'react';
import MapScreen from '@/components/MapScreen';
import NameEntry from '@/components/NameEntry';
import { defaultProgress, loadProgress, type Progress } from '@/lib/progress';

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress.playerName) {
    return <NameEntry onDone={() => setProgress(loadProgress())} />;
  }

  return <MapScreen />;
}