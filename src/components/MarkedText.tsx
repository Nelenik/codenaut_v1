'use client';

import { isCssColor, isCssProperty } from '@/lib/cssTerms';

/**
 * A word wrapped in `[[square brackets]]` in a dictionary string is not shown as
 * text — it is marked up, and what it becomes depends on what the word is:
 *
 *  - a **colour** (`[[green]]`) is painted in that colour, with a chip of it
 *    beside the word. Both, not one: painting the word alone means `white`
 *    disappears into white text, and the chip alone leaves the association
 *    between the Russian adjective and the English word weaker.
 *  - a **property** (`[[background-color]]`) gets a bright pill. A property name
 *    is the one thing in the sentence the child has to type exactly, letter for
 *    letter, so it is the thing worth making unmissable.
 *
 * The brackets are markup rather than text, so a token the game does not teach
 * is shown plain — an authoring mistake should be visible in review and harmless
 * to a child.
 */
const TOKEN = /\[\[([a-z][a-z-]*)\]\]/g;

function Token({ word }: { word: string }) {
  if (isCssColor(word)) {
    return (
      <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
        <span
          aria-hidden
          className="inline-block w-3.5 h-3.5 rounded-sm ring-1 ring-white/40 shrink-0"
          style={{ backgroundColor: word }}
        />
        <span className="font-mono font-bold" style={{ color: word }}>
          {word}
        </span>
      </span>
    );
  }

  if (isCssProperty(word)) {
    return (
      <span className="inline-block rounded-md bg-planet-cyan text-space-900 font-mono font-extrabold px-1.5 py-0.5 whitespace-nowrap">
        {word}
      </span>
    );
  }

  return <span className="font-mono font-bold">{word}</span>;
}

/**
 * Child-facing text with its CSS words marked up. Used by the task zone and by
 * the hint toast, so a property name looks the same wherever the child meets it.
 */
export default function MarkedText({ text }: { text: string }) {
  // `split` with a capturing group puts the text and the captured tokens in one
  // list, alternating: the odd indices are the tokens.
  const parts = text.split(TOKEN);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 0 ? <span key={index}>{part}</span> : <Token key={index} word={part} />
      )}
    </>
  );
}