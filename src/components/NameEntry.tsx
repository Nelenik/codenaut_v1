'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setPlayerName } from '@/lib/progress';

export default function NameEntry({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    setPlayerName(trimmed);
    onDone();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-space-800/80 border-2 border-space-600 rounded-3xl p-8 md:p-10 flex flex-col items-center gap-6"
      >
        <img src="/assets/kid.svg" alt="" className="w-28 h-40" />

        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-center text-balance">
          {t('nameEntry.title')}
        </h1>

        <p className="text-lg text-space-200 text-center text-balance">{t('nameEntry.hint')}</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('nameEntry.placeholder')}
          aria-label={t('nameEntry.label')}
          maxLength={20}
          autoFocus
          className="w-full px-6 py-4 rounded-2xl bg-space-900 border-2 border-space-600 focus:border-planet-yellow outline-none text-white font-display text-2xl text-center placeholder:text-space-400/60"
        />

        <button
          type="submit"
          disabled={!trimmed}
          className="w-full px-6 py-4 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-xl hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('nameEntry.start')}
        </button>
      </form>
    </main>
  );
}