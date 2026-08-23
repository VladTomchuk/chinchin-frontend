'use client';

import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import { Flex, Box, Image } from '@chakra-ui/react';
import DrawerMenu from './DrawerMenu/DrawerMenu';
import { useState, useEffect } from 'react';
import { ColorModeToggle } from '../ui/ColorModeToggle';
import { useColorModeValue } from '../ui/color-mode';
import LocaleSwitcher from '../LocaleSwitcherSelect/LocaleSwitcher';
import { usePathname } from '@/i18n/navigation';

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => setMounted(true), []);

  const NavbarBg = useColorModeValue('brand.lightBg', 'brand.darkBg');
  const currentBg = mounted ? NavbarBg : 'brand.lightBg';

  // usePathname() у next-intl повертає internal (нелокалізований) шлях —
  // '/' однаково для /en і /ua, тож порівняння не залежить від мови.
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  const visible = showNavbar;

  // На головній перша секція (IntroBanner) — повноекранний зум-хіро без
  // навбару зверху; він з'являється лише починаючи з другої секції, і лише
  // якщо скролити вгору — не одразу при вході в неї. На інших сторінках
  // лишається звичайна поведінка (видно біля верху, ховається/показується
  // залежно від напрямку скролу).
  useEffect(() => {
    const currentY = Math.max(window.scrollY, 0);
    setShowNavbar(isHomepage ? currentY >= window.innerHeight : true);
    setLastScrollY(currentY);
  }, [isHomepage]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        // Math.max guards against iOS rubber-band overscroll going negative
        const currentY = Math.max(window.scrollY, 0);
        const delta = currentY - lastScrollY;
        const scrollThreshold = 8;

        if (isHomepage) {
          const sectionOneEnd = window.innerHeight; // одна секція = один екран

          if (currentY < sectionOneEnd) {
            setShowNavbar(false); // у першій секції навбар завжди прихований
          } else if (delta < -scrollThreshold) {
            setShowNavbar(true); // з'являється лише на скрол угору
          } else if (delta > scrollThreshold) {
            setShowNavbar(false); // і ховається знову на скрол вниз
          }
        } else if (currentY <= 80) {
          setShowNavbar(true); // біля самого верху — завжди показувати
        } else if (delta > scrollThreshold) {
          setShowNavbar(false); // скролимо вниз — ховати
        } else if (delta < -scrollThreshold) {
          setShowNavbar(true); // скролимо вгору — показати
        }

        setLastScrollY(currentY);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHomepage]);

  const srcLogo = mounted
    ? resolvedTheme === 'dark'
      ? '/pink_chinchin_logo.svg'
      : '/green_chinchin_logo.svg'
    : '/green_chinchin_logo.svg';
  return (
    <Flex
      as="nav"
      bg={currentBg}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="100"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      boxShadow="sm"
      transition="transform 0.45s ease, opacity 0.45s ease"
      transform={visible ? 'translateY(0)' : 'translateY(-100%)'}
      opacity={visible ? 1 : 0}
      pointerEvents={visible ? 'auto' : 'none'}
      px={8}
    >
      <Box>
        <NextLink href="/" passHref>
          <Image src={srcLogo} alt="Logo" height="50px" cursor="pointer" />
        </NextLink>
      </Box>
      <Flex justifyContent={'space-between'}>
        <LocaleSwitcher />
        <ColorModeToggle />
        <DrawerMenu />
      </Flex>
    </Flex>
  );
}
