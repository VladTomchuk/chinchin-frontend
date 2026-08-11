import { CONTACT_EMAIL } from '@/components/HealthyBar/tokens';

type Args = {
  name: string;
  description: string;
  url: string;
  /** Назви форматів із перекладів — стають переліком послуг у каталозі. */
  formats: string[];
};

/**
 * Розмітка schema.org для сторінки. Service з areaServed = увесь світ і
 * провайдером із адресою в Барселоні: компанія базується тут, але працює
 * по світу, і саме це має зчитати пошуковик.
 */
export function buildServiceSchema({ name, description, url, formats }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    serviceType: 'Corporate and MICE event bar service',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'ChinChin Bar Catering',
      email: CONTACT_EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Barcelona',
        addressCountry: 'ES',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name,
      itemListElement: formats.map((format) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: format },
      })),
    },
  };
}
