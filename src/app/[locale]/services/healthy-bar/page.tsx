import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from '@/components/HealthyBar/Hero';
import Intro from '@/components/HealthyBar/Intro';
import Offerings from '@/components/HealthyBar/Offerings';
import MenuShowcase from '@/components/HealthyBar/MenuShowcase';
import Formats from '@/components/HealthyBar/Formats';
import Process from '@/components/HealthyBar/Process';
import Faq from '@/components/HealthyBar/Faq';
import FinalCta from '@/components/HealthyBar/FinalCta';
import RelatedEventTypesGrid from '@/components/catalog/RelatedEventTypesGrid';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HealthyBar.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HealthyBarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Intro />
      <Offerings />
      <MenuShowcase />
      <Formats />
      <Process />
      <Faq />
      {/* Перелінковка збирається з даних (src/data), тож нові типи подій
          зʼявляться тут самі — правити цю сторінку для цього не треба. */}
      <RelatedEventTypesGrid serviceSlug="healthy-bar" />
      <FinalCta />
    </main>
  );
}
