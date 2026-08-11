import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { services } from '@/data/services';
import { isServiceSlug } from '@/data/relations';
import RelatedEventTypesGrid from '@/components/catalog/RelatedEventTypesGrid';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { c, NAVBAR_OFFSET } from '@/components/shared/tokens';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  // Слаги з власною версткою пропускаємо: у Next.js статичний сегмент і так
  // перемагає [slug], тож генерувати для них ще й шаблонну сторінку немає сенсу.
  return routing.locales.flatMap((locale) =>
    services.filter((service) => !service.customPage).map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) return {};

  const t = await getTranslations({ locale, namespace: 'ServiceItems' });

  return {
    title: t(`${slug}.metaTitle`),
    description: t(`${slug}.metaDescription`),
  };
}

/**
 * Шаблон сторінки послуги. Поки що це каркас: шапка з даних + блок перелінковки.
 * Реальні секції додаються сюди або, якщо сторінці потрібна власна верстка, —
 * окремою текою services/{slug}/ із customPage: true в даних.
 */
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isServiceSlug(slug)) notFound();

  const t = await getTranslations('ServiceItems');
  const tCatalog = await getTranslations('Catalog');
  const tPage = await getTranslations('ServicesPage');

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

      <RelatedEventTypesGrid serviceSlug={slug} />
    </main>
  );
}
