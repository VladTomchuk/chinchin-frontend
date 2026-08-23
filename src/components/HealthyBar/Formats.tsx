import Image from 'next/image';
import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from './tokens';

type Format = { name: string; text: string };

export default async function Formats() {
  const t = await getTranslations('HealthyBar.formats');
  const items = t.raw('items') as Format[];

  return (
    <Section>
      <Grid gap={{ base: 10, lg: 16 }} templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        {/* TODO: замінити на фото хелсі-станції. */}
        <Box
          position="relative"
          w="full"
          aspectRatio={{ base: '4 / 3', lg: 'auto' }}
          minH={{ lg: '520px' }}
          rounded="2xl"
          overflow="hidden"
          bg={c.surfaceAlt}
          order={{ base: 1, lg: 0 }}
        >
          <Image
            src="/hero/hero-06.jpg"
            alt={t('imageAlt')}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Box order={{ base: 0, lg: 1 }}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionTitle mb={{ base: 8, md: 10 }}>{t('title')}</SectionTitle>

          <Stack gap={0}>
            {items.map((item, i) => (
              <Box
                key={item.name}
                py={5}
                borderTopWidth={i === 0 ? '0' : '1px'}
                borderColor={c.line}
              >
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
                  maxW="52ch"
                >
                  {item.text}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Grid>
    </Section>
  );
}
