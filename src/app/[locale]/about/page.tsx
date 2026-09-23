import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ABOUT_HIDDEN } from '@/config/navigation';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { NAVBAR_OFFSET } from '@/components/shared/tokens';
import BackLink from '@/components/shared/BackLink';
import Hero from '@/components/About/Hero';
import Reach from '@/components/About/Reach';
import Offer from '@/components/About/Offer';
import Process from '@/components/About/Process';
import FinalCta from '@/components/About/FinalCta';
import ReviewsSection from '@/components/GoogleReviews/ReviewsSection';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About.meta' });

  return {
    title: t('title'),
    description: t('description'),
    // ABOUT_HIDDEN (config/navigation.ts) — сторінка тимчасово прибрана, той
    // самий noindex, що lib/seo.ts ставить soon-послугам: не даємо пошуковику
    // проіндексувати заглушку, навіть якщо посилання десь засвітиться поза
    // sitemap.ts (він її сам уже не перелічує).
    ...(ABOUT_HIDDEN && { robots: { index: false, follow: false } }),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Сторінка тимчасово прибрана з показу — навіть прямий заход за URL не
  // повинен показувати вміст. Той самий підхід, що ComingSoon для soon-послуг
  // (ServiceComingSoon.tsx): пункт меню знято в config/navigation.ts, адреса
  // прибрана з sitemap.ts, тут — заглушка замість Hero/Reach/Offer/….
  if (ABOUT_HIDDEN) {
    const t = await getTranslations('About.hidden');
    const tNav = await getTranslations('Navbar');

    return (
      <main>
        <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <PageTitle mb={6}>{tNav('about')}</PageTitle>
          <Lead mb={8}>{t('message')}</Lead>
          <BackLink href="/" label={t('backLabel')} />
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Hero />
      <Reach />
      <Offer />
      <Process />
      <ReviewsSection />
      <FinalCta />
    </main>
  );
}
