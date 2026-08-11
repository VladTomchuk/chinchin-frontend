import { Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, PageTitle, Section } from '@/components/shared/primitives';
import { c, NAVBAR_OFFSET } from '@/components/shared/tokens';

export default async function Hero() {
  const t = await getTranslations('CorporateEvents.hero');

  return (
    <Section as="header" bg={c.page} pt={NAVBAR_OFFSET} pb={{ base: 12, md: 16 }}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>

      {/* Заголовок довгий, тому кегль менший за типовий PageTitle — інакше він
          з'їдає весь перший екран. */}
      <PageTitle fontSize={{ base: '2.125rem', md: '3rem' }} maxW="20ch" mb={6}>
        {t('title')}
      </PageTitle>

      <Text
        fontFamily="var(--font-brand-ui)"
        fontWeight="500"
        fontSize={{ base: 'lg', md: 'xl' }}
        lineHeight="1.5"
        color={c.accent}
        maxW="46ch"
        mb={7}
      >
        {t('subtitle')}
      </Text>

      <Lead>{t('intro')}</Lead>
    </Section>
  );
}
