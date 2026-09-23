import { Box } from '@chakra-ui/react';
import { Section } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

/**
 * Заглушка на час завантаження. Блок серверний, тож «стан завантаження» — це
 * fallback у <Suspense>: сторінка віддається одразу, а місце під відгуки не
 * стрибає, коли вони приїдуть.
 *
 * Форма заглушки наближена до ReviewsCarousel (одна широка картка по центру
 * + рядок керування під нею) — єдиного подання блоку на сайті.
 */
export default function GoogleReviewsSkeleton({ label }: { label: string }) {
  return (
    <Section aria-busy="true" aria-label={label}>
      <Box h="14px" w="90px" rounded="full" bg={c.line} mb={5} />
      <Box h="34px" w="260px" rounded="lg" bg={c.line} mb={{ base: 8, md: 12 }} />

      <Box maxW="640px" mx="auto">
        <Box
          rounded="3xl"
          borderWidth="1px"
          borderColor={c.line}
          bg={c.surface}
          minH={{ base: '300px', md: '360px' }}
        />

        <Box
          mt={{ base: 6, md: 8 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Box w="40px" h="40px" rounded="full" bg={c.line} />
          <Box display="flex" gap={2}>
            {[0, 1, 2].map((i) => (
              <Box key={i} w="8px" h="8px" rounded="full" bg={c.line} />
            ))}
          </Box>
          <Box w="40px" h="40px" rounded="full" bg={c.line} />
        </Box>
      </Box>
    </Section>
  );
}
