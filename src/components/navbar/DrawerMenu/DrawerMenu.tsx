'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Portal } from '@chakra-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { CiMenuFries } from 'react-icons/ci';
import { LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useColorModeValue } from '@/components/ui/color-mode';
import { visibleNavItems } from '@/config/navigation';
import styles from './DrawerMenu.module.css';

const MENU_ID = 'navbar-menu';

// Та сама межа, що й у CSS-модулі. На широких екранах пункти випадають з-під
// кнопки і залітають збоку; на вузьких вони по центру екрана, і рух іде знизу —
// збоку там було б «нізвідки».
const WIDE_SCREEN = '(min-width: 48em)';

function useIsWideScreen() {
  // Стартуємо з false: на сервері вікна немає, і будь-яке інше значення дало б
  // розбіжність під час гідрації.
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(WIDE_SCREEN);
    const sync = () => setIsWide(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return isWide;
}

export default function DrawerMenu() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const t = useTranslations('Navbar');
  const isWide = useIsWideScreen();
  const reduceMotion = useReducedMotion();
  const items = visibleNavItems();

  const buttonColorValue = useColorModeValue('brand.darkText', 'brand.lightPink');
  const buttonColor = mounted ? buttonColorValue : 'brand.lightPink';

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      // Повертаємо фокус на кнопку, інакше після закриття він лишиться на
      // елементі, якого вже немає в DOM.
      triggerRef.current?.focus();
    };

    // Поки меню відкрите, сторінка під ним не прокручується. Ширину смуги
    // прокрутки компенсуємо падінгом: якщо цього не зробити, у момент
    // блокування смуга зникає і весь контент стрибає вбік на її ширину.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  const listVariants: Variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        visible: { transition: { staggerChildren: 0.07 } },
      };

  const itemVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0, transition: { duration: 0 } },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: isWide
          ? { opacity: 0, x: 32, transition: { duration: 0.15 } }
          : { opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.15 } },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 380, damping: 26 },
        },
      };

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        color={buttonColor}
        mx={1}
        aria-label={open ? t('closeMenu') : t('openMenu')}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
      >
        {/* Іконка довертається на 90°, а не просто підміняється — так перехід
            між ☰ і × читається як один рух. */}
        <motion.span
          style={{ display: 'grid', placeItems: 'center' }}
          animate={{ rotate: open ? 90 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 22 }}
        >
          {open ? <LuX /> : <CiMenuFries />}
        </motion.span>
      </Button>

      {/* Портал — обов'язково: у шапки є transform (вона ховається при скролі),
          а це робить її containing block для position: fixed усередині. Без
          порталу меню позиціонувалось би відносно шапки, а не вікна. */}
      <Portal>
        {open && (
          <button
            type="button"
            className={styles.backdrop}
            aria-label={t('closeMenu')}
            tabIndex={-1}
            onClick={close}
          />
        )}

        <AnimatePresence>
          {open && (
            <motion.ul
              id={MENU_ID}
              className={styles.menu}
              aria-label={t('menuTitle')}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {items.map((item) => {
                // ТИМЧАСОВО: іконки біля пунктів прибрані. Щоб повернути —
                // розкоментувати блок нижче разом із `const { Icon } = item;`
                // та правилом .link у мобільній медіа-секції CSS-модуля.
                // const { Icon } = item;

                const content = (
                  <>
                    <span className={styles.label}>{t(item.key)}</span>
                    {/*
                    Колір не задаємо пропом: кружечок залитий акцентом, і
                    гліф має брати контрастний currentColor із CSS.
                    <span className={styles.icon}>
                      <Icon size={20} aria-hidden />
                    </span>
                    */}
                  </>
                );

                return (
                  <motion.li
                    key={item.key}
                    variants={itemVariants}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    {item.kind === 'internal' ? (
                      <Link href={item.href} className={styles.link} onClick={close}>
                        {content}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                      >
                        {content}
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
