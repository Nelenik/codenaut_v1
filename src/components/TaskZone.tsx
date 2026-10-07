'use client';

import MarkedText from '@/components/MarkedText';
import CommandParts, { type CommandPart } from '@/components/CommandParts';

type Props = {
  taskText: string;
  teachTitle?: string;
  /** The how-to, one idea per line. */
  teachBody?: string[];
  example?: string;
  /** The parts of one command, each with what it does. Present on the
   *  lesson level that teaches the command itself. */
  parts?: CommandPart[];
  answerLabel?: string;
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
export default function TaskZone({ taskText, teachTitle, teachBody, example, parts, narratorLabel }: Props) {
  return (
    <section className="rounded-2xl bg-space-800/70 border-2 border-space-600 p-4 md:p-5 flex gap-4 md:gap-6 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <img src="/assets/kid.svg" alt="" className="w-16 h-24 md:w-20 md:h-30" />
        <span className="text-base font-display font-bold text-space-300 text-center leading-tight max-w-20">
          {narratorLabel}
        </span>
      </div>

      <div className="flex-1 min-w-0 grid gap-4 md:gap-6 items-start md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <p className="font-display text-xl md:text-2xl font-extrabold leading-snug text-white text-balance whitespace-pre-line">
          {<MarkedText text={taskText} />}
        </p>

        {teachBody ? (
          <div className="bg-space-900/60 border-2 border-dashed border-planet-yellow/50 rounded-xl p-3 md:p-4 ">
            {teachTitle ? (
              <p className="font-display text-base md:text-lg font-bold text-planet-yellow mb-1">
                {teachTitle}
              </p>
            ) : null}
            <div className="flex flex-col gap-3">
              {teachBody.map((line, i) => (
                <p key={i} className="text-base md:text-lg leading-relaxed text-space-100 whitespace-pre-line">
                  <MarkedText text={line} />
                </p>
              ))}
            </div>
            {parts && parts.length > 0 ? (
              <CommandParts parts={parts} />
            ) : example ? (
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