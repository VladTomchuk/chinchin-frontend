import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from './tokens';

type Step = { name: string; text: string };

export default async function Process() {
  const t = await getTranslations('HealthyBar.process');
  const items = t.raw('items') as Step[];

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }}>{t('title')}</SectionTitle>

      <Grid
        gap={{ base: 8, md: 6 }}
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      >
        {items.map((item, i) => (
          <Box key={item.name} borderTopWidth="2px" borderColor={c.accent} pt={5}>
            <Text
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="xs"
              letterSpacing="0.1em"
              color={c.accent}
              mb={3}
            >
              {String(i + 1).padStart(2, '0')}
            </Text>

            <Heading
              as="h3"
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="md"
              color={c.text}
              mb={2}
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
        ))}
      </Grid>
    </Section>
  );
}
