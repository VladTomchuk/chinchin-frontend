import { getTranslations } from 'next-intl/server';
import { eventTypes } from '@/data/eventTypes';
import { Section } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Повний перелік типів подій для сторінки /events. Як і в ServicesCatalog,
 * список береться з даних цілком — індексна сторінка має вести на всі
 * підсторінки заради обходу сайту пошуковиком.
 */
export default async function EventTypesCatalog() {
  const t = await getTranslations('Catalog');
  const tItems = await getTranslations('EventItems');

  const entries: CatalogEntry[] = eventTypes.map((eventType) => ({
    slug: eventType.slug,
    name: tItems(`${eventType.slug}.name`),
    description: tItems(`${eventType.slug}.shortDescription`),
    Icon: eventType.Icon,
  }));

  return (
    <Section bg={c.page} pt={0}>
      <CatalogGrid kind="event" entries={entries} cta={t('cta')} />
    </Section>
  );
}
