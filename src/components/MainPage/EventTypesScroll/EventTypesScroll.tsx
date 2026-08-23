'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Heading, Text } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { eventTypes, type EventTypeSlug } from '@/data/eventTypes';
import { c } from '@/components/shared/tokens';
import { Eyebrow, SectionTitle } from '@/components/shared/primitives';
import styles from './EventTypesScroll.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
// слайд перетинає екран. Той самий запас закладено в CSS (.photoInner inset),
// тримати їх узгодженими — інакше на краю зсуву буде видно порожню смугу.
const PARALLAX_AMPLITUDE = 100;

/**
 * Горизонтальний скрол через GSAP ScrollTrigger (pin + scrub), а не
 * попередній framer-motion (useScroll + useSpring). Причина заміни: спрінг
 * над треком був ДРУГИМ, незалежним шаром інерції поверх загальносайтового
 * Lenis-згладжування (SmoothScroll.tsx) — і на самому старті секції це
 * читалось як підвисання: скрол уже пінився, а трек ще не встиг розігнати
 * власну пружину. Тепер трек рухає єдиний scrub-tween, синхронізований з тим
 * самим Lenis-скролом, яким уже керується решта сторінки (GSAP ScrollTrigger
 * і Lenis зв'язані в SmoothScroll.tsx) — шар інерції лишається рівно один.
 *
 * pin:true сам створює пін-спейсер потрібної висоти й сам перемикає елемент
 * у position:fixed на час піна — раніше цю висоту (.container) і сам пін
 * (.sticky, position:sticky) доводилось рахувати й тримати вручну.
 *
 * Паралакс фото всередині слайдів — через containerAnimation: у кожного
 * .photoInner свій scrub, але його прогрес рахується не від реального
 * вертикального скролу, а від прогресу горизонтального tween'а (mainTween)
 * нижче. Це стандартний рецепт GSAP саме для елементів усередині пінованого
 * горизонтального треку — заміняє ручний перерахунок пікселевих діапазонів
 * (introWidth/slideWidth), який був потрібен framer-motion-версії.
 */
export default function EventTypesScroll() {
  const t = useTranslations('EventTypesScroll');
  const tItems = useTranslations('EventItems');
  const tCatalog = useTranslations('Catalog');

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      // Фолбек — нативний горизонтальний скрол з @media у module.css
      // (.container/.track там уже мають свої reduced-motion правила).
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const mainTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      track.querySelectorAll<HTMLElement>(`.${styles.slide}`).forEach((slideEl) => {
        const photoInner = slideEl.querySelector<HTMLElement>(`.${styles.photoInner}`);
        if (!photoInner) return;

        gsap.fromTo(
          photoInner,
          { x: PARALLAX_AMPLITUDE },
          {
            x: -PARALLAX_AMPLITUDE,
            ease: 'none',
            scrollTrigger: {
              trigger: slideEl,
              containerAnimation: mainTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      // Той самий рейс умов, що й у HeroBentoGallery (див. коментар там):
      // на момент цього ефекту зображення/шрифти вище могли ще не
      // домалюватися, тож getDistance() і "left"/"right"-позиції слайдів
      // усередині containerAnimation рахуються від ще не остаточного
      // лейауту. invalidateOnRefresh:true перераховує дистанцію
      // головного tween'а на НАСТУПНОМУ рефреші (напр. від ResizeObserver
      // у SmoothScroll.tsx), але паралакс-тригери слайдів створені раніше
      // й лишаються звіреними зі старою, часто занадто малою дистанцією —
      // звідси й ефект "усі паралакс-фото зіщулені в перші кілька
      // відсотків скролу", який на очах виглядає як дергання. Явний
      // рефреш одразу після побудови тригерів прибирає цю розбіжність.
      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

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

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.track} ref={trackRef}>
        <div className={styles.intro}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionTitle fontSize={{ base: '1.75rem', md: '2.5rem' }}>{t('title')}</SectionTitle>
        </div>

        {slides.map((slide, i) => {
          const body = (
            <>
              <div className={styles.photo}>
                <div className={styles.photoInner}>
                  <Image
                    src={slide.photo}
                    alt=""
                    fill
                    // .photo займає лише половину слайда (50% від 100vw, див.
                    // .photo у CSS-модулі; на мобільних — 100%, там слайд
                    // складається в колонку). sizes="100vw" тут просив у
                    // Next.js вдвічі більшу картинку, ніж реально рендериться
                    // — зайва вага/декодування на кожен кадр паралакса й був
                    // помітний внесок у "дергання" скролу.
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={i === 0}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

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
      </div>
    </div>
  );
}
