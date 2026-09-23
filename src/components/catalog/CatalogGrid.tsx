import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { c } from '@/components/shared/tokens';
import styles from './CatalogGrid.module.css';

export type CatalogEntry = {
  slug: string;
  name: string;
  description: string;
  Icon: IconType;
  /**
   * true — послуга ще не готова (Service.status === 'soon' у
   * data/services.ts). Типи подій (kind: 'event') цього поля не передають —
   * концепції "soon" для них немає.
   */
  isSoon?: boolean;
};

type Props = {
  /** Визначає, на який маршрут ведуть картки. */
  kind: 'service' | 'event';
  entries: CatalogEntry[];
  /** Мітка дії внизу картки. Описову назву посилання дає aria-label. */
  cta: string;
  /** Мітка позначки "soon". Потрібна, лише якщо серед entries є isSoon. */
  soon: string;
};

/**
 * Презентаційна сітка карток. Нічого не знає про звʼязки — їх розвʼязують
 * обгортки (RelatedServicesGrid, ServicesCatalog тощо). Завдяки цьому сторінки
 * каталогу і блоки перелінковки виглядають однаково.
 */
export default function CatalogGrid({ kind, entries, cta, soon }: Props) {
  if (entries.length === 0) return null;

  return (
    <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
      {entries.map((entry) => {
        const isSoon = entry.isSoon === true;

        const card = (
          <Box
            position="relative"
            bg={c.surface}
            borderWidth="1px"
            borderColor={c.line}
            rounded="2xl"
            p={{ base: 6, md: 8 }}
            h="full"
            transition="border-color 200ms ease, transform 200ms ease"
            _hover={isSoon ? undefined : { borderColor: c.accent, transform: 'translateY(-2px)' }}
          >
            {/* Позначка "soon" — у куті картки замість фото (тут його немає,
                на відміну від карток-каруселей на головній): Service.status
                у data/services.ts. */}
            {isSoon && (
              <Box
                position="absolute"
                top={4}
                right={4}
                rounded="100px"
                px={3}
                py="0.3rem"
                bg={c.accentSoft}
                color={c.accent}
                fontFamily="var(--font-brand-ui)"
                fontSize="0.6875rem"
                fontWeight="600"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                {soon}
              </Box>
            )}

            <Box
              w="48px"
              h="48px"
              rounded="full"
              bg={c.accentSoft}
              color={c.accent}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <entry.Icon size={22} aria-hidden />
            </Box>

            <Heading
              as="h3"
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="lg"
              color={c.text}
              mb={3}
            >
              {entry.name}
            </Heading>

            <Text
              fontFamily="var(--font-brand-ui)"
              fontSize="sm"
              lineHeight="1.7"
              color={c.textMuted}
              mb={5}
            >
              {entry.description}
            </Text>

            <Box display="flex" alignItems="center" gap={3}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                opacity={isSoon ? 0.45 : 1}
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="sm"
                color={c.accent}
              >
                {cta}
                <LuArrowRight size={16} aria-hidden />
              </Box>

              {isSoon && (
                <Box
                  rounded="100px"
                  px={3}
                  py="0.3rem"
                  bg={c.accentSoft}
                  color={c.accent}
                  fontFamily="var(--font-brand-ui)"
                  fontSize="0.6875rem"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {soon}
                </Box>
              )}
            </Box>
          </Box>
        );

        // Soon-послуга: нема куди вести, тож замість Link — нефокусований div
        // (tabIndex не потрібен: на відміну від .cta в EventServicesSlider,
        // тут немає побічного ефекту фокусу, який варто було б зберігати).
        if (isSoon) {
          return (
            <div key={entry.slug} aria-disabled="true">
              {card}
            </div>
          );
        }

        // Гілки розписані явно, а не через змінну href: типізований Link із
        // next-intl очікує літерал pathname, зі змінної тип не звузиться.
        //
        // aria-label дає посиланню описову назву (назва послуги чи типу події)
        // замість «Детальніше», яке інакше читалося б однаково на всіх картках.
        return kind === 'service' ? (
          <Link
            key={entry.slug}
            href={{ pathname: '/services/[slug]', params: { slug: entry.slug } }}
            aria-label={entry.name}
            className={styles.cardLink}
          >
            {card}
          </Link>
        ) : (
          <Link
            key={entry.slug}
            href={{ pathname: '/events/[slug]', params: { slug: entry.slug } }}
            aria-label={entry.name}
            className={styles.cardLink}
          >
            {card}
          </Link>
        );
      })}
    </Grid>
  );
}
