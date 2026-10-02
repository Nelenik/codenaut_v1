'use client';

type Props = {
  taskText: string;
  introText?: string;
};

export default function TaskZone({ taskText, introText }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-space-800/80 border-2 border-space-600 rounded-2xl p-6">
        <p className="font-display text-2xl md:text-3xl font-extrabold leading-snug text-white text-balance">
          {taskText}
        </p>
      </div>

      {introText ? (
        <div className="bg-space-800/50 border-2 border-dashed border-space-600 rounded-2xl p-5">
          <p className="font-display text-lg font-bold text-planet-yellow mb-2">What is this?</p>
          <p className="text-lg leading-relaxed text-space-100">{introText}</p>
        </div>
      ) : null}
    </div>
  );
}