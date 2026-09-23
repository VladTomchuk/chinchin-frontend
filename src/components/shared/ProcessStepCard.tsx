'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useInView, useReducedMotion } from 'framer-motion';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { c, FOCUS_RING } from './tokens';
import type { ProcessStep } from './ProcessSteps';
import styles from './ProcessStepCard.module.css';

type ProcessStepCardProps = {
  index: number;
  item: ProcessStep;
  photo: string;
  isLast: boolean;
  cta?: { label: string; href: string };
};

const BADGE_SIZE = { base: '2.25rem', md: '2.75rem' };

/**
 * Один крок процесу. Ліва колонка — нумерований бейдж на суцільній "рейці":
 * лінія-конектор росте з flex="1" від бейджа до низу свого <li>, а висоту
 * рядка задає права колонка (текст) — тож рейка завжди доходить рівно до
 * наступного бейджа без ручного виміру пікселів.
 *
 * Права колонка — фото і текст, що міняються місцями через крок (reversed)
 * для ритму на широких екранах; на вузьких завжди фото зверху.
 *
 * Поява при скролі — той самий рецепт, що shared/Eyebrow.tsx: useInView
 * once + CSS transition + запасний таймаут на випадок, коли
 * IntersectionObserver з якоїсь причини не спрацював. Бейдж підсвічується
 * акцентом синхронно з появою картки — виглядає як "рейка оживає" крок за
 * кроком під час скролу, а не як статичний список.
 */
export default function ProcessStepCard({
  index,
  item,
  photo,
  isLast,
  cta,
}: ProcessStepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();

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
  const delay = prefersReducedMotion ? '0ms' : `${Math.min(index * 70, 280)}ms`;
  const reversed = index % 2 === 1;

  return (
    <Box as="li" pb={{ base: 10, md: 12 }}>
      <Flex ref={ref} align="stretch" gap={{ base: 4, md: 6 }}>
        <Flex direction="column" align="center" flexShrink={0} w={BADGE_SIZE}>
          <Flex
            align="center"
            justify="center"
            w={BADGE_SIZE}
            h={BADGE_SIZE}
            flexShrink={0}
            rounded="full"
            bg={c.surface}
            borderWidth="2px"
            borderColor={visible ? c.accent : c.line}
            color={visible ? c.accent : c.textMuted}
            fontFamily="var(--font-brand-ui)"
            fontWeight="700"
            fontSize={{ base: 'xs', md: 'sm' }}
            opacity={visible ? 1 : 0}
            transform={visible ? 'scale(1)' : 'scale(0.6)'}
            transition="opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s ease, color 0.5s ease"
            transitionDelay={delay}
          >
            {String(index + 1).padStart(2, '0')}
          </Flex>

          {!isLast && <Box flex="1" minH="2.5rem" w="2px" bg={c.line} mt={2} />}
        </Flex>

        <Flex
          flex="1"
          direction={{ base: 'column', md: reversed ? 'row-reverse' : 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          gap={{ base: 5, md: 8 }}
          opacity={visible ? 1 : 0}
          transform={visible ? 'translateY(0)' : 'translateY(24px)'}
          transition="opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)"
          transitionDelay={delay}
        >
          <Box
            position="relative"
            w={{ base: '100%', md: '38%' }}
            aspectRatio="4 / 3"
            flexShrink={0}
            rounded="xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor={c.line}
            className={styles.photoFrame}
          >
            <Image
              src={photo}
              alt=""
              fill
              sizes="(max-width: 48em) 100vw, 38vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>

          <Box flex="1">
            <Heading
              as="h3"
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="md"
              color={c.text}
              mb={2}
            >
              {item.name}
            </Heading>

            <Text
              fontFamily="var(--font-brand-ui)"
              fontSize="sm"
              lineHeight="1.7"
              color={c.textMuted}
              maxW="52ch"
            >
              {item.text}
            </Text>

            {index === 0 && cta && (
              <Button
                asChild
                mt={5}
                size="sm"
                px={6}
                rounded="full"
                bg={c.accent}
                color={c.accentContrast}
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                transition="opacity 200ms ease"
                _hover={{ opacity: 0.86, textDecoration: 'none' }}
                _focusVisible={FOCUS_RING}
              >
                <a href={cta.href}>{cta.label}</a>
              </Button>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
