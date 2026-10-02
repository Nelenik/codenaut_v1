'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getWorld, WORLDS, taskId } from '@/lib/worlds';
import { loadProgress, isLevelUnlocked, defaultProgress, type Progress } from '@/lib/progress';

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count}/3`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? 'text-2xl' : 'text-2xl opacity-25 grayscale'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function LevelList({ worldId }: { worldId: string }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  const world = getWorld(worldId);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!world) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-space-300 font-display">{t('common.loading')}</p>
      </main>
    );
  }

  const totalStars = world.levels.reduce((sum, level) => {
    const task = progress.tasks[taskId(world.id, level.file)];
    return sum + (task?.stars ?? 0);
  }, 0);

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-space-800/80 hover:bg-space-700 transition-colors border border-space-600 text-white font-display font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t('levelList.back')}</span>
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold" style={{ color: world.color }}>
          {t(world.labelKey)}
        </h1>
        <span className="ml-auto font-display font-bold text-xl text-planet-yellow whitespace-nowrap">
          ★ {totalStars} / 15
        </span>
      </header>

      <ul className="flex flex-col gap-4">
        {world.levels.map((level, index) => {
          const key = `${world.id}/${level.id}`;
          const unlocked = isLevelUnlocked(key);
          const task = progress.tasks[taskId(world.id, level.file)];
          const completed = task?.completed ?? false;
          const isNext = unlocked && !completed;

          const inner = (
            <>
              <span
                className={`flex items-center justify-center w-14 h-14 rounded-2xl font-display text-2xl font-extrabold shrink-0 ${
                  completed
                    ? 'bg-lime-400/20 text-lime-300 border-2 border-lime-400'
                    : isNext
                      ? 'bg-planet-yellow text-space-900'
                      : 'bg-space-700 text-space-400'
                }`}
              >
                {unlocked ? index + 1 : '🔒'}
              </span>
              <span className="flex-1" />
              {completed ? (
                <StarRow count={task?.stars ?? 0} />
              ) : isNext ? (
                <span className="text-2xl text-planet-yellow" aria-hidden>
                  ▶
                </span>
              ) : null}
            </>
          );

          return (
            <li key={level.id}>
              {unlocked ? (
                <Link
                  href={`/play/${world.id}/${level.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-space-800/70 border-2 border-space-600 hover:border-planet-yellow hover:bg-space-700 transition-colors min-h-20"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-space-800/30 border-2 border-space-700/50 opacity-60 min-h-20 cursor-not-allowed">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
