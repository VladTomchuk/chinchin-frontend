'use client';

import { Box, Image, Flex, Text, Button } from '@chakra-ui/react';
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
    <Flex
      justifyContent={'space-around'}
      alignItems={'center'}
      h={'100vh'}
      pt={'90px'}
      pb={'20px'}
      px={5}
    >
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} w={'100%'} h={'100%'}>
        <Flex direction={'column'} justifyContent={'space-around'} h={'100%'}>
          <Text fontFamily="body" fontSize={'6xl'}>
            Cocktails <br />
            that speak <br />
            your language
          </Text>
          <Button variant={'outline'} size={'md'} w={'100px'}>
            Contact us
          </Button>
        </Flex>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'100%'}
        h={'100%'}
        borderRadius="full"
        overflow="hidden"
      >
        <Image src={HeroLogo} alt="Logo" height="94%" />
      </Box>
    </Flex>
  );
}
