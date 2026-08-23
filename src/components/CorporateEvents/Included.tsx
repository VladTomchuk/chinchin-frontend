import { Box, Grid, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuCheck } from 'react-icons/lu';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

export default async function Included() {
  const t = await getTranslations('CorporateEvents.included');
  const items = t.raw('items') as string[];

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }} maxW="24ch">
        {t('title')}
      </SectionTitle>

      <Grid
        as="ul"
        listStyleType="none"
        gap={0}
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        columnGap={{ md: '4rem' }}
        maxW="960px"
      >
        {items.map((item) => (
          <Box
            as="li"
            key={item}
            display="flex"
            alignItems="flex-start"
            gap={3}
            py={4}
            borderBottomWidth="1px"
            borderColor={c.line}
          >
            <Box color={c.accent} flexShrink={0} mt="2px">
              <LuCheck size={18} aria-hidden />
            </Box>
            <Text
              fontFamily="var(--font-brand-ui)"
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight="1.6"
              color={c.text}
            >
              {item}
            </Text>
          </Box>
        ))}
      </Grid>
    </Section>
  );
}
