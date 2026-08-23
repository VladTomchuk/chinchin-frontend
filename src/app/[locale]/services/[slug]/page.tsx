import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { services } from '@/data/services';
import { isServiceSlug } from '@/data/relations';
import { buildServiceJsonLd, buildServiceMetadata } from '@/lib/seo';
import JsonLd from '@/components/shared/JsonLd';
import ServiceHero from '@/components/catalog/ServiceHero';
import ServiceBody from '@/components/catalog/ServiceBody';
import RelatedEventTypesGrid from '@/components/catalog/RelatedEventTypesGrid';
import OtherServicesGrid from '@/components/catalog/OtherServicesGrid';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  // Слаги з власною версткою пропускаємо: у Next.js статичний сегмент і так
  // перемагає [slug], тож генерувати для них ще й шаблонну сторінку немає сенсу.
  //
  // Дві мови × вісім послуг обслуговує один файл. Шістнадцять майже однакових
  // сторінок довелося б правити шістнадцять разів, і будь-яка правка, зроблена
  // не всюди, тихо розвела б їх між собою.
  return routing.locales.flatMap((locale) =>
    services
      .filter((service) => !service.customPage)
      .map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) return {};

  return buildServiceMetadata(locale as Locale, slug);
}

/**
 * Шаблон сторінки послуги. Текст, фото й перелінковка беруться з даних за
 * активною локаллю, тож структура сторінки в EN і UA однакова, а різниться
 * тільки текст.
 */
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isServiceSlug(slug)) notFound();

  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const jsonLd = await buildServiceJsonLd(locale as Locale, slug);

  return (
    <main>
      <ServiceHero service={service} />
      <ServiceBody slug={slug} />

      {/* Перелінковка з того самого шару даних: типи подій, для яких послуга
          доречна, і сусідні формати барів. Обидва блоки лишаються в поточній
          мові. */}
      <RelatedEventTypesGrid serviceSlug={slug} />
      <OtherServicesGrid currentSlug={slug} />

      {jsonLd && <JsonLd data={jsonLd} />}
    </main>
  );
}
