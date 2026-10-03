'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/lib/useProgress';

export default function StoryPage() {
  const { t } = useTranslation();
  const { progress, ready } = useProgress();

  if (!ready) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pt-24">
      <article className="w-full max-w-2xl bg-space-800/80 border border-space-600 rounded-3xl p-8 md:p-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-planet-yellow mb-2">
          {t('story.title')}
        </h1>
        {progress.playerName ? (
          <p className="font-display text-xl md:text-2xl font-bold text-planet-lime mb-5">
            {t('story.greeting', { name: progress.playerName })}
          </p>
        ) : null}

        <p className="text-lg md:text-xl leading-relaxed text-space-100 mb-6 whitespace-pre-line">
          {t('story.text')}
        </p>

        <Link
          href="/welcome"
          className="inline-block mb-8 px-6 py-3 rounded-full bg-space-700 text-white font-display font-extrabold text-lg hover:bg-space-600 transition-colors"
        >
          {t('story.replayOnboarding')}
        </Link>

        <div>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
          >
            {t('story.close')}
          </Link>
        </div>
      </article>
    </main>
  );
}