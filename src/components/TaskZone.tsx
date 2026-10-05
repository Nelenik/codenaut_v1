'use client';

type Props = {
  taskText: string;
  teachTitle?: string;
  teachBody?: string;
  example?: string;
  narratorLabel: string;
};

export default function TaskZone({ taskText, teachTitle, teachBody, example, narratorLabel }: Props) {
  return (
    <section className="rounded-2xl bg-space-800/70 border-2 border-space-600 p-4 md:p-5 flex gap-4 md:gap-6 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <img src="/assets/kid.svg" alt="" className="w-16 h-24 md:w-20 md:h-30" />
        <span className="text-base font-display font-bold text-space-300 text-center leading-tight max-w-20">
          {narratorLabel}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <p className="font-display text-xl md:text-2xl font-extrabold leading-snug text-white text-balance">
          {taskText}
        </p>

        {teachBody ? (
          <div className="bg-space-900/60 border-2 border-dashed border-planet-yellow/50 rounded-xl p-3 md:p-4">
            {teachTitle ? (
              <p className="font-display text-base md:text-lg font-bold text-planet-yellow mb-1">
                {teachTitle}
              </p>
            ) : null}
            <p className="text-base md:text-lg leading-relaxed text-space-100">{teachBody}</p>
            {example ? (
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