'use client';

import type { BasketItem } from '@/lib/taskLoader';

type Props = {
  /** Basket entries the child has not written yet — the ones still to drag. */
  available: BasketItem[];
  /** Property names already in the editor, each with a way to take it back out. */
  inserted: string[];
  onRemove: (property: string) => void;
  label: string;
  placedLabel: string;
  removeLabel: string;
  hint: string;
};

/**
 * The third stage of scaffolding: the property is not written for the child any
 * more, so it has to be picked from here. Each chip carries the whole command —
 * property and value — because at this stage the only question left is *which*
 * property does this job. Picking the right chip is the task.
 *
 * A chip leaves the basket when it is dragged out and comes back when it is
 * taken out of the editor, so what is on screen is always what is left to do.
 */
export default function PropertyBasket({
  available,
  inserted,
  onRemove,
  label,
  placedLabel,
  removeLabel,
  hint,
}: Props) {
  if (available.length === 0 && inserted.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-space-800/70 border-2 border-space-600 p-3">
      <p className="font-display font-bold text-planet-yellow text-sm">{label}</p>

      {available.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {available.map((item) => (
            <span
              key={item.property}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', `${item.property}: ${item.value}`);
                event.dataTransfer.effectAllowed = 'copy';
              }}
              className="cursor-grab select-none px-3 py-2 rounded-xl border-2 border-space-600 bg-space-700 font-mono text-lg font-bold text-planet-lime active:cursor-grabbing"
            >
              {item.property}
            </span>
          ))}
        </div>
      ) : null}

      {inserted.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="font-display text-xs text-space-300">{placedLabel}</p>
          <div className="flex flex-wrap gap-2">
            {inserted.map((property) => (
              <span
                key={property}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl border-2 border-dashed border-space-600 bg-space-900 font-mono text-base font-bold text-space-300"
              >
                {property}
                <button
                  type="button"
                  onClick={() => onRemove(property)}
                  title={removeLabel}
                  aria-label={`${removeLabel}: ${property}`}
                  className="w-6 h-6 rounded-full bg-space-700 text-planet-yellow font-display font-extrabold leading-none hover:bg-space-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {hint ? <p className="font-display text-xs text-space-300">{hint}</p> : null}
    </div>
  );
}