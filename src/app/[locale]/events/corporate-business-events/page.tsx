import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from '@/components/CorporateEvents/Hero';
import WhereDelivered from '@/components/CorporateEvents/WhereDelivered';
import Audience from '@/components/CorporateEvents/Audience';
import EventFormats from '@/components/CorporateEvents/EventFormats';
import Included from '@/components/CorporateEvents/Included';
import WhyUs from '@/components/CorporateEvents/WhyUs';
import QuoteSection from '@/components/CorporateEvents/QuoteSection';
import { buildServiceSchema } from '@/components/CorporateEvents/schema';
import RelatedServicesGrid from '@/components/catalog/RelatedServicesGrid';
import OtherEventTypesGrid from '@/components/catalog/OtherEventTypesGrid';

const SLUG = 'corporate-business-events' as const;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Мета-теги живуть там само, де й для шаблонних сторінок, — у EventItems.
  // Один формат на всі типи подій, незалежно від того, чи сторінка власна.
  const t = await getTranslations({ locale, namespace: 'EventItems' });

  return {
    title: t(`${SLUG}.metaTitle`),
    description: t(`${SLUG}.metaDescription`),
  };
}

export default async function CorporateEventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tItems = await getTranslations('EventItems');
  const tFormats = await getTranslations('CorporateEvents.formats');
  const formats = (tFormats.raw('items') as { name: string }[]).map((item) => item.name);

  const schema = buildServiceSchema({
    name: tItems(`${SLUG}.metaTitle`),
    description: tItems(`${SLUG}.metaDescription`),
    url: `/${locale}/events/${SLUG}`,
    formats,
  });

  return (
    <main>
      <Hero />
      <WhereDelivered />
      <Audience />
      <EventFormats />
      <Included />
      <WhyUs />
      <QuoteSection />

      {/* Перелінковка зі спільного шару даних: послуги для цього типу події
          та решта типів подій. */}
      <RelatedServicesGrid eventSlug={SLUG} />
      <OtherEventTypesGrid currentSlug={SLUG} />

      {/* Екрануємо `<`, щоб жоден рядок із перекладів не міг закрити тег script. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
