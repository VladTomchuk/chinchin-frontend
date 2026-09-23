'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button, Heading, Text } from '@chakra-ui/react';
import { Eyebrow, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import type { ProcessStep } from '@/components/shared/ProcessSteps';
import styles from './HowWeWork.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Скільки висоти екрана припадає на перегляд одного кроку, поки секція
// запінена (GSAP домножує на кількість кроків — див. `end` нижче). Той самий
// параметр, що й VH_PER_ITEM у ServicesLateralScroll.tsx.
const VH_PER_ITEM = 0.6;

// Частка "юніта" таймлайну (один крок = 1 юніт), яку займає сам перехід між
// картками. Решта юніта — час, поки картка просто стоїть непорушно й
// читається. Той самий параметр, що й TRANSITION_FRACTION у
// ServicesLateralScroll.tsx.
const TRANSITION_FRACTION = 0.35;

/**
 * Пінована секція "як ми працюємо" для головної сторінки — за мотивами GSAP
 * ScrollTrigger "Lateral Pin Indicator" (codepen.io/GreenSock/pen/pomvabo):
 * зліва — назви кроків із суцільною рейкою-індикатором, що заповнюється
 * акцентним кольором синхронно зі скролом; праворуч — стек карток з описом
 * кроку, що перехресно проявляються під активну назву зліва.
 *
 * Один gsap.timeline() з єдиним scrollTrigger(pin+scrub) керує і кросфейдом
 * карток, і підсвіткою активної назви, і ростом рейки — той самий рецепт, що
 * й у ServicesLateralScroll.tsx/EventTypesScroll.tsx (див. коментарі там),
 * без окремого шару інерції понад загальносайтовий Lenis-скрол.
 *
 * Дані й підпис CTA беруться з того самого простору перекладів
 * (About.process), що й shared/ProcessSteps.tsx — вертикальний нумерований
 * таймлайн, який і далі показує сторінка "Про нас" через About/Process.tsx.
 * Ця секція — окрема презентація тих самих кроків спеціально для головної
 * сторінки, тому лишається самостійним компонентом, а не варіантом
 * ProcessSteps.
 */
export default function HowWeWork() {
  const t = useTranslations('About.process');
  const items = t.raw('items') as ProcessStep[];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const fill = fillRef.current;
      if (!container || !fill) return;

      // Фолбек — статичний стовпчик карток з @media у module.css (той самий
      // підхід, що й у ServicesLateralScroll.tsx). Пін/кросфейд/рейку не
      // будуємо.
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 900px)').matches
      ) {
        return;
      }

      const itemEls = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
      const cardEls = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (itemEls.length < 2 || cardEls.length !== itemEls.length) return;

      gsap.set(fill, { scaleY: 1 / itemEls.length, transformOrigin: 'top' });
      gsap.set(cardEls[0], { autoAlpha: 1, y: 0 });
      gsap.set(cardEls.slice(1), { autoAlpha: 0, y: 16 });
      gsap.set(itemEls[0], { color: 'var(--hww-accent)' });
      gsap.set(itemEls.slice(1), { color: 'var(--hww-text-muted)' });

      // Момент (у "юнітах" таймлайну), з якого крок i+1 стає активним — той
      // самий розрахунок, що й switchPoints у ServicesLateralScroll.tsx.
      const switchPoints = cardEls.slice(0, -1).map((_, i) => i + (1 - TRANSITION_FRACTION));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${cardEls.length * window.innerHeight * VH_PER_ITEM}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        const at = switchPoints[i];

        tl.to(
          card,
          { autoAlpha: 0, y: -16, duration: TRANSITION_FRACTION, ease: 'power1.inOut' },
          at,
        )
          .to(
            cardEls[i + 1],
            { autoAlpha: 1, y: 0, duration: TRANSITION_FRACTION, ease: 'power1.inOut' },
            '<',
          )
          .set(itemEls[i], { color: 'var(--hww-text-muted)' }, at)
          .set(itemEls[i + 1], { color: 'var(--hww-accent)' }, at);
      });

      // Рейка-індикатор росте від 0 до 1 лінійно протягом усього переліку
      // кроків (той самий прийом, що .fill у вихідному codepen), а не
      // окремими стрибками на кожен switchPoint — так вона читається як
      // безперервний прогрес-бар, а не як копія кольорових перемикань зліва.
      // duration береться в момент виклику — тобто довжина таймлайну БЕЗ ще
      // не доданого нижче "хвоста", інакше рейка добігала б до кінця вже
      // на передостанньому кроці.
      tl.to(fill, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0);

      // Порожній "хвіст" в 1 юніт — та сама причина, що в
      // ServicesLateralScroll.tsx: щоб довжина таймлайну дорівнювала
      // кількості кроків, а не (кількість − 1), і останній крок встигав
      // побути активним, перш ніж секція розпінюється.
      tl.to({}, { duration: 1 });
    },
    { scope: containerRef },
  );

  const cta = { label: t('briefingCta'), href: '#quote-form' };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionTitle mb={{ base: 6, md: 8 }}>{t('title')}</SectionTitle>

          <div className={styles.railWrap}>
            <div className={styles.railTrack} />
            <div className={styles.railFill} ref={fillRef} />

            <ol className={styles.list}>
              {items.map((item, i) => (
                <li
                  key={item.name}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={styles.listItem}
                >
                  <span className={styles.badge}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.itemName}>{item.name}</span>
                </li>
              ))}
            </ol>
          </div>

          <Button
            asChild
            mt={{ base: 6, md: 'auto' }}
            size="sm"
            px={6}
            alignSelf="flex-start"
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
        </div>

        <div className={styles.right}>
          {items.map((item, i) => (
            <div
              key={item.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={styles.card}
            >
              <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
              <Heading
                as="h3"
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize={{ base: 'lg', md: 'xl' }}
                color={c.text}
                mb={3}
              >
                {item.name}
              </Heading>
              <Text
                fontFamily="var(--font-brand-ui)"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight="1.7"
                color={c.textMuted}
                maxW="46ch"
              >
                {item.text}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <ul className={styles.srOnly}>
        {items.map((item) => (
          <li key={item.name}>
            {item.name} — {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
