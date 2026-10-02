import { notFound } from 'next/navigation';
import LevelScreen from '@/components/LevelScreen';
import { getWorld } from '@/lib/worlds';

export default async function LevelPage({
  params,
}: {
  params: Promise<{ world: string; level: string }>;
}) {
  const { world, level } = await params;
  const meta = getWorld(world);
  if (!meta || !meta.levels.some((l) => l.id === level)) notFound();
  return <LevelScreen worldId={world} levelId={level} />;
}