import { getTranslations } from 'next-intl/server';
import type { ServiceSlug } from '@/data/services';
import { getRelatedServices } from '@/data/relations';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import CatalogGrid, { type CatalogEntry } from './CatalogGrid';

/**
 * Перелінковка між сторінками послуг — 2-3 сусідні формати внизу сторінки.
 * Дзеркало OtherEventTypesGrid для іншого розділу: та сама сітка карток
 * (CatalogGrid), тільки склад бере getRelatedServices.
 *
 * Посилання будує типізований Link із next-intl усередині CatalogGrid, тож вони
 * завжди лишаються в поточній локалі: з англійської сторінки ведуть на
 * англійські, з української — на українські. Перекидати відвідувача між мовами
 * посеред каталогу не можна.
 */
export default async function OtherServicesGrid({ currentSlug }: { currentSlug: ServiceSlug }) {
  const related = getRelatedServices(currentSlug);
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
    <Section>
      <Eyebrow>{t('otherServicesEyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }}>{t('otherServicesTitle')}</SectionTitle>

      <CatalogGrid kind="service" entries={entries} cta={t('cta')} />
    </Section>
  );
}
