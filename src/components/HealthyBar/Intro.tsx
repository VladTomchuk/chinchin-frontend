import { Box, Grid, Stack, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from './tokens';

export default async function Intro() {
  const t = await getTranslations('HealthyBar.intro');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <Section>
      <Grid gap={{ base: 8, lg: 16 }} templateColumns={{ base: '1fr', lg: '0.9fr 1.1fr' }}>
        <Box>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionTitle>{t('title')}</SectionTitle>
        </Box>

        <Stack gap={5} justify="center">
          {paragraphs.map((paragraph) => (
            <Text
              key={paragraph}
              fontFamily="var(--font-brand-ui)"
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.75"
              color={c.textMuted}
              maxW="62ch"
            >
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Grid>
    </Section>
  );
}
