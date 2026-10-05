'use client';

import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  text: string;
  closeLabel: string;
  onDismiss: () => void;
};

/**
 * A notice about the state of the screen, not an answer to anything the child
 * did: the picture went blank, something failed to load. It floats at the top so
 * it never covers the editor or collides with the hint toast at the bottom, and
 * it can be closed by hand as well as by the condition clearing.
 *
 * The rule this component exists for: a warning is not part of the page. Text
 * pasted between the editor and the Check button becomes part of the layout, and
 * a child aiming a mouse at a big yellow button has to aim past it first.
 */
export default function NoticeToast({ title, text, closeLabel, onDismiss }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      ref={panelRef}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,40rem)] rounded-3xl border-4 border-planet-orange bg-space-800/95 shadow-2xl px-5 py-4 flex gap-4 items-start"
    >
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg md:text-xl font-extrabold text-planet-orange mb-1">
          {title}
        </p>
        <p className="text-lg md:text-xl text-space-50 leading-relaxed">{text}</p>
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