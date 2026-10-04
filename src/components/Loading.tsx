'use client';

import { useTranslation } from 'react-i18next';

export default function Loading() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img src="/assets/rocket.svg" alt="" className="w-10 h-20 animate-bounce" />
        <p className="font-display text-xl text-space-300">{t('common.loading')}</p>
      </div>
    </main>
  );
}