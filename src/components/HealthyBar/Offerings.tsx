import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuCitrus, LuDumbbell, LuMartini } from 'react-icons/lu';
import { Eyebrow, Section, SectionTitle } from './primitives';
import { c } from './tokens';

type Offering = { name: string; text: string };

// Порядок збігається з порядком items у перекладах.
const ICONS = [LuDumbbell, LuCitrus, LuMartini];

export default async function Offerings() {
  const t = await getTranslations('HealthyBar.offerings');
  const items = t.raw('items') as Offering[];

  return (
    <Section bg={c.page}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }}>{t('title')}</SectionTitle>

      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}>
        {items.map((item, i) => {
          const IconComponent = ICONS[i] ?? LuMartini;

          return (
            <Box
              key={item.name}
              bg={c.surface}
              borderWidth="1px"
              borderColor={c.line}
              rounded="2xl"
              p={{ base: 6, md: 8 }}
            >
              {/* Іконку рендеримо самі, а не через <Icon as={...} />: Icon —
                  клієнтський компонент, і передати в нього компонент пропом із
                  серверного не можна. react-icons бере колір із currentColor. */}
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
                <IconComponent size={22} aria-hidden />
              </Box>

              <Heading
                as="h3"
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="lg"
                color={c.text}
                mb={3}
              >
                {item.name}
              </Heading>

              <Text
                fontFamily="var(--font-brand-ui)"
                fontSize="sm"
                lineHeight="1.75"
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
