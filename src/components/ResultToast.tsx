'use client';

type Kind = 'hint' | 'praise' | 'empty';

type Props = {
  kind: Kind;
  title: string;
  text: string;
  onDismiss: () => void;
};

/**
 * A wrong check must never feel like a scolding. This floats over the page in
 * warm amber rather than red, stays until the child acts again (a hint they
 * cannot finish reading is not a hint), and does not block the editor.
 */
export default function ResultToast({ kind, title, text, onDismiss }: Props) {
  const accent = kind === 'praise' ? 'border-planet-yellow' : 'border-planet-orange/70';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,40rem)] rounded-3xl border-4 ${accent} bg-space-800/95 shadow-2xl px-5 py-4 md:px-7 md:py-5 flex gap-4 items-start`}
    >
      <img src="/assets/kid.svg" alt="" className="w-10 h-16 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-display text-lg md:text-xl font-extrabold text-planet-yellow mb-1">
          {title}
        </p>
        <p className="text-lg md:text-xl text-space-50 leading-relaxed">{text}</p>
      </div>

      <button
        onClick={onDismiss}
        aria-label="close"
        className="p-2 rounded-full text-space-300 hover:text-white hover:bg-space-700 transition-colors text-xl leading-none shrink-0"
      >
        ✕
      </button>
    </div>
  );
}