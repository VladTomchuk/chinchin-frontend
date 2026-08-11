'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL } from '@/components/HealthyBar/tokens';
import styles from './QuoteForm.module.css';

type Format = { name: string; text: string };

/**
 * Форма запиту пропозиції.
 *
 * Бекенд (Django) поки має тільки /api/health/ — ендпоінта для заявок немає,
 * тож надсилати нікуди. Тому кнопка збирає лист і відкриває поштовий клієнт
 * користувача: працює одразу і нічого не втрачає. Коли зʼявиться ендпоінт,
 * тут міняється лише обробник submit — розмітка та валідація лишаються.
 */
export default function QuoteForm() {
  const t = useTranslations('CorporateEvents.quote');
  const tFormats = useTranslations('CorporateEvents.formats');
  const formats = tFormats.raw('items') as Format[];

  const id = useId();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const line = (label: string, value: FormDataEntryValue | null) => `${label}: ${value ?? ''}`;

    const body = [
      line(t('eventType'), data.get('eventType')),
      line(t('date'), data.get('date')),
      line(t('guests'), data.get('guests')),
      line(t('city'), data.get('city')),
      line(t('email'), data.get('email')),
    ].join('\n');

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      t('emailSubject'),
    )}&body=${encodeURIComponent(body)}`;

    // Поштовий клієнт відкривається в окремому вікні, сторінка лишається на
    // місці — тож блокування знімаємо самі.
    setSubmitting(false);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.field} ${styles.wide}`}>
          <label className={styles.label} htmlFor={`${id}-type`}>
            {t('eventType')}
          </label>
          <select id={`${id}-type`} name="eventType" className={styles.input} required defaultValue="">
            <option value="" disabled>
              {t('eventTypePlaceholder')}
            </option>
            {formats.map((format) => (
              <option key={format.name} value={format.name}>
                {format.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-date`}>
            {t('date')}
          </label>
          <input id={`${id}-date`} name="date" type="date" className={styles.input} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-guests`}>
            {t('guests')}
          </label>
          <input
            id={`${id}-guests`}
            name="guests"
            type="number"
            min={1}
            inputMode="numeric"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-city`}>
            {t('city')}
          </label>
          <input id={`${id}-city`} name="city" type="text" className={styles.input} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-email`}>
            {t('email')}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.wide}>
          <button type="submit" className={styles.submit} disabled={submitting}>
            {t('submit')}
          </button>
        </div>
      </form>

      <p className={styles.note}>{t('note')}</p>
    </>
  );
}
