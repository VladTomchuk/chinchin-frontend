import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { NAVBAR_OFFSET } from '@/components/shared/tokens';

type Props = {
  /** Неймспейс перекладів індексної сторінки. */
  namespace: 'ServicesPage' | 'EventsPage';
};

/** Спільна шапка для обох індексних сторінок — /services і /events. */
export default async function CatalogHero({ namespace }: Props) {
  const t = await getTranslations(`${namespace}.hero`);

  return (
    <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <PageTitle mb={6}>{t('title')}</PageTitle>
      <Lead>{t('lead')}</Lead>
    </Section>
  );
}
