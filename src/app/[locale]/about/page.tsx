import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from '@/components/About/Hero';
import Reach from '@/components/About/Reach';
import Offer from '@/components/About/Offer';
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
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Reach />
      <Offer />
      <ReviewsSection />
      <FinalCta />
    </main>
  );
}
