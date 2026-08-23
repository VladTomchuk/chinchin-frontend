import { getTranslations } from 'next-intl/server';
import { services } from '@/data/services';
import { Section } from '@/components/shared/primitives';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Повний перелік послуг для сторінки /services. Індексна сторінка мусить
 * посилатися на всі підсторінки — інакше пошуковик до них не дійде, — тому
 * список береться з даних цілком і нічим не фільтрується.
 */
export default async function ServicesCatalog() {
  const t = await getTranslations('Catalog');
  const tItems = await getTranslations('ServiceItems');

  const entries: CatalogEntry[] = services.map((service) => ({
    slug: service.slug,
    name: tItems(`${service.slug}.name`),
    description: tItems(`${service.slug}.shortDescription`),
    Icon: service.Icon,
  }));

  return (
    <Section pt={0}>
      <CatalogGrid kind="service" entries={entries} cta={t('cta')} />
    </Section>
  );
}
