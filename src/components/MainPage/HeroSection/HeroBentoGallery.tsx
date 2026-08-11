'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExpoScaleEase } from 'gsap/EasePack';
import { clearHeroZoom, setHeroZoom } from './heroZoom';
import styles from './HeroBentoGallery.module.css';

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, ExpoScaleEase);

// Порядок = позиція в bento-сітці (див. nth-child у HeroBentoGallery.module.css).
// Плитка №3 — центральна: вона розтягується на весь екран у кінці скролу.
const PHOTOS = [
  { src: '/hero/hero-01.jpg', alt: '' },
  { src: '/hero/hero-02.jpg', alt: '' },
  { src: '/hero/hero-03.jpg', alt: '' },
  { src: '/hero/hero-04.jpg', alt: '' },
  { src: '/hero/hero-05.jpg', alt: '' },
  { src: '/hero/hero-06.jpg', alt: '' },
  { src: '/hero/hero-07.jpg', alt: '' },
  { src: '/hero/hero-08.jpg', alt: '' },
];

const CENTER_INDEX = 2;

export default function HeroBentoGallery() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const gallery = galleryRef.current;
      if (!wrap || !gallery) return;

      let ctx: gsap.Context | undefined;

      const build = () => {
        ctx?.revert();
        gallery.classList.remove(styles.final);

        ctx = gsap.context(() => {
          const items = gallery.querySelectorAll<HTMLElement>(`.${styles.item}`);

          // Тимчасово вмикаємо кінцевий стан, щоб Flip зняв із нього координати.
          gallery.classList.add(styles.final);
          const flipState = Flip.getState(items);
          gallery.classList.remove(styles.final);

          const flip = Flip.to(flipState, { simple: true, ease: 'expoScale(1, 5)' });

          // Дробову частину end відкидаємо: позиції скролу цілі, і без цього
          // на самому кінці зуму лишався б піксель, де фото вже відкрите, а
          // навбар ще вважає, що ні.
          const publish = (self: ScrollTrigger, complete: boolean) =>
            setHeroZoom(Math.floor(self.end), complete);

          gsap
            .timeline({
              scrollTrigger: {
                trigger: gallery,
                start: 'center center',
                end: '+=100%',
                scrub: true,
                pin: wrap,
                onRefresh: (self) => publish(self, self.progress >= 1),
                onLeave: (self) => publish(self, true),
                onEnterBack: (self) => publish(self, false),
              },
            })
            .add(flip);

          // Галерея — перший елемент сторінки, і дистанцію скролу цілком
          // створює pin-spacer. Поки ScrollTrigger не перерахував розміри,
          // ця дистанція нульова, тому міряємо явно після верстки кадру.
          ScrollTrigger.refresh();

          return () => gsap.set(items, { clearProps: 'all' });
        }, wrap);
      };

      build();

      // Знятий Flip-стан прив'язаний до розміру вікна, тому на ресайзі його
      // треба перезняти. Висоту ігноруємо: на мобільних вона стрибає від
      // згортання адресного рядка, а це не привід перебудовувати анімацію.
      let lastWidth = window.innerWidth;
      let debounce: ReturnType<typeof setTimeout>;

      const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearTimeout(debounce);
        debounce = setTimeout(build, 200);
      };

      window.addEventListener('resize', onResize);

      return () => {
        clearTimeout(debounce);
        window.removeEventListener('resize', onResize);
        ctx?.revert();
        clearHeroZoom();
      };
    },
    { scope: wrapRef },
  );

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.gallery} ref={galleryRef}>
        {PHOTOS.map((photo, i) => (
          <div className={styles.item} key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              // Уся сітка — це перший екран, тож лінива підвантажка тут тільки
              // дала б помітний «проявляючий» ефект. Прелоадимо лише центральну,
              // решту просто вантажимо одразу.
              priority={i === CENTER_INDEX}
              loading={i === CENTER_INDEX ? undefined : 'eager'}
              // На зумі плитки доростають до 100vw, але повністю кадр займає
              // тільки центральна — сусіднім вистачає роздільної здатності
              // приблизно на половину екрана.
              sizes={i === CENTER_INDEX ? '100vw' : '(max-width: 768px) 100vw, 66vw'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
