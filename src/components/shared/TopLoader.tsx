'use client';

import { useEffect, useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { useColorModeValue } from '@/components/ui/color-mode';
import { c } from './tokens';

/**
 * Тонка смужка прогресу зверху сторінки на час клієнтського переходу
 * (next-intl Link/router). App Router сам не дає події «навігація почалась» —
 * бібліотека ловить її, перехоплюючи history.pushState, і це єдиний спосіб
 * показати щось у момент кліку, до того як прийде RSC-відповідь нової
 * сторінки (loading.tsx з'являється вже після старту навігації, і то не
 * завжди — тільки коли є власний loading.tsx в сегменті).
 *
 * Курсор-очікування на час завантаження — не тут: NextTopLoader збудований
 * на nprogress, а той сам вішає клас `nprogress-busy` на <html> на весь час
 * бару (nprogress.js, addClass/removeClass). Досить прив'язати cursor:
 * progress до цього класу в globals.css — без окремого стану чи ефекту.
 */
export default function TopLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Акцент теми: олива на світлій, брендовий рожевий на темній (той самий
  // c.accent, що й на кнопках). До монтування тема ще невідома — лишаємось
  // на світлому значенні, інакше перший рендер розійшовся б між сервером і
  // клієнтом.
  const accent = useColorModeValue(c.accent.base, c.accent._dark);
  const color = mounted ? accent : c.accent.base;

  return <NextTopLoader color={color} showSpinner={false} height={3} shadow={false} />;
}
