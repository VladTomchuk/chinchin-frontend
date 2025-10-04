import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Provider } from '@/components/ui/provider';
import './globals.css';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/navbar/page';
import { brandFont } from '@/fonts/fonts';
import FaviconSwitcher from '@/components/FaviconSwitcher';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Cocktail bar catering BCN',
  description: '...',
  // icons: {
  //   icon: '/darkLogo.png',
  // },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html className={brandFont.variable} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme // ← дозволяє браузеру підлаштовувати нативні елементи
          >
            <FaviconSwitcher />
            <Provider>
              <Navbar />
              {children}
            </Provider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
