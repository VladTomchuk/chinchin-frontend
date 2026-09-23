import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Provider } from '@/components/ui/provider';
import './globals.css';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/navbar/page';
import Footer from '@/components/footer/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import TopLoader from '@/components/shared/TopLoader';
import LoadingCursor from '@/components/shared/LoadingCursor';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { brandFont, headingFont, monotonFont, uiFont } from '@/fonts/fonts';
import { SITE_URL } from '@/config/site';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  // Від цієї адреси Next.js рахує абсолютні URL для canonical, hreflang і
  // Open Graph. Без неї відносні шляхи в метаданих лишаються відносними, а
  // соцмережі й пошуковик такі посилання не резолвлять.
  metadataBase: new URL(SITE_URL),
  title: 'Cocktail bar catering BCN',
  description: '...',
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

  // Код локалі в проєкті — 'ua' (усталений в URL і messages/ua.json), але це
  // код країни, не мови: валідний BCP-47 lang для української — 'uk'. Без
  // цієї підміни атрибут lang був відсутній узагалі (html.lang="ua" Next.js
  // не проставляє сам), що ламало screen-readers і підказку мови для пошуковика.
  const htmlLang = locale === 'ua' ? 'uk' : locale;

  return (
    <html
      lang={htmlLang}
      className={`${brandFont.variable} ${uiFont.variable} ${monotonFont.variable} ${headingFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Climate Crisis (заголовок хіро для укр локалі, IntroBanner.tsx) —
            напряму з Google Fonts, а не через next/font: у файлу, самохостнутого
            через next/font/local, вийшов не той нарис. Пінуємо вісь YEAR на
            1979 — той самий інстанс, що й дефолт на сторінці шрифту в Google
            Fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Climate+Crisis:YEAR@1979&display=swap"
          rel="stylesheet"
        />
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Provider>
              <TopLoader />
              <LoadingCursor />
              <SmoothScroll />
              <Navbar />
              {children}
              <Footer />
              <WhatsAppButton />
            </Provider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
