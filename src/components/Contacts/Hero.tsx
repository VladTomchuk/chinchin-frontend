import { Box } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, PageTitle } from '@/components/shared/primitives';
import { NAVBAR_OFFSET } from '@/components/shared/tokens';

/**
 * Заголовок сторінки контактів. Без фото (на відміну від About/Hero.tsx) —
 * це утилітарна сторінка з формою та контактами, великий кадр тут не потрібен.
 */
export default async function Hero() {
  const t = await getTranslations('Contacts.hero');

  return (
    <Box as="header" px={{ base: 5, md: 8 }} pt={NAVBAR_OFFSET} pb={{ base: 8, md: 10 }}>
      <Box maxW="680px" mx="auto" textAlign={{ base: 'left', md: 'center' }}>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <PageTitle mb={4}>{t('title')}</PageTitle>
        <Lead mx={{ md: 'auto' }}>{t('lead')}</Lead>
      </Box>
    </Box>
  );
}
