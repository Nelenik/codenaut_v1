'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getWorld } from '@/lib/worlds';
import { assemblePlayfield, assembleReference, loadTask, type LoadedTask } from '@/lib/taskLoader';
import { defaultProgress, loadProgress, type Progress } from '@/lib/progress';
import TaskZone from '@/components/TaskZone';
import CssEditor from '@/components/CssEditor';
import PlayfieldPreview from '@/components/PlayfieldPreview';

type Props = {
  worldId: string;
  levelId: string;
};

export default function LevelScreen({ worldId, levelId }: Props) {
  const { t } = useTranslation();
  const world = getWorld(worldId);
  const level = world?.levels.find((l) => l.id === levelId);

  const [task, setTask] = useState<LoadedTask | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [childCss, setChildCss] = useState('');
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    if (!world || !level) return;
    let cancelled = false;
    setLoadError(null);

    loadTask(world.id, level.file).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(result.error);
        return;
      }
      setTask(result.task);
      setChildCss(
        result.task.config.givesProperty ? `${result.task.config.givesProperty}: ` : ''
      );
    });

    return () => {
      cancelled = true;
    };
  }, [world, level, retryKey]);

  const srcDoc = useMemo(
    () => (task ? assemblePlayfield(task.html, childCss, task.config.selector) : ''),
    [task, childCss]
  );

  const referenceSrcDoc = useMemo(
    () => (task ? assembleReference(task.html, task.config.solution, task.config.selector) : ''),
    [task]
  );

  if (!world || !level) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-space-300 font-display">{t('common.error')}</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-2xl font-display font-bold text-white">
          {t('common.error')}
        </p>
        <p className="text-lg font-mono text-space-300 break-all">{loadError}</p>
        <button
          onClick={() => setRetryKey((k) => k + 1)}
          className="px-8 py-3 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
        >
          {t('common.retry')}
        </button>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-space-300 font-display">{t('common.loading')}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
      <header className="flex items-center gap-4">
        <Link
          href={`/play/${worldId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-space-800/80 hover:bg-space-700 transition-colors border border-space-600 text-white font-display font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t('level.back')}</span>
        </Link>
        <span className="font-display text-xl font-extrabold" style={{ color: world.color }}>
          {t(world.labelKey)}
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <section className="lg:col-span-1">
          <TaskZone taskText={t(`tasks.${task.config.id}.text`, { name: progress.playerName })} />
        </section>

        <section className="lg:col-span-1 flex flex-col gap-3">
          <CssEditor value={childCss} onChange={setChildCss} />
        </section>

        <section className="lg:col-span-1 min-h-[320px]">
          <PlayfieldPreview
            ref={iframeRef}
            srcDoc={srcDoc}
            referenceSrcDoc={referenceSrcDoc}
            title={t('map.title')}
            compareHint={t('level.compareHint')}
            childLabel={t('level.yours')}
            referenceLabel={t('level.target')}
          />
        </section>
      </div>
    </main>
  );
}