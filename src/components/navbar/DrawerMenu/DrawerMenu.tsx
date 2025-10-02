import { ColorModeToggle } from '@/components/ui/ColorModeToggle';
import { Box, Button, CloseButton, Drawer, Link, Portal } from '@chakra-ui/react';
import HamburgerIcon from './HamburgerIcon/HamburgerIcon';
import NextLink from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';

export default function DrawerMenu() {
  return (
    <Drawer.Root size={'sm'} placement={'end'}>
      <Drawer.Trigger asChild>
        <Button variant="outline">
          <HamburgerIcon />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={useColorModeValue('brand.lightBg', 'brand.darkBg')}>
            <Drawer.Header>
              <Drawer.Title></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Link fontWeight="medium" as={NextLink} href="/">
                About
              </Link>

              <Link fontWeight="medium" as={NextLink} href="/services">
                Services
              </Link>

              <Link fontWeight="medium" as={NextLink} href="/contact">
                Contact
              </Link>
            </Drawer.Body>
            <Drawer.Footer>
              <Box>
                <ColorModeToggle />
              </Box>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
