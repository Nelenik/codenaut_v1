'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getWorld, nextLevel, worldAfter, levelKey } from '@/lib/worlds';
import { assemblePlayfield, assembleReference, loadTask, type LoadedTask } from '@/lib/taskLoader';
import { check, parseDeclarations, type CheckOutcome } from '@/lib/checker';
import { starsForAttempts, MAX_STARS } from '@/lib/stars';
import { recordTaskSuccess, resetTaskForReplay, unlockLevel, unlockWorld } from '@/lib/progress';
import { useProgress } from '@/lib/useProgress';
import TaskZone from '@/components/TaskZone';
import CssEditor from '@/components/CssEditor';
import PropertyBasket from '@/components/PropertyBasket';
import PlayfieldPreview from '@/components/PlayfieldPreview';
import CheckButton from '@/components/CheckButton';
import ResultToast from '@/components/ResultToast';
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

    // The previous run's stars are dropped the moment the child actually tries
    // a replay: they wrote something and asked for it to be checked. Merely
    // opening a completed level, or pressing Check with nothing written, leaves
    // the earlier result alone — a score should not evaporate for looking at it.
    if (parseDeclarations(childCss).length > 0) {
      resetTaskForReplay(taskId);
    }

    if (outcome.kind === 'success') {
      const stars = starsForAttempts(failedAttempts);
      recordTaskSuccess(taskId, stars, failedAttempts);
      setResult({ kind: 'success', stars });

      unlockNext();
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

  const unlockNext = () => {
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
  };

  const useSolution = () => {
    if (!task) return;
    setChildCss(task.config.solution);
    // The ready-made solution completes the level with 0 stars. A child stuck
    // mid-level must always have a way forward.
    recordTaskSuccess(taskId, 0, 999);
    setResult({ kind: 'success', stars: 0 });
    setCelebrating(true);
    unlockNext();
  };

  /**
   * What the basket offers is derived from the editor text rather than kept in
   * its own state, so a property that is written is not offered, and it comes
   * back the moment it leaves the editor — whether the child pressed × or just
   * deleted the text.
   */
  const written = new Set(parseDeclarations(childCss).map((declaration) => declaration.property));
  const basket = task.config.basket;
  const availableBasket = basket.filter((item) => !written.has(item.property));
  const placedBasket = basket.filter((item) => written.has(item.property));

  const removeProperty = (property: string) => {
    const pattern = new RegExp(`^\\s*${property}\\s*:`, 'i');
    setChildCss(
      childCss
        .split('\n')
        .filter((line) => !pattern.test(line))
        .join('\n')
    );
  };

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

      <TaskZone
        taskText={t(`${taskKey}.text`, { name: progress.playerName })}
        teachTitle={t(`${taskKey}.teachTitle`)}
        teachBody={t(`${taskKey}.teachBody`)}
        example={t(`${taskKey}.example`)}
        narratorLabel={progress.playerName || t('level.narrator')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
        <section className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          <PropertyBasket
            available={availableBasket}
            inserted={placedBasket.map((item) => item.property)}
            onRemove={removeProperty}
            label={t('basket.label')}
            placedLabel={t('basket.placed')}
            removeLabel={t('basket.remove')}
            hint={t('basket.hint')}
          />
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
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 p-6 bg-space-900/95">
          <p className="font-display text-4xl md:text-6xl font-extrabold text-planet-lime text-balance text-center">
            {t(`${taskKey}.success`)}
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

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            {nextLevel(worldId, levelId) ? (
              <button
                onClick={() => router.push(`/play/${worldId}/${nextLevel(worldId, levelId)!.id}`)}
                className="flex-1 px-6 py-4 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-xl hover:bg-yellow-300 transition-colors"
              >
                {t('level.next')}
              </button>
            ) : null}
            <button
              onClick={() => router.push(`/play/${worldId}`)}
              className="flex-1 px-6 py-4 rounded-full bg-space-700 text-white font-display font-extrabold text-xl hover:bg-space-600 transition-colors"
            >
              {t('level.back')}
            </button>
          </div>
        </div>
      ) : null}

      {result && !celebrating ? (
        <ResultToast
          kind={
            result.kind === 'rightLookWrongProperty'
              ? 'praise'
              : result.kind === 'nothingTyped'
                ? 'empty'
                : 'hint'
          }
          title={
            result.kind === 'rightLookWrongProperty' ? t('toast.praiseTitle') : t('toast.hintTitle')
          }
          text={
            result.kind === 'rightLookWrongProperty'
              ? t('level.wrongProperty', { property: result.expected ?? '' })
              : result.kind === 'nothingTyped'
                ? t('level.nothingTyped')
                : t(`${taskKey}.hints.0`)
          }
          solution={result.kind === 'nothingTyped' ? undefined : task.config.solution}
          labels={{
            reveal: t('level.reveal'),
            useSolution: t('level.useSolution'),
            solutionCosts: t('level.solutionCosts'),
          }}
          onUseSolution={useSolution}
          onDismiss={() => setResult(null)}
        />
      ) : null}
    </main>
  );
}