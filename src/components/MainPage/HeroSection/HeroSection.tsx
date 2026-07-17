'use client';

import { Box, Image, Flex, Text, Button } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const HeroLogo = mounted
    ? resolvedTheme === 'dark'
      ? '/Pink_hands.svg'
      : '/Green_hands.svg'
    : '/Green_hands.svg';

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent={{ base: 'center', md: 'space-around' }}
      alignItems={'center'}
      minH={'100vh'}
      pt={'90px'}
      pb={'20px'}
      px={5}
      gap={{ base: 8, md: 0 }}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'100%'}
        h={{ base: 'auto', md: '100%' }}
        order={{ base: 1, md: 0 }}
      >
        <Flex
          direction={'column'}
          justifyContent={'space-around'}
          alignItems={{ base: 'center', md: 'flex-start' }}
          textAlign={{ base: 'center', md: 'left' }}
          gap={{ base: 6, md: 0 }}
          h={{ base: 'auto', md: '100%' }}
        >
          <Text fontFamily="body" fontSize={{ base: '4xl', md: '6xl' }} whiteSpace="pre-line">
            {t('title')}
          </Text>
          <Button variant={'outline'} size={'md'} w={'100px'}>
            {t('contactButton')}
          </Button>
        </Flex>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'100%'}
        h={{ base: 'auto', md: '100%' }}
        maxW={{ base: '80%', md: 'none' }}
        borderRadius="full"
        overflow="hidden"
        order={{ base: 2, md: 0 }}
      >
        <Image src={HeroLogo} alt="Logo" w={{ base: '100%', md: 'auto' }} height={{ base: 'auto', md: '94%' }} />
      </Box>
    </Flex>
  );
}
