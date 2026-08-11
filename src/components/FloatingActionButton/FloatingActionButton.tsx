'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LuPlus } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { FAB_ITEMS } from './config';
import styles from './FloatingActionButton.module.css';

const MENU_ID = 'fab-menu';

export default function FloatingActionButton() {
  const t = useTranslations('Fab');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  // Пункти без адреси не показуємо: краще коротше меню, ніж посилання в нікуди.
  const items = FAB_ITEMS.filter((item) => item.href.length > 0);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      // Повертаємо фокус на кнопку, інакше після закриття він залишиться на
      // елементі, якого вже немає в DOM, і клавіатура «випаде» на початок сторінки.
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Пружина дає той самий «пружний» вихід, що й у прикладі motion.dev. Якщо в
  // системі увімкнено зменшення анімацій — лишаємо чисту появу без руху.
  const listVariants: Variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { transition: { staggerChildren: 0.04, staggerDirection: 1 } },
        visible: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
      };

  const itemVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0, transition: { duration: 0 } },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, y: 16, scale: 0.8, transition: { duration: 0.15 } },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
      };

  return (
    <>
      {/* Без AnimatePresence: підкладка нічого не анімує, їй достатньо зникнути. */}
      {open && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label={t('close')}
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}

      <nav className={styles.root} aria-label={t('nav')}>
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
              {items.map((item) => {
                const { Icon } = item;
                const label = t(item.key);

                const content = (
                  <>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.icon}>
                      <Icon size={20} aria-hidden />
                    </span>
                  </>
                );

                return (
                  <motion.li
                    key={item.key}
                    variants={itemVariants}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    {item.kind === 'internal' ? (
                      <Link href={item.href} className={styles.link} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
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

        <motion.button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={MENU_ID}
          aria-label={open ? t('close') : t('open')}
          onClick={() => setOpen((value) => !value)}
          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        >
          {/* 135°, а не 90°: плюс доходить до хрестика й трохи «перекручується»,
              як у прикладі-референсі. */}
          <motion.span
            style={{ display: 'grid', placeItems: 'center' }}
            animate={{ rotate: open ? 135 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 22 }}
          >
            <LuPlus size={26} aria-hidden />
          </motion.span>
        </motion.button>
      </nav>
    </>
  );
}
