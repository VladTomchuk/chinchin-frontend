'use client';

import { useTranslations } from 'next-intl';
import { useConsent } from './ConsentContext';
import styles from './CookieBanner.module.css';

/**
 * Питає згоду один раз (стан живе в ConsentContext + localStorage) — після
 * відповіді банер зникає й більше не зʼявляється в цій сесії/на цьому
 * пристрої. 'unset' лишається стартовим значенням до гідратації, тож банер
 * не блимає для відвідувачів, які вже відповіли раніше.
 */
export default function CookieBanner() {
  const t = useTranslations('CookieConsent');
  const { status, grant, deny } = useConsent();

  if (status !== 'unset') return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label={t('title')}>
      <p className={styles.text}>{t('text')}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={deny}>
          {t('decline')}
        </button>
        <button type="button" className={styles.accept} onClick={grant}>
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
