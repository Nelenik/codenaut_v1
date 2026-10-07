'use client';

import type { CSSProperties } from 'react';
import { isCssColor, isCssProperty } from '@/lib/cssTerms';

export type CommandPart = {
  token: string;
  label: string;
};

type Props = {
  parts: CommandPart[];

};

/**
 * The parts of one command, each in its own colour, with what that part
 * does written under it, and the whole command below.
 *
 * A colour is shown in the colour it names; a property gets the cyan the
 * app uses for property names everywhere; the colon and the semicolon each
 * get a colour of their own. The four parts are therefore four different
 * colours, so a small reader can tell them apart at a glance — and the
 * value is the very colour the playfield is about to become.
 */
function partAppearance(token: string): { className: string; style?: CSSProperties } {
  if (isCssColor(token)) {
    return { className: '', style: { color: token } };
  }
  if (isCssProperty(token)) {
    return { className: 'text-planet-cyan' };
  }
  if (token === ':') {
    return { className: 'text-planet-yellow' };
  }
  if (token === ';') {
    return { className: 'text-planet-magenta' };
  }
  return { className: 'text-white' };
}

export default function CommandParts({ parts }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {/* The cards share one row on a wide screen and fall to
          two per row on a phone; a long token wraps at its
          hyphen rather than breaking the row. */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {parts.map((part, i) => {
          const appearance = partAppearance(part.token);
          return (
            <span
              key={i}
              aria-hidden
              data-part={i + 1}
              className={`relative text-center font-mono text-base md:text-2xl font-extrabold leading-tight ${appearance.className} after:content-[attr(data-part)] after:absolute after:-top-3 after:left-1/2 after:-translate-x-1/2 after:text-xs after:font-bold after:text-white `}
              style={appearance.style}
            >
              {part.token}
            </span>
          );
        })}
      </div>

      {/* <div className="flex flex-col items-center gap-1">
        <span className="font-display text-sm md:text-base font-bold text-planet-yellow">
          {answerLabel}
        </span>
        <code className="rounded-lg bg-space-900 px-4 py-1.5 font-mono text-lg md:text-xl font-bold text-planet-lime">
          {answer}
        </code>
      </div> */}
    </div>
  );
}
