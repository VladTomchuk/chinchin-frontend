import { getTranslations } from 'next-intl/server';
import type { ServiceSlug } from '@/data/services';
import { SERVICES_CATALOG_HIDDEN } from '@/config/navigation';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { NAVBAR_OFFSET } from '@/components/shared/tokens';
import BackLink from '@/components/shared/BackLink';
import QuoteFormSection from '@/components/shared/QuoteForm/QuoteFormSection';

/**
 * Показується замість повної сторінки послуги, коли Service.status === 'soon'
 * (data/services.ts) — і в шаблонній [slug]/page.tsx, і в healthy-bar/page.tsx
 * з власною версткою. У кількох послуг ServiceBody.body усе ще містить
 * [COPY PENDING …] (тексти пишуться в окремому Google Doc, ще не перенесені),
 * тож пряме звернення за URL не повинно показувати тіло сторінки взагалі —
 * рендериться тільки назва й короткий опис (готові поля ServiceItems.{slug}),
 * без ServiceBody/JsonLd.
 *
 * Форма запиту кошторису лишається: QuoteForm і так пропонує ще не запущені
 * послуги в списку (data/services.ts, serviceSlugs), тож відвідувач, який
 * знайшов пряме посилання, може лишити заявку, а не впертися в глухий кут.
 */
export default async function ServiceComingSoon({ slug }: { slug: ServiceSlug }) {
  const t = await getTranslations('ServiceComingSoon');
  const tItems = await getTranslations(`ServiceItems.${slug}`);
  const tCatalog = await getTranslations('Catalog');

  return (
    <>
      <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <PageTitle mb={6}>{tItems('name')}</PageTitle>
        <Lead mb={4}>{tItems('shortDescription')}</Lead>
        <Lead mb={8}>{t('message')}</Lead>
        <BackLink
          href="/services"
          label={t('backLabel')}
          disabled={SERVICES_CATALOG_HIDDEN}
          soonLabel={tCatalog('soon')}
        />
      </Section>

      <QuoteFormSection title={t('quoteTitle')} text={t('quoteText')} defaultService={slug} />
    </>
  );
}
