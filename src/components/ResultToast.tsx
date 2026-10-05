'use client';

import { useEffect, useRef, useState } from 'react';

import MarkedText from '@/components/MarkedText';

type Kind = 'hint' | 'praise' | 'empty';

type Props = {
  kind: Kind;
  title: string;
  text: string;
  closeLabel: string;
  /** Omitted when there is nothing to give away yet (nothing was typed). */
  solution?: string;
  labels?: {
    reveal: string;
    useSolution: string;
    solutionCosts: string;
  };
  onUseSolution?: () => void;
  onDismiss: () => void;
};

/**
 * One box for everything a stuck child needs: the guiding words from the task's
 * `hints`, the answer with its characters hidden, and the ready-made answer.
 * They live together on purpose — a hint in one place and its answer in another
 * makes a child hunt for where to go next.
 *
 * Warm amber rather than red, floating rather than inline so it never covers the
 * editor, and it stays until acted on: a hint that times out unread is not a hint.
 * Esc or a click outside closes it. That click is deliberately *not* blocked —
 * dismissing the toast and typing in the editor must be possible in one motion.
 */
export default function ResultToast({
  kind,
  title,
  text,
  closeLabel,
  solution,
  labels,
  onUseSolution,
  onDismiss,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const accent = kind === 'praise' ? 'border-planet-yellow' : 'border-planet-orange/70';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onDismiss();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      ref={panelRef}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,44rem)] rounded-3xl border-4 ${accent} bg-space-800/95 shadow-2xl px-5 py-4 md:px-7 md:py-5 flex gap-4 items-start`}
    >
      <img src="/assets/kid.svg" alt="" className="w-10 h-16 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-display text-lg md:text-xl font-extrabold text-planet-yellow mb-1">
          {title}
        </p>
        <p className="text-lg md:text-xl text-space-50 leading-relaxed">
          <MarkedText text={text} />
        </p>

        {solution && labels && onUseSolution ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code
                className={`px-4 py-2 rounded-lg bg-space-900 font-mono text-lg select-none transition-all ${
                  revealed ? 'text-planet-lime' : 'text-planet-lime/40 blur-md'
                }`}
              >
                {solution}
              </code>

              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="px-5 py-2 rounded-full bg-space-700 text-white font-display font-bold hover:bg-space-600 transition-colors"
                >
                  {labels.reveal}
                </button>
              ) : null}

              <button
                onClick={onUseSolution}
                className="px-6 py-3 rounded-full bg-planet-magenta text-white font-display font-extrabold text-lg hover:brightness-110 transition-all"
              >
                {labels.useSolution}
              </button>
            </div>
            <p className="mt-2 text-sm text-space-300 font-display">{labels.solutionCosts}</p>
          </>
        ) : null}
      </div>

      <button
        onClick={onDismiss}
        aria-label={closeLabel}
        className="p-2 rounded-full text-space-300 hover:text-white hover:bg-space-700 transition-colors text-xl leading-none shrink-0"
      >
        ✕
      </button>
    </div>
  );
}