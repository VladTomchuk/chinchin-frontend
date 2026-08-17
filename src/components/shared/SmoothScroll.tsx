'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Плавний скрол на весь сайт (мишка/тачпад), не лише на якірні посилання чи
 * горизонтальний трек EventTypesScroll. CSS scroll-behavior:smooth (див.
 * globals.css) згладжує тільки програмні "стрибки" (scrollTo, якорі) — на
 * звичайний скрол колесом він узагалі не діє, тому для нього потрібна
 * бібліотека, яка сама перехоплює wheel/touch і анімує позицію скролу.
 *
 * Lenis не підміняє скрол-контейнер (як з .wrapper/.content не працюємо,
 * лишається window/documentElement за замовчуванням), тож усе, що вже читає
 * нативний scrollY — GSAP ScrollTrigger (хіро-галерея) і framer-motion
 * useScroll (EventTypesScroll) — і далі працює без переробок. Синхронізація
 * з ScrollTrigger — офіційний рецепт: тікер GSAP замість власного rAF, і
 * lagSmoothing вимкнено, бо його власне згладжування конфліктувало б із
 * Lenis-івським.
 *
 * respectReducedMotion (дефолт true) сам вимикає згладжування під
 * prefers-reduced-motion — окремо гейтити не треба.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      lerp: 0.09,
      smoothWheel: true,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Хіро-галерея (HeroBentoGallery) рахує позиції пінінгу один раз при
    // монтуванні. Якщо ВИЩЕ на сторінці є контент, що міняє висоту вже ПІСЛЯ
    // цього (напр. EventTypesScroll: висоту контейнера він домірює в своєму
    // ResizeObserver вже після першого рендеру), ScrollTrigger лишається зі
    // застарілими координатами — і галерея "вискакує" (position: fixed)
    // посеред чужої секції, у місці старого, вже неправильного тригера.
    // Спостерігаємо загальну висоту сторінки і на кожній зміні освіжаємо
    // ScrollTrigger — це покриває EventTypesScroll і будь-який майбутній
    // компонент з асинхронною висотою, без потреби координувати вручну.
    let refreshTimeout: ReturnType<typeof setTimeout>;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const bodyResizeObserver = new ResizeObserver(scheduleRefresh);
    bodyResizeObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimeout);
      bodyResizeObserver.disconnect();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
