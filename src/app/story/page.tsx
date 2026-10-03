'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/lib/useProgress';

export default function StoryPage() {
  const { t } = useTranslation();
  const { ready } = useProgress();

  if (!ready) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pt-24">
      <article className="w-full max-w-xl bg-space-800/80 border border-space-600 rounded-3xl p-8 md:p-10 flex flex-col items-center gap-6 text-center">
        <img src="/assets/kid.svg" alt="" className="w-20 h-30" />

        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-planet-yellow">
          {t('story.title')}
        </h1>

        <p className="text-lg md:text-xl text-space-100">{t('story.bookHint')}</p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/welcome"
            className="flex-1 px-6 py-4 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
          >
            {t('story.replayOnboarding')}
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-4 rounded-full bg-space-700 text-white font-display font-extrabold text-lg hover:bg-space-600 transition-colors"
          >
            {t('story.close')}
          </Link>
        </div>
      </article>
    </main>
  );
}