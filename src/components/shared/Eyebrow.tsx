'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { c } from './tokens';

type EyebrowProps = Omit<BoxProps, 'children'> & {
  children: React.ReactNode;
  /** onPhoto — коли підпис лежить поверх затемненого фото (той самий сенс,
   * що й tone у shared/BackLink.tsx): колір фіксований світлий, а не йде за
   * темою сторінки. За замовчуванням — onPage. */
  tone?: 'onPage' | 'onPhoto';
};

// Той самий брендовий рожевий, що BackLink.module.css бере для .onPhoto і що
// c.accent віддає в темній темі — на затемненому фото він завжди читається.
const ON_PHOTO_COLOR = '#f1d2d3';

// Єдиний підпис блоку для всього сайту: коротка акцентна риска "малює" себе
// зліва направо, текст підтягується слідом і трохи розтискає літери — блок
// одразу заявляє, що це за розділ, ще до заголовка. Спрацьовує один раз, коли
// підпис вперше потрапляє у вʼюпорт (once: true), — не смикається при
// скролі туди-сюди. Це завжди перший елемент колонки/картки, тож ліво-верхній
// кут блоку лишається структурним, а не рядком CSS.
export function Eyebrow({ children, tone = 'onPage', ...rest }: EyebrowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const prefersReducedMotion = useReducedMotion();

  // Підстраховка: якщо IntersectionObserver з якоїсь причини не спрацював
  // (вкладка стартувала прихованою, незвичний контейнер тощо), підпис не
  // повинен лишитись невидимим назавжди — це службовий текст на ~30 блоках
  // сайту, а не декор, яким можна знехтувати.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (inView) {
      setRevealed(true);
      return;
    }
    const fallback = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(fallback);
  }, [inView]);

  const visible = revealed || prefersReducedMotion;
  const color = tone === 'onPhoto' ? ON_PHOTO_COLOR : c.accent;

  return (
    <Box
      ref={ref}
      display="inline-flex"
      alignItems="center"
      gap="10px"
      mb={4}
      opacity={visible ? 1 : 0}
      transform={visible ? 'translateX(0)' : 'translateX(-14px)'}
      transition="opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)"
      {...rest}
    >
      <Box
        w="22px"
        h="2px"
        bg={color}
        flexShrink={0}
        transform={visible ? 'scaleX(1)' : 'scaleX(0)'}
        transformOrigin="left"
        transition="transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.18s"
      />
      <Text
        fontFamily="var(--font-brand-ui)"
        fontWeight="600"
        fontSize="xs"
        letterSpacing={visible ? '0.16em' : '0.02em'}
        textTransform="uppercase"
        color={color}
        whiteSpace="nowrap"
        transition="letter-spacing 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s"
      >
        {children}
      </Text>
    </Box>
  );
}
