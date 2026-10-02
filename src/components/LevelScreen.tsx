'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getWorld, nextLevel, worldAfter, levelKey } from '@/lib/worlds';
import { assemblePlayfield, assembleReference, loadTask, type LoadedTask } from '@/lib/taskLoader';
import { check, type CheckOutcome } from '@/lib/checker';
import { starsForAttempts, MAX_STARS } from '@/lib/stars';
import { recordTaskSuccess, unlockLevel, unlockWorld } from '@/lib/progress';
import { useProgress } from '@/lib/useProgress';
import TaskZone from '@/components/TaskZone';
import CssEditor from '@/components/CssEditor';
import PlayfieldPreview from '@/components/PlayfieldPreview';
import CheckButton from '@/components/CheckButton';
import Loading from '@/components/Loading';

type Result = {
  kind: CheckOutcome['kind'];
  stars?: number;
  expected?: string;
  property?: string | null;
};

type Props = {
  worldId: string;
  levelId: string;
};

export default function LevelScreen({ worldId, levelId }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { progress, ready } = useProgress();
  const world = getWorld(worldId);
  const level = world?.levels.find((l) => l.id === levelId);

  const [task, setTask] = useState<LoadedTask | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [childCss, setChildCss] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
      setFailedAttempts(0);
      setResult(null);
      setCelebrating(false);
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

  if (!ready) return <Loading />;

  if (loadError) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-2xl font-display font-bold text-white">{t('common.error')}</p>
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

  if (!task) return <Loading />;

  const taskKey = `tasks.${task.config.id}`;
  const taskId = `${worldId}/${level.file}`;

  const runCheck = () => {
    const outcome = check(iframeRef.current, childCss, task.config);

    if (outcome.kind === 'success') {
      const stars = starsForAttempts(failedAttempts);
      recordTaskSuccess(taskId, stars, failedAttempts);
      setResult({ kind: 'success', stars });

      const upcoming = nextLevel(worldId, levelId);
      if (upcoming) {
        unlockLevel(levelKey(worldId, upcoming.id));
      } else {
        const upcomingWorld = worldAfter(worldId);
        if (upcomingWorld) {
          unlockWorld(upcomingWorld);
          unlockLevel(levelKey(upcomingWorld, '01'));
        }
      }

      setCelebrating(true);
      return;
    }

    if (outcome.kind === 'rightLookWrongProperty') {
      // No attempt is spent: the child found the look they wanted, which is
      // real understanding. But the task is not completed — the property name
      // is the lesson.
      setResult({ kind: outcome.kind, expected: outcome.expected, property: outcome.property });
      return;
    }

    setFailedAttempts((n) => n + 1);
    setResult({ kind: outcome.kind, property: 'property' in outcome ? outcome.property : null });
  };

  // The PRD wants no separate "next" click: a success goes straight on. The
  // celebration stays up long enough to actually see the stars first.
  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => {
      const upcoming = nextLevel(worldId, levelId);
      router.push(upcoming ? `/play/${worldId}/${upcoming.id}` : `/play/${worldId}`);
    }, 2600);
    return () => clearTimeout(timer);
  }, [celebrating, worldId, levelId, router]);

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
        {result?.kind === 'success' && result.stars !== undefined ? (
          <span className="ml-auto font-display text-3xl" aria-label={`${result.stars}/${MAX_STARS}`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < (result.stars ?? 0) ? '' : 'opacity-25 grayscale'}>
                ★
              </span>
            ))}
          </span>
        ) : null}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
        <section className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          <CssEditor value={childCss} onChange={setChildCss} />
          <CheckButton onCheck={runCheck} label={t('level.check')} />
        </section>

        <section className="lg:col-span-3 min-h-80 lg:min-h-0">
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

      {celebrating && result?.kind === 'success' && result.stars !== undefined ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-space-900/95">
          <p className="font-display text-4xl md:text-6xl font-extrabold text-planet-lime text-balance text-center px-6">
            {t('level.success')}
          </p>
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`text-6xl md:text-8xl ${i < (result.stars ?? 0) ? 'animate-bounce' : 'opacity-25 grayscale'}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                ★
              </span>
            ))}
          </div>
          <p className="font-display text-xl text-space-200">{t('level.nextComingUp')}</p>
        </div>
      ) : null}

      {result && !celebrating ? <ResultMessage result={result} /> : null}

      <TaskZone
        taskText={t(`${taskKey}.text`, { name: progress.playerName })}
        teachTitle={t(`${taskKey}.teachTitle`)}
        teachBody={t(`${taskKey}.teachBody`)}
        example={t(`${taskKey}.example`)}
        narratorLabel={progress.playerName || t('level.narrator')}
      />
    </main>
  );
}

function ResultMessage({ result }: { result: Result }) {
  const { t } = useTranslation();

  const styles: Record<string, string> = {
    success: 'bg-lime-400/20 border-lime-400 text-lime-100',
    rightLookWrongProperty: 'bg-planet-yellow/20 border-planet-yellow text-yellow-50',
    wrong: 'bg-space-800/80 border-space-600 text-white',
    nothingTyped: 'bg-space-800/80 border-space-600 text-white',
  };

  const text: Record<string, string> = {
    success: t('level.success'),
    rightLookWrongProperty: t('level.wrongProperty', { property: result.expected ?? '' }),
    wrong: t('level.wrongLook'),
    nothingTyped: t('level.nothingTyped'),
  };

  return (
    <div
      role="status"
      className={`rounded-2xl border-4 p-4 md:p-5 font-display text-xl md:text-2xl font-bold ${styles[result.kind]}`}
    >
      {text[result.kind]}
    </div>
  );
}