'use client';

import { Flex } from '@chakra-ui/react';
import { ColorModeToggle } from '../ui/ColorModeToggle';

export default function Navbar() {
  return (
    <Flex bg={'red.400'} width={'100%'}>
      <ColorModeToggle />
    </Flex>
  );
}
