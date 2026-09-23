'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LuChevronLeft, LuChevronRight, LuQuote } from 'react-icons/lu';
import type { Locale } from '@/i18n/routing';
import { BCP47_LOCALE } from '@/config/site';
import type { Review } from '@/lib/reviews';
import Stars from '@/components/GoogleReviews/Stars';
import styles from './ReviewsCarousel.module.css';

// Наскільки далеко треба протягнути картку, щоб відпускання перемкнуло слайд
// (той самий перевірений поріг, що й у EventServicesSlider).
const DRAG_THRESHOLD_PX = 60;

type ReviewsCarouselProps = {
  reviews: Review[];
  locale: Locale;
};

/**
 * Карусель відгуків Google на головній — заміна попередньої піновано-
 * скролжокейної версії (GSAP ScrollTrigger: секція займала весь екран і
 * перемикала відгук по одному лише в такт прокрутки сторінки, без стрілок,
 * крапок чи можливості спокійно повернутись до попереднього відгуку інакше,
 * ніж прокруткою вгору).
 *
 * Тут перемикання не привʼязане до скролу сторінки: один відгук на екран,
 * стрілки, клікабельна пагінація крапками, свайп пальцем і стрілки
 * клавіатури. Секція лишається у звичайному потоці сторінки (не pin,
 * не 100vh) — блок можна проминути звичайним скролом, не «застрягаючи» в
 * ньому.
 *
 * Індекс — по колу, як і в EventServicesSlider: стрілка «далі» на останньому
 * відгуку веде на перший, а не впирається в край.
 */
export default function ReviewsCarousel({ reviews, locale }: ReviewsCarouselProps) {
  const t = useTranslations('Reviews');

  const [index, setIndex] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Той самий компроміс ref/state, що й у EventServicesSlider: сам жест
  // читають обробники в межах одного потоку pointerdown → pointermove →
  // pointerup, де ререндер (і React-стейт у замиканні) не встигає оновитись.
  const dragStartX = useRef(0);
  const dragging = useRef(false);

  const slideCount = reviews.length;

  const wrapIndex = useCallback(
    (next: number) => ((next % slideCount) + slideCount) % slideCount,
    [slideCount],
  );

  const goTo = useCallback((next: number) => setIndex(wrapIndex(next)), [wrapIndex]);

  const step = useCallback(
    (delta: number) => setIndex((prev) => wrapIndex(prev + delta)),
    [wrapIndex],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Мишею доріжку не тягнуть: на десктопі перемикають стрілки, крапки й
    // клавіші, а свайп лишається пальцю й стилусу (той самий підхід, що й у
    // EventServicesSlider).
    if (e.pointerType === 'mouse') return;
    if (e.button !== 0) return;

    dragStartX.current = e.clientX;
    dragging.current = true;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setDragDx(e.clientX - dragStartX.current);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;

    if (dx <= -DRAG_THRESHOLD_PX) step(1);
    else if (dx >= DRAG_THRESHOLD_PX) step(-1);

    dragging.current = false;
    setIsDragging(false);
    setDragDx(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        role="group"
        aria-roledescription={t('carousel')}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={styles.track}
          style={{ '--rc-index': index, '--rc-drag': `${dragDx}px` } as React.CSSProperties}
        >
          {reviews.map((review) => (
            <div className={styles.slide} key={review.id}>
              <ReviewQuoteCard review={review} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Стрілки й крапки ховаються, коли перемикати нема на що (Places API
          іноді віддає лише один відгук) — керування без пункту призначення
          тільки заплутало б. */}
      {slideCount > 1 && (
        <div className={styles.navRow}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => step(-1)}
            aria-label={t('prev')}
          >
            <LuChevronLeft size={20} aria-hidden />
          </button>

          <div className={styles.dots}>
            {reviews.map((review, i) => (
              <button
                key={review.id}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                aria-label={t('goToReview', { index: i + 1 })}
                aria-current={i === index || undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={() => step(1)}
            aria-label={t('next')}
          >
            <LuChevronRight size={20} aria-hidden />
          </button>
        </div>
      )}

      {/* Стрілки/крапки не озвучують сам факт перемикання — лише озвучують
          можливість його зробити. aria-live тут закриває цю прогалину для
          читалки (той самий підхід, що й .srOnly в EventServicesSlider). */}
      <span className={styles.srOnly} aria-live="polite">
        {t('counter', { current: index + 1, total: slideCount })}
      </span>
    </div>
  );
}

function ReviewQuoteCard({ review, locale }: { review: Review; locale: Locale }) {
  // Дату форматуємо самі: relativePublishTimeDescription від Google локалізовано,
  // але його може не бути, і машинозчитуваного значення воно не дає (той самий
  // підхід, що й у GoogleReviews.tsx).
  const published = review.publishTime ? new Date(review.publishTime) : null;
  const absoluteDate =
    published && !Number.isNaN(published.getTime())
      ? new Intl.DateTimeFormat(BCP47_LOCALE[locale], { year: 'numeric', month: 'long' }).format(
          published,
        )
      : '';

  return (
    <article className={styles.card}>
      <LuQuote className={styles.quoteMark} size={36} aria-hidden />

      <div className={styles.header}>
        {review.author.photoUri ? (
          <div className={styles.avatar}>
            <Image src={review.author.photoUri} alt="" fill sizes="48px" />
          </div>
        ) : (
          <div className={styles.avatarFallback} aria-hidden>
            {review.author.displayName.trim().charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.meta}>
          <span className={styles.name}>{review.author.displayName}</span>
          <div className={styles.sub}>
            <Stars rating={review.rating} label={`${review.rating}/5`} />
            {(review.relativeTime || absoluteDate) && (
              <time dateTime={review.publishTime || undefined} className={styles.date}>
                {review.relativeTime || absoluteDate}
              </time>
            )}
          </div>
        </div>
      </div>

      {/* tabIndex — щоб довгий відгук можна було догортати з клавіатури
          (Tab на картку, тоді стрілки/Page Down): сама .viewport забирає
          собі ArrowLeft/ArrowRight під перемикання слайдів. */}
      <p className={styles.text} tabIndex={0}>
        {review.text}
      </p>
    </article>
  );
}
