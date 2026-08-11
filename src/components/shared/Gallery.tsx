import Image from 'next/image';
import { Box, Grid, Text } from '@chakra-ui/react';
import type { EventPhoto } from '@/data/eventPhotos';
import { c } from './tokens';

type Props = {
  photos: EventPhoto[];
  /** Готові alt-тексти в тому ж порядку, що й photos. Перекладаються, тому приходять ззовні. */
  alts: string[];
  /** Показується замість сітки, поки фото не додані. */
  emptyText: string;
};

/**
 * Сітка фотографій події. Свідомо не карусель: на сторінці послуги знімки —
 * доказ досвіду, їх мають бачити всі одразу, а не гортати. Сітка ще й
 * індексується пошуковиком цілком, на відміну від прихованих слайдів.
 */
export default function Gallery({ photos, alts, emptyText }: Props) {
  if (photos.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={c.line}
        rounded="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.textMuted}>
          {emptyText}
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      gap={{ base: 3, md: 4 }}
      templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
    >
      {photos.map((photo, i) => (
        <Box
          key={photo.src}
          position="relative"
          w="full"
          aspectRatio="4 / 3"
          rounded="xl"
          overflow="hidden"
          bg={c.surfaceAlt}
        >
          <Image
            src={photo.src}
            alt={alts[i] ?? ''}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      ))}
    </Grid>
  );
}
