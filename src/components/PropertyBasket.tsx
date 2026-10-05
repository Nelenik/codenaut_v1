'use client';

import type { BasketItem } from '@/lib/taskLoader';

/** A chip keeps the spot it was dealt to, taken from its place in the task's
 *  basket, so removing one does not shuffle the rest under the child's cursor. */
type PileItem = BasketItem & { pile: number };

type Props = {
  /** Basket entries the child has not taken yet — the ones still to drag. */
  available: PileItem[];
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
 * more, so it has to be picked from here. Each chip holds a whole command —
 * property and value — because at this stage the only question left is *which*
 * property does this job. Picking the right chip is the task.
 *
 * The chips are dealt out scattered rather than lined up in a row: each one is
 * nudged off the grid and tilted a little, the way cards land on a table. The
 * offsets are a fixed table rather than random, so a chip never moves between
 * renders and can always be aimed at, and each keeps the spot it was dealt to —
 * its index in the task's basket — so taking one out does not shuffle the rest
 * under the child's cursor.
 *
 * The scatter is margins and a rotation inside an ordinary wrapping flex row:
 * the browser does the layout, so two chips can never end up covering each
 * other at any window width, and the panel is exactly as tall as it needs.
 */
/**
 * Offsets are never negative. A negative margin would pull a chip into the row
 * above it, and the wrapping flex row would not grow to make room: the layout
 * boxes stop overlapping but the cards do. The row also carries a little
 * horizontal padding and a proper row gap, because a card rotated by a couple of
 * degrees is a little wider and taller than the box it is laid out in.
 */
const SCATTER = [
  { dx: 0, dy: 0, rotate: -2.5 },
  { dx: 14, dy: 8, rotate: 1.5 },
  { dx: 4, dy: 12, rotate: -1 },
  { dx: 20, dy: 3, rotate: 2 },
  { dx: 8, dy: 14, rotate: -3.5 },
  { dx: 16, dy: 5, rotate: 1 },
];

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
      <p className="font-display font-bold text-planet-yellow text-base">{label}</p>

      {available.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 py-2 px-2">
          {available.map((item) => {
            const spot = SCATTER[item.pile % SCATTER.length];
            return (
              <span
                key={item.property}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', `${item.property}: ${item.value}`);
                  event.dataTransfer.effectAllowed = 'copy';
                }}
                style={{
                  marginLeft: `${spot.dx}px`,
                  marginTop: `${spot.dy}px`,
                  transform: `rotate(${spot.rotate}deg)`,
                }}
                className="cursor-grab select-none inline-flex items-center h-10 whitespace-nowrap rounded-xl border-2 border-space-600 bg-space-700 px-2.5 font-mono text-base font-bold text-planet-lime shadow-md shadow-space-900/60 transition-transform hover:z-20 hover:-translate-y-0.5 hover:rotate-0 hover:scale-105 active:cursor-grabbing"
              >
                <span className="text-planet-cyan">{item.property}</span>
                <span className="text-space-300">: </span>
                {item.value}
              </span>
            );
          })}
        </div>
      ) : null}

      {inserted.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="font-display text-base text-space-300">{placedLabel}</p>
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

      {hint ? <p className="font-display text-base text-space-300">{hint}</p> : null}
    </div>
  );
}
