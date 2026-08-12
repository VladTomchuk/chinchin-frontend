import Image from 'next/image';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/shared/primitives';
import { c, CONTENT_MAX_WIDTH, FOCUS_RING, NAVBAR_OFFSET } from '@/components/shared/tokens';
import { Link } from '@/i18n/navigation';
import { CONTACT_EMAIL } from '@/components/HealthyBar/tokens';

export default async function Hero() {
  const t = await getTranslations('About.hero');
  const tCta = await getTranslations('About.cta');
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
          <Eyebrow>{t('eyebrow')}</Eyebrow>

          <Heading
            as="h1"
            fontFamily="var(--font-brand)"
            fontWeight="200"
            lineHeight="1.08"
            fontSize={{ base: '2.5rem', md: '3.5rem', lg: '4rem' }}
            color={c.text}
            mb={4}
          >
            {t('title')}
          </Heading>

          {/* Слоган — та сама фраза, що й на головній, тільки статичним рядком:
              тут немає анімованої мультимовної шапки, потрібен лише акцент. */}
          <Text
            fontFamily="var(--font-brand-ui)"
            fontWeight="500"
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight="1.5"
            color={c.accent}
            mb={6}
          >
            {t('subtitle')}
          </Text>

          <Text
            fontFamily="var(--font-brand-ui)"
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight="1.7"
            color={c.textMuted}
            maxW="58ch"
            mb={9}
          >
            {t('intro')}
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
              <Link href="/services">{t('ctaSecondary')}</Link>
            </Button>
          </Flex>
        </Box>

        <Box
          position="relative"
          w="full"
          aspectRatio={{ base: '4 / 3', lg: '3 / 4' }}
          rounded="2xl"
          overflow="hidden"
          bg={c.surfaceAlt}
        >
          <Image
            src="/hero/hero-05.jpg"
            alt={t('imageAlt')}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Grid>
    </Box>
  );
}
