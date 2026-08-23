import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from './tokens';

type MenuItem = { name: string; ingredients: string; tag: string };

export default async function MenuShowcase() {
  const t = await getTranslations('HealthyBar.menu');
  const items = t.raw('items') as MenuItem[];

  return (
    <Section
      id="menu"
      // Якір веде під зафіксовану шапку, тому лишаємо їй місце.
      scrollMarginTop="80px"
    >
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('title')}</SectionTitle>
      <Lead mb={{ base: 10, md: 14 }}>{t('lead')}</Lead>

      <Grid gap={{ base: 0, md: '0 4rem' }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {items.map((item) => (
          <Box key={item.name} py={6} borderBottomWidth="1px" borderColor={c.line}>
            <Flex align="baseline" justify="space-between" gap={4} mb={2}>
              <Heading
                as="h3"
                fontFamily="var(--font-brand)"
                fontWeight="200"
                fontSize={{ base: '1.5rem', md: '1.75rem' }}
                lineHeight="1.2"
                color={c.text}
              >
                {item.name}
              </Heading>

              <Text
                flexShrink={0}
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="xs"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={c.accent}
                bg={c.accentSoft}
                rounded="full"
                px={3}
                py={1.5}
              >
                {item.tag}
              </Text>
            </Flex>

            <Text
              fontFamily="var(--font-brand-ui)"
              fontSize="sm"
              lineHeight="1.7"
              color={c.textMuted}
              maxW="46ch"
            >
              {item.ingredients}
            </Text>
          </Box>
        ))}
      </Grid>
    </Section>
  );
}
