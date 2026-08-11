import { getTranslations } from 'next-intl/server';
import { eventTypes, type EventTypeSlug } from '@/data/eventTypes';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Решта типів подій — перелінковка між сторінками подій. Поточну виключаємо,
 * щоб сторінка не посилалась сама на себе.
 */
export default async function OtherEventTypesGrid({ currentSlug }: { currentSlug: EventTypeSlug }) {
  const others = eventTypes.filter((eventType) => eventType.slug !== currentSlug);
  if (others.length === 0) return null;

  const t = await getTranslations('Catalog');
  const tItems = await getTranslations('EventItems');

  const entries: CatalogEntry[] = others.map((eventType) => ({
    slug: eventType.slug,
    name: tItems(`${eventType.slug}.name`),
    description: tItems(`${eventType.slug}.shortDescription`),
    Icon: eventType.Icon,
  }));

  return (
    <Section bg={c.page}>
      <Eyebrow>{t('otherEventsEyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }}>{t('otherEventsTitle')}</SectionTitle>

      <CatalogGrid kind="event" entries={entries} cta={t('cta')} />
    </Section>
  );
}
