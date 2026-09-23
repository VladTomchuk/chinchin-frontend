import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { services } from '@/data/services';
import { buildServiceJsonLd, buildServiceMetadata } from '@/lib/seo';
import JsonLd from '@/components/shared/JsonLd';
import Hero from '@/components/HealthyBar/Hero';
import Intro from '@/components/HealthyBar/Intro';
import Offerings from '@/components/HealthyBar/Offerings';
import MenuShowcase from '@/components/HealthyBar/MenuShowcase';
import Formats from '@/components/HealthyBar/Formats';
import Process from '@/components/HealthyBar/Process';
import Faq from '@/components/HealthyBar/Faq';
import FinalCta from '@/components/HealthyBar/FinalCta';
import RelatedEventTypesGrid from '@/components/catalog/RelatedEventTypesGrid';
import OtherServicesGrid from '@/components/catalog/OtherServicesGrid';
import ServiceComingSoon from '@/components/catalog/ServiceComingSoon';
import ReviewsSection from '@/components/GoogleReviews/ReviewsSection';

const SLUG = 'healthy-bar' as const;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Мета-теги збирає та сама функція, що й для шаблонних сторінок, із тих самих
 * ключів ServiceItems.{slug} — власна верстка не привід тримати для сторінки
 * окремий набір canonical/hreflang/OG, який згодом розійдеться з рештою.
 * Тексти для healthy-bar дублювались у HealthyBar.meta; лишається одна копія.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildServiceMetadata(locale as Locale, SLUG);
}

export default async function HealthyBarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Сторінка повністю зверстана й текст у ній готовий (на відміну від решти
  // soon-послуг, де в ServiceBody ще стоїть [COPY PENDING), але
  // status: 'soon' у data/services.ts означає одне й те саме для всіх послуг
  // — не готова до запуску, — тож пряме звернення за URL блокується так само.
  const service = services.find((item) => item.slug === SLUG);
  if (service?.status === 'soon') {
    return (
      <main>
        <ServiceComingSoon slug={SLUG} />
      </main>
    );
  }

  const jsonLd = await buildServiceJsonLd(locale as Locale, SLUG);

  return (
    <main>
      <Hero />
      <Intro />
      <Offerings />
      <MenuShowcase />
      <Formats />
      <Process />
      <Faq />
      {/* Перелінковка збирається з даних (src/data), тож нові типи подій і нові
          послуги зʼявляться тут самі — правити цю сторінку для цього не треба. */}
      <RelatedEventTypesGrid serviceSlug={SLUG} />
      <OtherServicesGrid currentSlug={SLUG} />
      <ReviewsSection />
      <FinalCta />

      {jsonLd && <JsonLd data={jsonLd} />}
    </main>
  );
}
