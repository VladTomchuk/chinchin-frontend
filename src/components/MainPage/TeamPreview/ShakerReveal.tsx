import Image from 'next/image';
import { Box } from '@chakra-ui/react';

// Декоративний шейкер справа від тексту — брендовий малюнок в акцентному
// кольорі теми: золотий на світлій, рожевий на темній (shaker-green-up.svg /
// shaker-light-up.svg — та сама форма, лише інша заливка, тож перемикання
// теми суто CSS (_dark), без клієнтського JS). Малюнок повернутий на 90°
// проти годинникової стрілки (вліво); щоб повернутий вміст не обрізався, у
// зовнішнього .box ширина/висота обмінені місцями порівняно з вихідним SVG,
// а сам поворот + центрування — на внутрішньому wrapper'і з фіксованими
// вихідними розмірами. Статична картинка, без анімації/скрол-залежностей.
export default function ShakerReveal() {
  return (
    <Box position="relative" w="552px" h="420px" flexShrink={0} aria-hidden="true">
      <Box
        position="absolute"
        top="50%"
        left="50%"
        w="420px"
        h="552px"
        style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
      >
        <Box position="absolute" inset={0} display={{ base: 'block', _dark: 'none' }}>
          <Image src="/svg/shaker-green-up.svg" alt="" fill style={{ objectFit: 'contain' }} />
        </Box>
        <Box position="absolute" inset={0} display={{ base: 'none', _dark: 'block' }}>
          <Image src="/svg/shaker-light-up.svg" alt="" fill style={{ objectFit: 'contain' }} />
        </Box>
      </Box>
    </Box>
  );
}
