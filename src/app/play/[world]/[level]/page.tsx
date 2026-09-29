'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getWorld } from '@/lib/worlds';

export default function LevelPlaceholder() {
  const { t } = useTranslation();
  const params = useParams<{ world: string; level: string }>();
  const world = getWorld(params.world);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="font-display text-3xl font-extrabold" style={{ color: world?.color ?? '#fff' }}>
        {world ? t(world.labelKey) : '?'} — {params.level}
      </h1>
      <p className="text-xl text-space-300 font-display">{t('common.loading')}</p>
      <Link
        href={`/play/${params.world}`}
        className="px-8 py-3 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
      >
        {t('level.back')}
      </Link>
    </main>
  );
}
