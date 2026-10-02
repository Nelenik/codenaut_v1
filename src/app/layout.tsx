import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import AppHeader from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Round Ball — Learn CSS',
  description: 'A CSS practice game for children aged 7-9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen space-bg font-body">
        <I18nProvider>
          <AppHeader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}