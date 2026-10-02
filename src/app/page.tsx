'use client';

import MapScreen from '@/components/MapScreen';
import NameEntry from '@/components/NameEntry';
import Loading from '@/components/Loading';
import { useProgress } from '@/lib/useProgress';

export default function HomePage() {
  const { progress, ready, refresh } = useProgress();

  if (!ready) return <Loading />;
  if (!progress.playerName) return <NameEntry onDone={refresh} />;
  return <MapScreen />;
}