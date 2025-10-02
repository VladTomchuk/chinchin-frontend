'use client';

import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import { Flex, Box, Image } from '@chakra-ui/react';
import DrawerMenu from './DrawerMenu/DrawerMenu';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const srcLogo = mounted
    ? resolvedTheme === 'dark'
      ? '/pink_chinchin_logo.svg'
      : '/black_chinchin_logo.svg'
    : '/black_chinchin_logo.svg';
  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding={2} boxShadow="sm">
      <Box>
        <NextLink href="/" passHref>
          <Image src={srcLogo} alt="Logo" height="60px" cursor="pointer" />
        </NextLink>
      </Box>
      <DrawerMenu />
    </Flex>
  );
}
