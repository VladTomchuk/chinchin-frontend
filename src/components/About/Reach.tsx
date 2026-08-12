import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuGlobe, LuMapPin } from 'react-icons/lu';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

type ReachItem = { name: string; text: string };

// Порядок збігається з порядком items у перекладах: спершу база, потім світ.
const ICONS = [LuMapPin, LuGlobe];

export default async function Reach() {
  const t = await getTranslations('About.reach');
  const items = t.raw('items') as ReachItem[];

  return (
    <Section bg={c.surfaceAlt}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }} maxW="24ch">
        {t('title')}
      </SectionTitle>

      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {items.map((item, i) => {
          const IconComponent = ICONS[i] ?? LuMapPin;

          return (
            <Box
              key={item.name}
              bg={c.surface}
              borderWidth="1px"
              borderColor={c.line}
              rounded="2xl"
              p={{ base: 6, md: 8 }}
            >
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
