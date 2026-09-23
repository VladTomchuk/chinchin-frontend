import { Box } from '@chakra-ui/react';
import { c } from './tokens';

/**
 * Пілюля "Soon"/"Скоро" — той самий візуал, що вже стоїть на soon-картках
 * каталогу (CatalogGrid.tsx) і в каруселі послуг (EventServicesSlider.tsx,
 * .soonTag), винесений сюди окремо для місць поза сіткою карток: кнопок і
 * BackLink, які ведуть на тимчасово прибрані сторінки (ABOUT_HIDDEN,
 * SERVICES_CATALOG_HIDDEN у config/navigation.ts). Текст приходить від
 * виклику (Catalog.soon скрізь) — компонент не тягне власний неймспейс
 * перекладів.
 */
export default function SoonBadge({ label }: { label: string }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
      rounded="100px"
      px={3}
      py="0.3rem"
      bg={c.accentSoft}
      color={c.accent}
      fontFamily="var(--font-brand-ui)"
      fontSize="0.6875rem"
      fontWeight="600"
      letterSpacing="0.08em"
      textTransform="uppercase"
    >
      {label}
    </Box>
  );
}
