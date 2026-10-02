'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '@/lib/progress';
import { useProgress } from '@/lib/useProgress';

/**
 * The PRD puts the language switch on every screen and the story reachable
 * from the map. Both live in the layout rather than in each screen, so a new
 * screen cannot forget them.
 */
export default function AppHeader() {
  const { t, i18n } = useTranslation();
  const { progress, refresh } = useProgress();

  const switchLang = (lang: 'en' | 'ru') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    refresh();
  };

  return (
    <div className="fixed top-4 right-4 z-30 flex items-center gap-3">
      <Link
        href="/story"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-space-800/80 hover:bg-space-700 transition-colors border border-space-600 text-white font-display font-semibold"
        aria-label={t('map.bookButton')}
      >
        <BookOpen className="w-5 h-5" />
        <span className="hidden sm:inline">{t('map.bookButton')}</span>
      </Link>

      <div className="flex rounded-full overflow-hidden border border-space-600">
        {(['en', 'ru'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => switchLang(lang)}
            className={`px-3 py-2 font-display font-semibold text-sm transition-colors ${
              progress.lang === lang
                ? 'bg-planet-yellow text-space-900'
                : 'bg-space-800/80 text-space-200 hover:bg-space-700'
            }`}
            aria-pressed={progress.lang === lang}
          >
            {lang === 'en' ? 'EN' : 'RU'}
          </button>
        ))}
      </div>
    </div>
  );
}