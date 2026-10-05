'use client';

import { isCssColor } from '@/lib/cssColors';

/**
 * A word wrapped in `[[square brackets]]` in a dictionary string is painted in
 * the CSS colour it names, with a chip of that colour beside it.
 *
 * Both, not one: painting the word alone means `white` disappears into white
 * text, and the chip alone leaves the association between the Russian adjective
 * and the English word weaker. The brackets are markup rather than text, so a
 * token the game does not teach is shown plain — an authoring mistake should be
 * visible in review and harmless to a child.
 */
const TOKEN = /\[\[([a-z]+)\]\]/g;

function ColourWords({ text }: { text: string }) {
  // `split` with a capturing group puts the text and the captured tokens in one
  // list, alternating: the odd indices are the tokens.
  const parts = text.split(TOKEN);

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) return <span key={index}>{part}</span>;

        if (!isCssColor(part)) {
          return (
            <span key={index} className="font-mono font-bold">
              {part}
            </span>
          );
        }

        return (
          <span
            key={index}
            className="inline-flex items-baseline gap-1.5 whitespace-nowrap"
          >
            <span
              aria-hidden
              className="inline-block w-3.5 h-3.5 rounded-sm ring-1 ring-white/40 shrink-0"
              style={{ backgroundColor: part }}
            />
            <span className="font-mono font-bold" style={{ color: part }}>
              {part}
            </span>
          </span>
        );
      })}
    </>
  );
}

type Props = {
  taskText: string;
  teachTitle?: string;
  teachBody?: string;
  example?: string;
  narratorLabel: string;
};

/**
 * The task reads in two columns on a wide screen: the sentence the hero is
 * saying on the left, the "how to do it" block on the right. One sentence and a
 * paragraph of explanation are different weights of reading, and side by side the
 * child can see that they are two separate things.
 *
 * On a narrow screen they stack, which is the same order as before.
 */
export default function TaskZone({ taskText, teachTitle, teachBody, example, narratorLabel }: Props) {
  return (
    <section className="rounded-2xl bg-space-800/70 border-2 border-space-600 p-4 md:p-5 flex gap-4 md:gap-6 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <img src="/assets/kid.svg" alt="" className="w-16 h-24 md:w-20 md:h-30" />
        <span className="text-base font-display font-bold text-space-300 text-center leading-tight max-w-20">
          {narratorLabel}
        </span>
      </div>

      <div className="flex-1 min-w-0 grid gap-4 md:gap-6 items-start md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <p className="font-display text-xl md:text-2xl font-extrabold leading-snug text-white text-balance">
          <ColourWords text={taskText} />
        </p>

        {teachBody ? (
          <div className="bg-space-900/60 border-2 border-dashed border-planet-yellow/50 rounded-xl p-3 md:p-4">
            {teachTitle ? (
              <p className="font-display text-base md:text-lg font-bold text-planet-yellow mb-1">
                {teachTitle}
              </p>
            ) : null}
            <p className="text-base md:text-lg leading-relaxed text-space-100">
              <ColourWords text={teachBody} />
            </p>
            {example ? (
              <code className="inline-block mt-3 px-4 py-2 rounded-lg bg-space-900 text-planet-lime font-mono text-base md:text-lg">
                {example}
              </code>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}