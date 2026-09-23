'use client';

import { useTranslations } from 'next-intl';
import { WHATSAPP_URL } from '@/config/socials';
import { WhatsAppIcon } from '@/components/shared/icons/WhatsAppIcon';
import styles from './WhatsAppButton.module.css';

// Окрема кнопка, а не пункт FAB-меню: WhatsApp — головний канал зв'язку,
// тож він має бути видимий одним кліком, без розкриття меню.
export default function WhatsAppButton() {
  const t = useTranslations('WhatsApp');

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label={t('aria')}
    >
      <WhatsAppIcon />
      {/* aria-hidden: текст лише візуальний дубль — доступне ім'я вже дає
          aria-label на <a>. Без цього скрінрідер озвучив би підпис двічі. */}
      <span className={styles.label} aria-hidden>
        {t('label')}
      </span>
    </a>
  );
}
