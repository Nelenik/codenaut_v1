'use client';

import { forwardRef } from 'react';

type Props = {
  srcDoc: string;
  referenceSrcDoc: string;
  title: string;
};

const PlayfieldPreview = forwardRef<HTMLIFrameElement, Props>(function PlayfieldPreview(
  { srcDoc, referenceSrcDoc, title },
  ref
) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-space-600 bg-white">
      <iframe
        ref={ref}
        title={title}
        srcDoc={srcDoc}
        className="absolute inset-0 w-full h-full"
      />

      <iframe
        title={`${title} — reference`}
        srcDoc={referenceSrcDoc}
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />
    </div>
  );
});

export default PlayfieldPreview;