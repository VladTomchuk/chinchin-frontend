import { Box, Grid, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuBuilding2, LuCalendarCheck, LuHotel, LuUsers } from 'react-icons/lu';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

// Порядок відповідає порядку items у перекладах.
const ICONS = [LuCalendarCheck, LuUsers, LuHotel, LuBuilding2];

export default async function Audience() {
  const t = await getTranslations('CorporateEvents.audience');
  const items = t.raw('items') as string[];

  return (
    <Section bg={c.page}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }} maxW="24ch">
        {t('title')}
      </SectionTitle>

      <Grid
        as="ul"
        listStyleType="none"
        gap={{ base: 3, md: 4 }}
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      >
        {items.map((item, i) => {
          const IconComponent = ICONS[i] ?? LuBuilding2;

          return (
            <Box
              as="li"
              key={item}
              bg={c.surface}
              borderWidth="1px"
              borderColor={c.line}
              rounded="2xl"
              px={5}
              py={6}
            >
              <Box color={c.accent} mb={4}>
                <IconComponent size={22} aria-hidden />
              </Box>
              <Text
                fontFamily="var(--font-brand-ui)"
                fontWeight="500"
                fontSize="sm"
                lineHeight="1.5"
                color={c.text}
              >
                {item}
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Section>
  );
}
