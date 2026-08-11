import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import CatalogHero from '@/components/catalog/CatalogHero';
import ServicesCatalog from '@/components/catalog/ServicesCatalog';

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
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CatalogHero namespace="ServicesPage" />
      <ServicesCatalog />
    </main>
  );
}
