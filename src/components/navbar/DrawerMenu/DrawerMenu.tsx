'use client';

import { Button, CloseButton, Drawer, Portal } from '@chakra-ui/react';
// import NextLink from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';
import { CiMenuFries } from 'react-icons/ci';
import { useEffect, useState } from 'react';

export default function DrawerMenu() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const buttonColorValue = useColorModeValue('brand.darkText', 'brand.lightPink');
  const drawerBgValue = useColorModeValue('brand.lightBg', 'brand.darkBg');

  const buttonColor = mounted ? buttonColorValue : 'brand.lightPink';
  const drawerBg = mounted ? drawerBgValue : 'brand.lightBg';
  return (
    <Drawer.Root size="xs" placement="end">
      <Drawer.Trigger asChild>
        <Button variant="outline" color={buttonColor} mx={1}>
          <CiMenuFries />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={drawerBg}>
            <Drawer.Body>
              {/* <Link fontWeight="medium" as={NextLink} href="/">
                About
              </Link>
              <Link fontWeight="medium" as={NextLink} href="/services">
                Services
              </Link>
              <Link fontWeight="medium" as={NextLink} href="/contact">
                Contact
              </Link> */}
            </Drawer.Body>
            <Drawer.Footer></Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
