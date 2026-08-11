import { getTranslations } from 'next-intl/server';
import type { ServiceSlug } from '@/data/services';
import { getEventTypesForService } from '@/data/relations';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Блок «Підходить для таких подій» для сторінки послуги. Список виводиться
 * фільтром по services[].eventTypes — зворотний звʼязок ніде не дублюється, тож
 * розійтися двом спискам ніяк.
 */
export default async function RelatedEventTypesGrid({ serviceSlug }: { serviceSlug: ServiceSlug }) {
  const related = getEventTypesForService(serviceSlug);
  if (related.length === 0) return null;

  const t = await getTranslations('Catalog');
  const tItems = await getTranslations('EventItems');

  const entries: CatalogEntry[] = related.map((eventType) => ({
    slug: eventType.slug,
    name: tItems(`${eventType.slug}.name`),
    description: tItems(`${eventType.slug}.shortDescription`),
    Icon: eventType.Icon,
  }));

  return (
    <Section bg={c.surfaceAlt}>
      <Eyebrow>{t('relatedEventsEyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('relatedEventsTitle')}</SectionTitle>
      <Lead mb={{ base: 10, md: 12 }}>{t('relatedEventsLead')}</Lead>

      <CatalogGrid kind="event" entries={entries} cta={t('cta')} />
    </Section>
  );
}
