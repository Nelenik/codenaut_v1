'use client';

import { useEffect } from 'react';
import i18n from '@/i18n';
import { getLanguage } from '@/lib/progress';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = getLanguage();
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
    document.documentElement.lang = stored;
  }, []);

  return <>{children}</>;
}
