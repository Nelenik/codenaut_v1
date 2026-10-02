'use client';

import { forwardRef, useRef } from 'react';

type Props = {
  srcDoc: string;
  referenceSrcDoc: string;
  title: string;
  compareHint: string;
  childLabel: string;
  referenceLabel: string;
};

/**
 * Cursor-following wipe, the way CSS Battle compares. The reference iframe is
 * full size and clipped to the region right of the cursor, so the child sees
 * their own result on the left and the target on the right, split exactly where
 * the pointer is. Position is written straight to the DOM node: doing it through
 * state would re-render the level screen on every mouse move.
 */
const PlayfieldPreview = forwardRef<HTMLIFrameElement, Props>(function PlayfieldPreview(
  { srcDoc, referenceSrcDoc, title, compareHint, childLabel, referenceLabel },
  ref
) {
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const hide = () => {
    if (wipeRef.current) wipeRef.current.style.clipPath = 'inset(0 100% 0 0)';
    if (lineRef.current) lineRef.current.style.opacity = '0';
  };

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));

    if (wipeRef.current) wipeRef.current.style.clipPath = `inset(0 0 0 ${0 + pct}%)`;
    if (lineRef.current) {
      lineRef.current.style.opacity = '1';
      lineRef.current.style.left = `${pct}%`;
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        onMouseMove={move}
        onMouseLeave={hide}
        className="relative flex-1 rounded-2xl overflow-hidden border-4 border-space-600 bg-white cursor-ew-resize"
      >
        <iframe
          ref={ref}
          title={title}
          srcDoc={srcDoc}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        <div
          ref={wipeRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: 'inset(0 0 0 100%)' }}
        >
          <iframe
            title={`${title} — reference`}
            srcDoc={referenceSrcDoc}
            tabIndex={-1}
            className="w-full h-full"
          />
        </div>

        <div
          ref={lineRef}
          aria-hidden
          className="absolute top-0 h-full w-1 bg-planet-yellow pointer-events-none opacity-0"
          style={{ left: '50%', transition: 'opacity 150ms' }}
        />

        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-space-900/70 text-white font-display text-sm font-bold pointer-events-none">
          {childLabel}
        </span>
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-planet-yellow text-space-900 font-display text-sm font-bold pointer-events-none">
          {referenceLabel}
        </span>
      </div>

      <p className="text-center text-sm font-display text-space-300">{compareHint}</p>
    </div>
  );
});

export default PlayfieldPreview;