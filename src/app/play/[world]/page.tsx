import { notFound } from 'next/navigation';
import LevelList from '@/components/LevelList';
import { getWorld } from '@/lib/worlds';

export default async function PlayPage({ params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  if (!getWorld(world)) notFound();
  return <LevelList worldId={world} />;
}
