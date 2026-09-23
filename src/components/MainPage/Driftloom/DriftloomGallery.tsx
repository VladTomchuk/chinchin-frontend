import { Box } from '@chakra-ui/react';
import { Section } from '@/components/shared/primitives';
import Driftloom from './Driftloom';

/**
 * Секція головної сторінки на основі Driftloom (портованого маркетплейс-
 * компонента Framer) — паралакс-стрічка фото подій із перетягуванням і
 * лайтбоксом. Driftloom сам бере height:"100%" від батька, тож висоту задає
 * саме ця обгортка; ширина розірвана на всю ширину вʼюпорта тим самим
 * прийомом `50% - 50vw`, що й у BrandsMarquee.
 */
export default function DriftloomGallery() {
  return (
    <Section>
      <Box w="100vw" ml="calc(50% - 50vw)" h={{ base: '22rem', md: '30rem', lg: '34rem' }}>
        <Driftloom />
      </Box>
    </Section>
  );
}
