import { Box, Grid } from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { Section } from './primitives';
import { c, NAVBAR_OFFSET } from './tokens';

/**
 * Будівельні блоки для App Router'ового loading.tsx. Клієнтський перехід між
 * сторінками (next-intl Link) не показує жодного браузерного індикатора — тож
 * без цих заглушок клік по пункту меню виглядає так, ніби нічого не
 * відбувається, поки не приїде RSC-відповідь нової сторінки. Router підставляє
 * їх миттєво в момент кліку.
 *
 * Розмітка не копіює кожну сторінку піксель-у-піксель — заглушка живе долі
 * секунди, тож досить впізнаваного силуету (Section + Eyebrow + Title), а не
 * точної відповідності.
 */

function Bar({ rounded = 'full', ...rest }: BoxProps) {
  return <Box bg={c.line} rounded={rounded} {...rest} />;
}

/** Заглушка шапки Section/Eyebrow/PageTitle/Lead — services, events, events/[slug], about. */
export function HeaderSkeleton() {
  return (
    <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }} aria-busy="true">
      <Bar h="14px" w="140px" mb={4} />
      <Bar h={{ base: '40px', md: '56px' }} w={{ base: '80%', md: '50%' }} mb={6} rounded="lg" />
      <Bar h="12px" w="90%" mb={2} />
      <Bar h="12px" w="70%" />
    </Section>
  );
}

/** Заглушка сітки карток CatalogGrid — під /services і /events. */
export function CardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Section pt={0} aria-busy="true">
      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            bg={c.surface}
            borderWidth="1px"
            borderColor={c.line}
            rounded="2xl"
            p={{ base: 6, md: 8 }}
          >
            <Box w="48px" h="48px" rounded="full" bg={c.accentSoft} mb={6} />
            <Bar h="18px" w="70%" mb={3} rounded="md" />
            <Bar h="10px" w="100%" mb={2} />
            <Bar h="10px" w="85%" mb={5} />
            <Bar h="12px" w="90px" />
          </Box>
        ))}
      </Grid>
    </Section>
  );
}

/** Заглушка текстового блоку-плейсхолдера — під сторінкою типу події. */
export function ContentBlockSkeleton() {
  return (
    <Section pt={0} aria-busy="true">
      <Box
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={c.line}
        rounded="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 10, md: 14 }}
      >
        <Bar h="10px" w="100%" mb={2} />
        <Bar h="10px" w="94%" mb={2} />
        <Bar h="10px" w="60%" />
      </Box>
    </Section>
  );
}

/** Заглушка повноекранної фотошапки ServiceHero — під /services/[slug]. */
export function PhotoHeroSkeleton() {
  return (
    <Box
      position="relative"
      h={{ base: '92svh', md: '100svh' }}
      minH="560px"
      bg={c.surfaceAlt}
      aria-busy="true"
    >
      <Box position="absolute" insetX="0" bottom="0" px={{ base: 5, md: 8 }} pb={{ base: 12, md: 20 }}>
        <Box maxW={{ base: '100%', lg: '46%' }}>
          <Bar h="12px" w="120px" mb={4} />
          <Bar h={{ base: '32px', md: '48px' }} w="85%" mb={8} rounded="lg" />
          <Box h="48px" w="160px" rounded="full" bg={c.line} />
        </Box>
      </Box>
    </Box>
  );
}
