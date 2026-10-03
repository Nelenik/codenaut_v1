'use client';

type Props = {
  properties: string[];
  label: string;
  hint?: string;
};

/**
 * The third stage of scaffolding: the property is not written for the child any
 * more, so it has to be picked from here. Each name is a drag source carrying
 * only the property name — the value is always typed, which is the whole point
 * of the stage.
 *
 * Names are jumbled and include properties that are already learned, so the
 * child has to read the task rather than guess from position.
 */
export default function PropertyBasket({ properties, label, hint }: Props) {
  if (properties.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-space-800/70 border-2 border-space-600 p-3">
      <p className="font-display font-bold text-planet-yellow text-sm">{label}</p>

      <div className="flex flex-wrap gap-2">
        {properties.map((property) => (
          <span
            key={property}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', property);
              event.dataTransfer.effectAllowed = 'copy';
            }}
            className="cursor-grab select-none px-3 py-2 rounded-xl border-2 border-space-600 bg-space-700 font-mono text-lg font-bold text-planet-lime active:cursor-grabbing"
          >
            {property}
          </span>
        ))}
      </div>

      {hint ? <p className="font-display text-xs text-space-300">{hint}</p> : null}
    </div>
  );
}