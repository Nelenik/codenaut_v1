'use client';

import { useState } from 'react';

type Props = {
  /** Step 1 — words pointing at what to change. Always visible after a failed check. */
  guidingHint: string;
  /** Step 3 — fills the editor in and completes the level at the cost of every star. */
  solution: string;
  labels: {
    reveal: string;
    useSolution: string;
    solutionCosts: string;
  };
  onUseSolution: () => void;
};

/**
 * A child must never be stuck with no way forward, so the ladder always ends at
 * a working answer. It is deliberately short: guiding words, then the answer
 * with the characters hidden, then the answer itself. The third step costs
 * every star for the level but still completes it — a 7-year-old stuck on task
 * 3 of 5 is a worse outcome than one who learns by watching an answer once.
 */
export default function HintLadder({ guidingHint, solution, labels, onUseSolution }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl bg-space-800/70 border-2 border-dashed border-space-600 p-4 md:p-5 flex flex-col gap-4">
      <p className="text-lg md:text-xl text-space-100 leading-relaxed">
        <span className="font-display font-bold text-planet-yellow">💡 </span>
        {guidingHint}
      </p>

      <div className="flex flex-wrap items-center gap-3">
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

      <p className="text-sm text-space-300 font-display">{labels.solutionCosts}</p>
    </div>
  );
}
