'use client';

import { useTranslations } from 'next-intl';
import { WHATSAPP_URL } from '@/config/socials';
import styles from './WhatsAppButton.module.css';

// Не react-icons/fa: FaWhatsapp там теж суцільна, але через власний SVG маємо
// той самий контур і fillRule="evenodd", що й у референсі, — тож слухавка
// всередині бульбашки гарантовано вирізана "діркою", а не залита поверх.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" aria-hidden>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2.1 22l5.35-1.4a9.8 9.8 0 0 0 4.59 1.16h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.77 9.77 0 0 0 12.04 2Zm4.49 11.89c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.18 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

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
