'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { Heading, Text } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { eventTypes, type EventTypeSlug } from '@/data/eventTypes';
import { c } from '@/components/shared/tokens';
import { Eyebrow, SectionTitle } from '@/components/shared/primitives';
import styles from './EventTypesScroll.module.css';

type Slide = {
  key: string;
  photo: string;
  name: string;
  description: string;
  href?: { pathname: '/events/[slug]'; params: { slug: EventTypeSlug } };
};

// Фото — ті самі кадри, що й у бенто-галереї хіро-секції (public/hero):
// вони не привʼязані до конкретного типу події (див. коментар у
// data/eventPhotos.ts про те, що прив'язки кадрів ще нема), тож тут це суто
// декоративна атмосфера, а не ілюстрація саме цього формату. Тому alt="" —
// фото не несе унікальної інформації, її вже дає текст поруч.
const DECORATIVE_PHOTOS = [
  '/hero/ice26.jpeg',
  '/hero/piramyde.jpg',
  '/hero/hero-03.jpg',
  '/hero/hero-04.jpg',
  '/hero/hero-05.jpg',
  '/hero/hero-06.jpg',
  '/hero/hero-07.jpg',
  '/hero/hero-08.jpg',
];

// ТИМЧАСОВО: заглушки, щоб на екрані було видно повноцінний ефект скролу —
// реальних типів подій поки лише два. Прибрати цей масив і .concat нижче,
// коли eventTypes.ts поповниться настільки, що заглушки стануть зайвими.
// Позначка "Заглушка" в тексті відрізняє їх від реального контенту.
const PLACEHOLDER_SLIDES: Omit<Slide, 'href' | 'photo'>[] = [
  {
    key: 'placeholder-birthday',
    name: 'Заглушка: День народження',
    description: 'Тимчасова картка для перевірки скролу — не реальний тип події.',
  },
  {
    key: 'placeholder-tasting',
    name: 'Заглушка: Дегустація',
    description: 'Тимчасова картка для перевірки скролу — не реальний тип події.',
  },
];

// На скільки пікселів фото всередині рамки зміщується за весь час, поки його
// слайд перетинає екран. Помірно, щоб читалось як глибина, а не як тряска.
const PARALLAX_AMPLITUDE = 100;

type ParallaxPhotoProps = {
  src: string;
  priority?: boolean;
  x: MotionValue<number>;
  /** Пікселевий діапазон x (глобального зсуву треку), у якому саме цей слайд
   *  перетинає екран — від щойно з'явився праворуч до щойно зник ліворуч. */
  range: [number, number];
  disabled: boolean;
};

// Фото зміщується всередині своєї рамки повільніше за сам трек: поки слайд
// проїжджає екран, картинка ледь відстає від рамки, що й читається як
// паралакс-глибина. Окремий компонент — бо useTransform не можна викликати
// всередині .map() у батьківському компоненті (порушує rules-of-hooks), а
// один спільний виклик на всі слайди дав би той самий зсув для кожного фото
// одночасно, незалежно від того, яке з них зараз у кадрі.
function ParallaxPhoto({ src, priority, x, range, disabled }: ParallaxPhotoProps) {
  const imgX = useTransform(x, range, [PARALLAX_AMPLITUDE, -PARALLAX_AMPLITUDE]);

  return (
    <div className={styles.photo}>
      <motion.div className={styles.photoInner} style={disabled ? undefined : { x: imgX }}>
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </motion.div>
    </div>
  );
}

// Горизонтальний скрол за мотивами motion.dev/examples/react-scroll-horizontal:
// вертикальний скрол по високій .container керує горизонтальним зсувом .track
// через useScroll + useTransform. Кожен слайд — на весь екран (фото/текст
// пополам), тож дистанція зсуву вимірюється з реального DOM (а не зашита
// числом) і перераховується на resize.
export default function EventTypesScroll() {
  const t = useTranslations('EventTypesScroll');
  const tItems = useTranslations('EventItems');
  const tCatalog = useTranslations('Catalog');
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [scrollVh, setScrollVh] = useState(100);
  // Ширина .intro і слайду потрібні окремо від distance, щоб порахувати
  // пікселевий діапазон x, у якому кожен конкретний слайд перетинає екран
  // (для паралаксу фото всередині нього — див. ParallaxPhoto).
  const [introWidth, setIntroWidth] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

  // PACE_VH_PER_SCREEN — скільки vh скролу припадає на кожен повний екран
  // горизонтального шляху. Слайди на всю ширину екрана, тож дистанція вже
  // сама по собі гарантовано перевищує viewport (на відміну від вузьких
  // карток раніше, де стеля ширини "з'їдала" запас на широких моніторах).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const PACE_VH_PER_SCREEN = 70;

    const measure = () => {
      const winW = window.innerWidth;
      const d = Math.max(0, track.scrollWidth - winW);
      setDistance(d);
      setScrollVh(100 + (d / winW) * PACE_VH_PER_SCREEN);
      setIntroWidth(introRef.current?.getBoundingClientRect().width ?? 0);
      setSlideWidth(winW);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  // М'який скрол: трек не стрибає точно за позицією скролу, а з інерцією
  // "наздоганяє" її. Це накладається поверх загальносайтового Lenis-згладжування
  // (SmoothScroll.tsx) — тут своя, додаткова пружина саме для горизонтального
  // руху треку, м'якша за початкову, щоб рух читався як плинний, а не пружний.
  const x = useSpring(xRaw, { stiffness: 120, damping: 20, mass: 0.5 });

  const slides: Slide[] = [
    ...eventTypes.map((eventType, i) => ({
      key: eventType.slug,
      photo: DECORATIVE_PHOTOS[i % DECORATIVE_PHOTOS.length],
      name: tItems(`${eventType.slug}.name`),
      description: tItems(`${eventType.slug}.shortDescription`),
      href: { pathname: '/events/[slug]' as const, params: { slug: eventType.slug } },
    })),
    ...PLACEHOLDER_SLIDES.map((slide, i) => ({
      ...slide,
      photo: DECORATIVE_PHOTOS[(eventTypes.length + i) % DECORATIVE_PHOTOS.length],
    })),
  ];

  const containerHeight = prefersReducedMotion ? 'auto' : `${scrollVh}vh`;

  return (
    <div className={styles.container} ref={containerRef} style={{ height: containerHeight }}>
      <div className={styles.sticky}>
        <motion.div
          className={styles.track}
          ref={trackRef}
          style={prefersReducedMotion ? undefined : { x }}
        >
          <div className={styles.intro} ref={introRef}>
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <SectionTitle fontSize={{ base: '1.75rem', md: '2.5rem' }}>{t('title')}</SectionTitle>
          </div>

          {slides.map((slide, i) => {
            const left = introWidth + i * slideWidth;
            const range: [number, number] = [-(left + slideWidth), -(left - slideWidth)];

            const body = (
              <>
                <ParallaxPhoto
                  src={slide.photo}
                  priority={i === 0}
                  x={x}
                  range={range}
                  disabled={!!prefersReducedMotion}
                />

                <div className={styles.textPane}>
                  {!slide.href && <Eyebrow>Заглушка</Eyebrow>}

                  <Heading
                    as="h3"
                    fontFamily="var(--font-brand-ui)"
                    fontWeight="600"
                    fontSize={{ base: 'xl', md: '2xl' }}
                    color={c.text}
                    mb={4}
                  >
                    {slide.name}
                  </Heading>

                  <Text
                    fontFamily="var(--font-brand-ui)"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight="1.7"
                    color={c.textMuted}
                    mb={6}
                    maxW="46ch"
                  >
                    {slide.description}
                  </Text>

                  {slide.href && (
                    <div className={styles.cta}>
                      {tCatalog('cta')}
                      <LuArrowRight size={16} aria-hidden />
                    </div>
                  )}
                </div>
              </>
            );

            return slide.href ? (
              <Link
                key={slide.key}
                href={slide.href}
                aria-label={slide.name}
                className={styles.slide}
              >
                {body}
              </Link>
            ) : (
              <div key={slide.key} className={styles.slide}>
                {body}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
