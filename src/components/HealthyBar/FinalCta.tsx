import { Box, Button, Link, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Section, SectionTitle } from './primitives';
import { c, CONTACT_EMAIL, FOCUS_RING } from './tokens';

export default async function FinalCta() {
  const t = await getTranslations('HealthyBar.cta');
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('emailSubject'))}`;

  return (
    <Section bg={c.surfaceAlt}>
      <Box
        bg={c.surface}
        borderWidth="1px"
        borderColor={c.line}
        rounded="3xl"
        px={{ base: 6, md: 16 }}
        py={{ base: 12, md: 20 }}
        textAlign="center"
      >
        <SectionTitle mb={5}>{t('title')}</SectionTitle>

        <Text
          fontFamily="var(--font-brand-ui)"
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight="1.7"
          color={c.textMuted}
          maxW="52ch"
          mx="auto"
          mb={9}
        >
          {t('text')}
        </Text>

        <Button
          asChild
          size="lg"
          px={8}
          rounded="full"
          bg={c.accent}
          color={c.accentContrast}
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          transition="opacity 200ms ease"
          _hover={{ opacity: 0.86, textDecoration: 'none' }}
          _focusVisible={FOCUS_RING}
        >
          <a href={mailto}>{t('button')}</a>
        </Button>

        <Text
          fontFamily="var(--font-brand-ui)"
          fontSize="sm"
          color={c.textMuted}
          mt={3}
          wordBreak="break-word"
        >
          {/* py — щоб зона натискання дотягувала до 44px: сам рядок тексту
              дає лише 21px, а це надто мала ціль для пальця. */}
          <Link
            href={mailto}
            display="inline-block"
            py={3}
            color="inherit"
            _hover={{ color: c.accent }}
            _focusVisible={FOCUS_RING}
          >
            {CONTACT_EMAIL}
          </Link>
        </Text>
      </Box>
    </Section>
  );
}
