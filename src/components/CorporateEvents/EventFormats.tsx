import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuHandshake, LuPresentation, LuRocket, LuSparkles, LuStore, LuUsers } from 'react-icons/lu';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

type Format = { name: string; text: string };

// Порядок відповідає порядку items у перекладах.
const ICONS = [LuPresentation, LuStore, LuSparkles, LuHandshake, LuUsers, LuRocket];

/**
 * Головна SEO-секція сторінки. Заголовки карток — h3 під h2 секції, щоб
 * ієрархія h1 → h2 → h3 лишалась цілою.
 */
export default async function EventFormats() {
  const t = await getTranslations('CorporateEvents.formats');
  const items = t.raw('items') as Format[];

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }} maxW="22ch">
        {t('title')}
      </SectionTitle>

      <Grid
        gap={{ base: 5, md: 6 }}
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
      >
        {items.map((item, i) => {
          const IconComponent = ICONS[i] ?? LuSparkles;

          return (
            <Box
              key={item.name}
              bg={c.surface}
              borderWidth="1px"
              borderColor={c.line}
              rounded="2xl"
              p={{ base: 6, md: 7 }}
              h="full"
            >
              <Box
                w="44px"
                h="44px"
                rounded="full"
                bg={c.accentSoft}
                color={c.accent}
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={5}
              >
                <IconComponent size={20} aria-hidden />
              </Box>

              <Heading
                as="h3"
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="md"
                lineHeight="1.35"
                color={c.text}
                mb={3}
              >
                {item.name}
              </Heading>

              <Text
                fontFamily="var(--font-brand-ui)"
                fontSize="sm"
                lineHeight="1.7"
                color={c.textMuted}
              >
                {item.text}
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Section>
  );
}
