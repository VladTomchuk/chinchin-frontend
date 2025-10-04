'use client';

import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const HeroLogo = mounted
    ? resolvedTheme === 'dark'
      ? '/Pink_hands.svg'
      : '/Green_hands.svg'
    : '/Green_hands.svg';

  return (
    <Flex justifyContent={'space-around'} alignItems={'center'} h={'100vh'}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} w={'100%'} h={'100%'}>
        <Text fontFamily="body" fontSize={'6xl'}>
          Cocktails <br />
          that speak <br />
          your language
        </Text>
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} w={'100%'} h={'100%'}>
        <Image src={HeroLogo} alt="Logo" height="80%" />
      </Box>
    </Flex>
  );
}
