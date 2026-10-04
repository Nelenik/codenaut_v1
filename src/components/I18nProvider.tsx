'use client';

import { useEffect, useState } from 'react';
import i18n from '@/i18n';
import { getLanguage } from '@/lib/progress';

/**
 * Nothing is rendered until the stored language has been read and applied.
 *
 * `localStorage` cannot be read while the server renders, so the server always
 * sends English HTML. A returning Russian player would watch that English paint
 * before anything could correct it — on a game for a 7-year-old, the first thing
 * they see is the wrong language. Applying the language during SSR is not an
 * option either: the client would then render a different language from the one
 * the server sent, which is a hydration mismatch.
 *
 * So the first paint carries no text at all, and the real screen appears already
 * in the right language. The gate is language-free markup on purpose: it has to
 * be byte-identical on the server and on the client.
 */
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getLanguage();
    document.documentElement.lang = stored;
    if (stored !== i18n.language) i18n.changeLanguage(stored);
    setReady(true);

    // The switch writes `<html lang>` too, so a screen reader is told which
    // language the text on screen is actually in.
    const onLanguageChanged = (next: string) => {
      document.documentElement.lang = next;
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <img src="/assets/rocket.svg" alt="" className="w-10 h-20 animate-bounce" />
      </main>
    );
  }

  return <>{children}</>;
}
