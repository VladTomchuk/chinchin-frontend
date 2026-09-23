import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SERVICES_CATALOG_HIDDEN } from '@/config/navigation';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { NAVBAR_OFFSET } from '@/components/shared/tokens';
import BackLink from '@/components/shared/BackLink';
import CatalogHero from '@/components/catalog/CatalogHero';
import ServicesCatalog from '@/components/catalog/ServicesCatalog';
import ReviewsSection from '@/components/GoogleReviews/ReviewsSection';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ServicesPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    // SERVICES_CATALOG_HIDDEN (config/navigation.ts) — сторінка тимчасово
    // прибрана, той самий noindex, що lib/seo.ts ставить soon-послугам і
    // about/page.tsx — About: не даємо пошуковику проіндексувати заглушку,
    // навіть якщо посилання десь засвітиться поза sitemap.ts (він її сам уже
    // не перелічує).
    ...(SERVICES_CATALOG_HIDDEN && { robots: { index: false, follow: false } }),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Сторінка тимчасово прибрана з показу — навіть прямий заход за URL не
  // повинен показувати каталог. Той самий підхід, що about/page.tsx: пункт
  // меню лишається видимим, але disabled (config/navigation.ts, DrawerMenu/
  // Footer), адреса прибрана з sitemap.ts, тут — заглушка замість
  // CatalogHero/ServicesCatalog.
  if (SERVICES_CATALOG_HIDDEN) {
    const t = await getTranslations('ServicesPage.hidden');
    const tNav = await getTranslations('Navbar');

    return (
      <main>
        <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <PageTitle mb={6}>{tNav('services')}</PageTitle>
          <Lead mb={8}>{t('message')}</Lead>
          <BackLink href="/" label={t('backLabel')} />
        </Section>
      </main>
    );
  }

  return (
    <main>
      <CatalogHero namespace="ServicesPage" />
      <ServicesCatalog />
      <ReviewsSection />
    </main>
  );
}
