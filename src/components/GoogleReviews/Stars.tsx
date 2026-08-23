import { LuStar, LuStarHalf } from 'react-icons/lu';
import { Box } from '@chakra-ui/react';
import { c } from '@/components/shared/tokens';

/**
 * Пʼять зірок за оцінкою. Половинна зірка для дробових значень: 4.5 має читатися як
 * 4.5, а не як 5 — округлення вгору завищувало б рейтинг закладу.
 *
 * Самі зірки для скрін-рідера сховані (aria-hidden), а оцінка озвучується
 * текстом у label — інакше читалка перелічувала б пʼять однакових іконок.
 */
export default function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="2px"
      color={c.accent}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = rating - index;

        if (filled >= 0.75) return <LuStar key={index} size={16} fill="currentColor" aria-hidden />;
        if (filled >= 0.25)
          return <LuStarHalf key={index} size={16} fill="currentColor" aria-hidden />;
        return <LuStar key={index} size={16} aria-hidden />;
      })}
    </Box>
  );
}
