'use client';

import { ChakraProvider, Box } from '@chakra-ui/react';
import { system } from '@/theme/system';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <Box
        minH="100dvh"
        bg={{ base: '#fff9f6', _dark: 'black' }}
        color={{ base: '#3d3d3d', _dark: '#fff9f6' }}
        transition="background-color 150ms ease, color 150ms ease"
      >
        {children}
      </Box>
    </ChakraProvider>
  );
}
