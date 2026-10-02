'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { defaultProgress, loadProgress, type Progress } from '@/lib/progress';

export default function StoryPage() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pt-24">
      <article className="w-full max-w-2xl bg-space-800/80 border border-space-600 rounded-3xl p-8 md:p-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-planet-yellow mb-6">
          {t('story.title')}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-space-100 mb-8">
          {t('story.text', { name: progress.playerName })}
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
        >
          {t('story.close')}
        </Link>
      </article>
    </main>
  );
}
