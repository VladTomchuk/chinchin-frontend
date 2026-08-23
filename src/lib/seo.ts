import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { services, type ServiceSlug } from '@/data/services';
import { absoluteUrl, BCP47_LOCALE, OG_LOCALE, ORGANIZATION, SITE_URL } from '@/config/site';

/**
 * SEO-шар для сторінок послуг: canonical, hreflang, Open Graph, Twitter і
 * JSON-LD збираються тут в одному місці й з того самого джерела даних, що й
 * сторінки (data/services.ts + messages/ServiceItems). Сторінка з власною
 * версткою (healthy-bar) і шаблонна [slug] викликають ці ж функції, тож
 * розмітка на них не може розійтися.
 */

/** Шлях сторінки послуги від кореня сайту, з префіксом локалі. */
export function servicePathname(locale: Locale, slug: ServiceSlug): string {
  return `/${locale}/services/${slug}`;
}

/**
 * hreflang для пари EN/UA. Ключ — код мови (не локалі в URL): у проєкті шлях
 * лишається /ua, але тег мусить бути 'uk', інакше Google просто не впізнає
 * значення й вважатиме сторінки дублікатами замість перекладів.
 *
 * x-default веде на англійську: це та версія, яку middleware віддає всім, чий
 * Accept-Language не українська.
 */
function languageAlternates(pathFor: (locale: Locale) => string) {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[BCP47_LOCALE[locale]] = absoluteUrl(pathFor(locale));
  }
  languages['x-default'] = absoluteUrl(pathFor(routing.defaultLocale));

  return languages;
}

export function serviceLanguageAlternates(slug: ServiceSlug) {
  return languageAlternates((locale) => servicePathname(locale, slug));
}

/**
 * Метадані сторінки послуги. Заголовок і опис — рівно ті, що в перекладах:
 * у кожної з восьми послуг вони свої й свої в кожній мові, тож двох однакових
 * title чи description у видачі не буде.
 */
export async function buildServiceMetadata(locale: Locale, slug: ServiceSlug): Promise<Metadata> {
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: `ServiceItems.${slug}` });

  const title = t('metaTitle');
  const description = t('metaDescription');
  const shortDescription = t('shortDescription');
  const url = absoluteUrl(servicePathname(locale, slug));
  const image = {
    url: absoluteUrl(service.heroImage),
    alt: t('heroImageAlt'),
  };

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: serviceLanguageAlternates(slug),
    },
    openGraph: {
      title,
      // В OG опис коротший за meta description — його читають у стрічці, а не
      // у видачі.
      description: shortDescription,
      url,
      siteName: ORGANIZATION.name,
      images: [image],
      type: 'website',
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shortDescription,
      images: [image],
    },
  };
}

/**
 * Розмітка schema.org для послуги. areaServed — Барселона плюс увесь світ:
 * команда базується тут, але виїжджає на події за кордон, і пошуковик має
 * зчитати обидва сигнали, а не лише місто.
 */
export async function buildServiceJsonLd(locale: Locale, slug: ServiceSlug) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;

  const t = await getTranslations({ locale, namespace: `ServiceItems.${slug}` });

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('name'),
    serviceType: 'Mobile Bar Catering',
    description: t('shortDescription'),
    url: absoluteUrl(servicePathname(locale, slug)),
    image: absoluteUrl(service.heroImage),
    inLanguage: BCP47_LOCALE[locale],
    areaServed: [
      { '@type': 'City', name: 'Barcelona' },
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
    ],
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: SITE_URL,
      logo: absoluteUrl(ORGANIZATION.logo),
      email: ORGANIZATION.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: ORGANIZATION.addressLocality,
        addressCountry: ORGANIZATION.addressCountry,
      },
    },
  };
}
