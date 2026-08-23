'use client';

import { useEffect, useRef } from 'react';
import styles from './LoadingCursor.module.css';

/**
 * Підміняє системний курсор на бренд-іконку (hands.svg), що крутиться й
 * слідує за мишкою, поки триває клієнтський перехід між сторінками.
 *
 * Сигнал «зараз завантаження» той самий, що й у globals.css для
 * cursor: none, — клас nprogress-busy, який TopLoader (nextjs-toploader,
 * побудований на nprogress) сам вішає на <html> на весь час бару. Слухаємо
 * його через MutationObserver, а не власний стан: TopLoader не віддає
 * pending-подію напряму, а дублювати логіку «почалась навігація» в двох
 * місцях — джерело розсинхрону.
 *
 * Позиція курсора оновлюється напряму через ref/style, а не React-стан:
 * mousemove стріляє надто часто для ре-рендерів, а самому елементу не
 * потрібен жоден React-стан — досить position: fixed + transform.
 */
export default function LoadingCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (event: MouseEvent) => {
      if (!busyRef.current) return;
      wrap.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };

    const syncBusy = () => {
      const busy = document.documentElement.classList.contains('nprogress-busy');
      busyRef.current = busy;
      wrap.style.opacity = busy ? '1' : '0';
    };

    const observer = new MutationObserver(syncBusy);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    syncBusy();

    window.addEventListener('mousemove', onMove);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- декоративна
          іконка курсора: фіксований малий розмір, next/image тут нічого не
          оптимізує, лише додає зайвий шар. */}
      <img src="/hands.svg" alt="" className={styles.spin} />
    </div>
  );
}
