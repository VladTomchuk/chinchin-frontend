import Image from 'next/image';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/shared/primitives';
import BackLink from '@/components/shared/BackLink';
import { c, CONTACT_EMAIL, CONTENT_MAX_WIDTH, FOCUS_RING, NAVBAR_OFFSET } from './tokens';

type Stat = { value: string; label: string };

export default async function Hero() {
  const t = await getTranslations('HealthyBar.hero');
  const tCta = await getTranslations('HealthyBar.cta');
  const tNav = await getTranslations('Navbar');
  const stats = t.raw('stats') as Stat[];

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(tCta('emailSubject'))}`;

  return (
    <Box as="header" px={{ base: 5, md: 8 }} pt={NAVBAR_OFFSET} pb={{ base: 12, md: 20 }}>
      <Grid
        maxW={CONTENT_MAX_WIDTH}
        mx="auto"
        gap={{ base: 10, lg: 16 }}
        templateColumns={{ base: '1fr', lg: '1.05fr 1fr' }}
        alignItems="center"
      >
        <Box>
          {/* Повернення до каталогу. Тут, на відміну від шаблонного героя,
              рубрика несе іншу назву («Хелсі бар»), тож посилання стоїть над
              нею, а не замість неї. */}
          <Box mb={4}>
            <BackLink href="/services" label={tNav('services')} />
          </Box>

          <Eyebrow>{t('eyebrow')}</Eyebrow>

          <Heading
            as="h1"
            fontFamily="var(--font-brand)"
            fontWeight="200"
            // pre-line, бо заголовок у перекладах розбитий на рядки вручну:
            // ритм рядків тут частина верстки, а не випадковість переносу.
            whiteSpace="pre-line"
            lineHeight="1.08"
            fontSize={{ base: '2.5rem', md: '3.5rem', lg: '4rem' }}
            color={c.text}
            mb={6}
          >
            {t('title')}
          </Heading>

          <Text
            fontFamily="var(--font-brand-ui)"
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight="1.7"
            color={c.textMuted}
            maxW="58ch"
            mb={9}
          >
            {t('subtitle')}
          </Text>

          <Flex gap={3} wrap="wrap">
            <Button
              asChild
              size="lg"
              px={7}
              rounded="full"
              bg={c.accent}
              color={c.accentContrast}
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              transition="opacity 200ms ease"
              _hover={{ opacity: 0.86, textDecoration: 'none' }}
              _focusVisible={FOCUS_RING}
            >
              <a href={mailto}>{t('ctaPrimary')}</a>
            </Button>

            <Button
              asChild
              size="lg"
              px={7}
              rounded="full"
              variant="outline"
              borderColor={c.line}
              color={c.text}
              fontFamily="var(--font-brand-ui)"
              fontWeight="500"
              transition="background-color 200ms ease, border-color 200ms ease"
              _hover={{ bg: c.accentSoft, borderColor: c.accent, textDecoration: 'none' }}
              _focusVisible={FOCUS_RING}
            >
              <a href="#menu">{t('ctaSecondary')}</a>
            </Button>
          </Flex>
        </Box>

        {/* TODO: замінити на фото саме хелсі-станції — зараз це кадр із загальної
            галереї головної сторінки. */}
        <Box
          position="relative"
          w="full"
          aspectRatio={{ base: '4 / 3', lg: '3 / 4' }}
          rounded="2xl"
          overflow="hidden"
          bg={c.surfaceAlt}
        >
          <Image
            src="/hero/hero-03.jpg"
            alt={t('imageAlt')}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Grid>

      <Grid
        maxW={CONTENT_MAX_WIDTH}
        mx="auto"
        mt={{ base: 12, md: 20 }}
        gap={{ base: 6, md: 4 }}
        templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
        borderTopWidth="1px"
        borderColor={c.line}
        pt={{ base: 8, md: 10 }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Text
              fontFamily="var(--font-brand)"
              fontWeight="200"
              fontSize={{ base: '2.25rem', md: '2.75rem' }}
              lineHeight="1.1"
              color={c.accent}
            >
              {stat.value}
            </Text>
            <Text
              fontFamily="var(--font-brand-ui)"
              fontSize="sm"
              lineHeight="1.6"
              color={c.textMuted}
              mt={1}
              maxW="30ch"
            >
              {stat.label}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
