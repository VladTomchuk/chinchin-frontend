import { Box, Grid } from '@chakra-ui/react';
import { Section } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

/**
 * Заглушка на час завантаження. Блок серверний, тож «стан завантаження» — це
 * fallback у <Suspense>: сторінка віддається одразу, а місце під відгуки не
 * стрибає, коли вони приїдуть.
 */
export default function GoogleReviewsSkeleton({ label }: { label: string }) {
  return (
    <Section aria-busy="true" aria-label={label}>
      <Box h="14px" w="90px" rounded="full" bg={c.line} mb={5} />
      <Box h="34px" w="260px" rounded="lg" bg={c.line} mb={{ base: 8, md: 12 }} />

      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            bg={c.surface}
            borderWidth="1px"
            borderColor={c.line}
            rounded="2xl"
            p={{ base: 6, md: 8 }}
          >
            <Box display="flex" alignItems="center" gap={4} mb={5}>
              <Box w="44px" h="44px" rounded="full" bg={c.line} />
              <Box>
                <Box h="12px" w="120px" rounded="full" bg={c.line} mb={2} />
                <Box h="10px" w="80px" rounded="full" bg={c.line} />
              </Box>
            </Box>
            <Box h="10px" w="100%" rounded="full" bg={c.line} mb={2} />
            <Box h="10px" w="92%" rounded="full" bg={c.line} mb={2} />
            <Box h="10px" w="64%" rounded="full" bg={c.line} />
          </Box>
        ))}
      </Grid>
    </Section>
  );
}
