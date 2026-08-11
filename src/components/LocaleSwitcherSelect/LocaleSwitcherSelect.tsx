'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@chakra-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Locale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useColorModeValue } from '@/components/ui/color-mode';
import styles from './LocaleSwitcher.module.css';

const MENU_ID = 'locale-menu';

export type LocaleOption = {
  value: string;
  label: string;
};

type Props = {
  items: LocaleOption[];
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({ items, defaultValue, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  // Потрібні, щоб перемкнути мову на сторінці з динамічним сегментом
  // (/services/[slug]) — без них next-intl не знає, чим його підставити.
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const colorValue = useColorModeValue('brand.darkText', 'brand.lightPink');
  const color = mounted ? colorValue : 'brand.lightPink';

  const current = items.find((item) => item.value === defaultValue);
  // У списку показуємо тільки те, на що можна перемкнутись: поточна мова вже
  // написана на самій кнопці, і дублювати її пунктом немає сенсу.
  const options = items.filter((item) => item.value !== defaultValue);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      // Повертаємо фокус на кнопку, інакше після закриття він лишиться на
      // елементі, якого вже немає в DOM.
      triggerRef.current?.focus();
    };

    // Замість підкладки — слухач на документі. Підкладка з position: fixed тут
    // не спрацювала б: у шапки є transform, а він робить її containing block
    // для fixed усередині.
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  const listVariants: Variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        visible: { transition: { staggerChildren: 0.06 } },
      };

  // Список розкривається вниз, тож пункти й приїжджають згори.
  const itemVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0, transition: { duration: 0 } },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.15 } },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 380, damping: 26 },
        },
      };

  function selectLocale(nextLocale: string) {
    setOpen(false);

    startTransition(() => {
      router.replace(
        // @ts-expect-error — pathname і params беруться з поточного маршруту, тож
        // разом вони завжди валідні. Довести це типами не можна: для динамічних
        // сегментів (/services/[slug]) TypeScript не бачить звʼязку між
        // конкретним pathname і набором params, який до нього підходить.
        { pathname, params },
        { locale: nextLocale as Locale },
      );
    });
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <Button
        ref={triggerRef}
        variant="outline"
        color={color}
        // Ширина фіксована, щоб кнопка не була вужчою за сусідні іконкові і не
        // стрибала, якщо колись зʼявиться код мови довший за два символи.
        minW="12"
        justifyContent="center"
        // Без цього кнопка бере Arial із body, а пункти списку — Manrope, і
        // поруч це видно. Форма в них однакова, тож і шрифт має бути один.
        fontFamily="var(--font-brand-ui)"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={MENU_ID}
        disabled={isPending}
        opacity={isPending ? 0.6 : 1}
        transition="opacity 0.2s ease"
        onClick={() => setOpen((value) => !value)}
      >
        {current?.label ?? defaultValue.toUpperCase()}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={MENU_ID}
            className={styles.menu}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {options.map((item) => (
              <motion.li
                key={item.value}
                variants={itemVariants}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              >
                <button
                  type="button"
                  className={styles.option}
                  lang={item.value}
                  onClick={() => selectLocale(item.value)}
                >
                  {item.label}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
