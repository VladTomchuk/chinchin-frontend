import { Box, Flex, Heading } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuArrowRight } from 'react-icons/lu';
import { services } from '@/data/services';
import { eventTypes } from '@/data/eventTypes';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import { Link } from '@/i18n/navigation';
import CatalogGrid, { type CatalogEntry } from '@/components/catalog/CatalogGrid';

/**
 * Компактний зріз каталогу для сторінки About: по одній сітці карток на
 * послуги й типи подій, кожна з посиланням «дивитись усі». Повні переліки
 * лишаються на /services і /events — тут головне показати, що вибір є, а не
 * дублювати ті сторінки цілком.
 */
export default async function Offer() {
  const t = await getTranslations('About.offer');
  const tCatalog = await getTranslations('Catalog');
  const tServices = await getTranslations('ServiceItems');
  const tEvents = await getTranslations('EventItems');

  const serviceEntries: CatalogEntry[] = services.map((service) => ({
    slug: service.slug,
    name: tServices(`${service.slug}.name`),
    description: tServices(`${service.slug}.shortDescription`),
    Icon: service.Icon,
  }));

  const eventEntries: CatalogEntry[] = eventTypes.map((eventType) => ({
    slug: eventType.slug,
    name: tEvents(`${eventType.slug}.name`),
    description: tEvents(`${eventType.slug}.shortDescription`),
    Icon: eventType.Icon,
  }));

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('title')}</SectionTitle>
      <Lead mb={{ base: 10, md: 14 }}>{t('lead')}</Lead>

      <Box mb={{ base: 12, md: 16 }}>
        <Heading
          as="h3"
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.08em"
          color={c.textMuted}
          mb={5}
        >
          {t('servicesLabel')}
        </Heading>
        <CatalogGrid kind="service" entries={serviceEntries} cta={tCatalog('cta')} />
        <Link href="/services">
          <Flex
            align="center"
            gap={2}
            mt={6}
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="sm"
            color={c.accent}
          >
            {t('servicesCta')}
            <LuArrowRight size={16} aria-hidden />
          </Flex>
        </Link>
      </Box>

      <Box>
        <Heading
          as="h3"
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.08em"
          color={c.textMuted}
          mb={5}
        >
          {t('eventsLabel')}
        </Heading>
        <CatalogGrid kind="event" entries={eventEntries} cta={tCatalog('cta')} />
        <Link href="/events">
          <Flex
            align="center"
            gap={2}
            mt={6}
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="sm"
            color={c.accent}
          >
            {t('eventsCta')}
            <LuArrowRight size={16} aria-hidden />
          </Flex>
        </Link>
      </Box>
    </Section>
  );
}
