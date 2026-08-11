import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { eventTypes } from '@/data/eventTypes';
import { isEventTypeSlug } from '@/data/relations';
import RelatedServicesGrid from '@/components/catalog/RelatedServicesGrid';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { c, NAVBAR_OFFSET } from '@/components/shared/tokens';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  // Див. коментар у services/[slug]/page.tsx.
  return routing.locales.flatMap((locale) =>
    eventTypes
      .filter((eventType) => !eventType.customPage)
      .map((eventType) => ({ locale, slug: eventType.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isEventTypeSlug(slug)) return {};

  const t = await getTranslations({ locale, namespace: 'EventItems' });

  return {
    title: t(`${slug}.metaTitle`),
    description: t(`${slug}.metaDescription`),
  };
}

/**
 * Шаблон сторінки типу події. Дзеркало services/[slug]/page.tsx: шапка з даних
 * плюс блок перелінковки, тільки в інший бік.
 */
export default async function EventTypePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isEventTypeSlug(slug)) notFound();

  const t = await getTranslations('EventItems');
  const tCatalog = await getTranslations('Catalog');
  const tPage = await getTranslations('EventsPage');

  return (
    <main>
      <Section as="header" bg={c.page} pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
        <Eyebrow>{tPage('hero.eyebrow')}</Eyebrow>
        <PageTitle mb={6}>{t(`${slug}.name`)}</PageTitle>
        <Lead>{t(`${slug}.shortDescription`)}</Lead>
      </Section>

      <Section bg={c.page} pt={0} pb={{ base: 10, md: 16 }}>
        <Box
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={c.line}
          rounded="2xl"
          px={{ base: 6, md: 10 }}
          py={{ base: 10, md: 14 }}
        >
          <Text
            fontFamily="var(--font-brand-ui)"
            fontSize="sm"
            lineHeight="1.7"
            color={c.textMuted}
          >
            {tCatalog('contentPlaceholder')}
          </Text>
        </Box>
      </Section>

      <RelatedServicesGrid eventSlug={slug} />
    </main>
  );
}
