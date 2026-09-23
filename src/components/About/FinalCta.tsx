import { Box, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import QuoteForm from '@/components/shared/QuoteForm/QuoteForm';

/** Якір quote-form — ціль кнопки "ctaPrimary" у Hero.tsx й CTA в Process.tsx. */
export default async function FinalCta() {
  const t = await getTranslations('About.cta');

  return (
    <Section id="quote-form" scrollMarginTop="80px">
      <Box
        bg={c.surface}
        borderWidth="1px"
        borderColor={c.line}
        rounded="3xl"
        px={{ base: 6, md: 16 }}
        py={{ base: 12, md: 20 }}
        textAlign={{ base: 'left', md: 'center' }}
      >
        <SectionTitle mb={5} textAlign={{ base: 'left', md: 'center' }}>
          {t('title')}
        </SectionTitle>

        <Text
          fontFamily="var(--font-brand-ui)"
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight="1.7"
          color={c.textMuted}
          maxW="52ch"
          mx={{ base: 0, md: 'auto' }}
          mb={9}
        >
          {t('text')}
        </Text>

        <Box maxW="640px" mx="auto" textAlign="left">
          <QuoteForm />
        </Box>
      </Box>
    </Section>
  );
}
