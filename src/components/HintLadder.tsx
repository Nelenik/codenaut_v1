'use client';

import { useState } from 'react';

type Props = {
  /** Fills the editor in and completes the level at the cost of every star. */
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
 * a working answer. The first rung — guiding words — is not here: it arrives in
 * the hint toast after a failed check, so the words and the mechanism stay in
 * one place instead of the same hint appearing twice in two different boxes.
 */
export default function HintLadder({ solution, labels, onUseSolution }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl bg-space-800/70 border-2 border-dashed border-space-600 p-4 md:p-5 flex flex-wrap items-center gap-3">
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

      <p className="w-full text-sm text-space-300 font-display">{labels.solutionCosts}</p>
    </div>
  );
}