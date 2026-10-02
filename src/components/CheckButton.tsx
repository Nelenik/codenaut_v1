'use client';

type Props = {
  onCheck: () => void;
  label: string;
};

export default function CheckButton({ onCheck, label }: Props) {
  return (
    <button
      onClick={onCheck}
      className="w-full px-6 py-4 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-2xl hover:bg-yellow-300 active:scale-95 transition-all"
    >
      {label}
    </button>
  );
}