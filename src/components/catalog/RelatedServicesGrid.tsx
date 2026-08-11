import { getTranslations } from 'next-intl/server';
import type { EventTypeSlug } from '@/data/eventTypes';
import { getServicesForEvent } from '@/data/relations';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Блок «Рекомендовані послуги» для сторінки типу події. Склад визначається
 * даними: щойно нова послуга додасть цей слаг у свій eventTypes, вона зʼявиться
 * тут сама, без правок сторінки.
 */
export default async function RelatedServicesGrid({ eventSlug }: { eventSlug: EventTypeSlug }) {
  const related = getServicesForEvent(eventSlug);
  if (related.length === 0) return null;

  const t = await getTranslations('Catalog');
  const tItems = await getTranslations('ServiceItems');

  const entries: CatalogEntry[] = related.map((service) => ({
    slug: service.slug,
    name: tItems(`${service.slug}.name`),
    description: tItems(`${service.slug}.shortDescription`),
    Icon: service.Icon,
  }));

  return (
    <Section bg={c.surfaceAlt}>
      <Eyebrow>{t('relatedServicesEyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('relatedServicesTitle')}</SectionTitle>
      <Lead mb={{ base: 10, md: 12 }}>{t('relatedServicesLead')}</Lead>

      <CatalogGrid kind="service" entries={entries} cta={t('cta')} />
    </Section>
  );
}
