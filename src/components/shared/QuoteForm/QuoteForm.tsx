'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { eventTypeSlugs, type EventTypeSlug } from '@/data/eventTypes';
import { serviceSlugs, type ServiceSlug } from '@/data/services';
import {
  ConsentField,
  FormField,
  Honeypot,
  SubmitButton,
  feedbackFormStyles as styles,
} from '@/components/shared/FeedbackForm';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Props = {
  /**
   * Прийшов зі сторінки послуги/типу події — поле показує саме цей варіант
   * як обраний, але лишається звичайним `<select>`: відвідувач може змінити
   * вибір, якщо форма не про те, за чим він прийшов.
   */
  defaultEventType?: EventTypeSlug | '';
  defaultService?: ServiceSlug | '';
};

/**
 * Єдина форма зворотного зв'язку і запиту на прорахунок для всього сайту.
 *
 * Раніше на сайті було дві різні форми (Contacts/ContactForm.tsx,
 * CorporateEvents/QuoteForm.tsx) і купа кнопок, які просто відкривали
 * mailto: у поштовому клієнті відвідувача (ServiceHero, ServiceBody,
 * HealthyBar, About, головна). Тепер це один компонент: розмітка поля,
 * кнопка й honeypot — зі спільного components/shared/FeedbackForm.tsx, сам
 * набір полів і сабміт — тут. Усі сторінки або вставляють цей компонент
 * напряму (Contacts — у своєму двоколонковому лейауті), або через
 * QuoteFormSection.tsx (сторінки послуг/подій — секція з заголовком).
 *
 * Поля "Тип події" і "Послуга" — той самий каталог, що й у data/services.ts
 * і data/eventTypes.ts: підписи беруться з тих самих перекладів
 * (ServiceItems.*.name, EventItems.*.name), що й картки каталогу, тож нове
 * значення в даних саме з'явиться і тут, без окремого списку на підтримці.
 */
export default function QuoteForm({ defaultEventType = '', defaultService = '' }: Props = {}) {
  const t = useTranslations('QuoteForm');
  const tEventItems = useTranslations('EventItems');
  const tServiceItems = useTranslations('ServiceItems');
  const locale = useLocale();

  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  // Момент, коли форма зʼявилась на екрані — не поле форми, а звичайний стан
  // компонента: боти, що постять напряму в /api/contact, це значення просто
  // не мають звідки взяти. Лінива ініціалізація useState рахує Date.now()
  // рівно один раз, при першому рендері, а не на кожен ре-рендер.
  const [renderedAt] = useState(() => Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    // Форму знімаємо в локальну змінну до await: див. той самий коментар у
    // старому ContactForm.tsx — event.currentTarget стає null після await.
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      eventType: String(data.get('eventType') ?? ''),
      service: String(data.get('service') ?? ''),
      guests: String(data.get('guests') ?? ''),
      location: String(data.get('location') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''),
      locale,
      renderedAt,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus('success');
      try {
        form.reset();
      } catch {
        // Немає чого робити — поля лишаться заповненими, не критично.
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className={styles.success}>{t('success')}</p>;
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label={t('name')} htmlFor={`${id}-name`} required>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            required
          />
        </FormField>

        <FormField label={t('email')} htmlFor={`${id}-email`} required>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            required
          />
        </FormField>

        <FormField label={t('eventType')} htmlFor={`${id}-eventType`}>
          <select
            id={`${id}-eventType`}
            name="eventType"
            className={styles.input}
            defaultValue={defaultEventType}
          >
            <option value="">{t('eventTypePlaceholder')}</option>
            {eventTypeSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {tEventItems(`${slug}.name`)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t('service')} htmlFor={`${id}-service`}>
          <select
            id={`${id}-service`}
            name="service"
            className={styles.input}
            defaultValue={defaultService}
          >
            <option value="">{t('servicePlaceholder')}</option>
            {serviceSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {tServiceItems(`${slug}.name`)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t('guests')} htmlFor={`${id}-guests`}>
          <input
            id={`${id}-guests`}
            name="guests"
            type="number"
            min={1}
            inputMode="numeric"
            className={styles.input}
          />
        </FormField>

        <FormField label={t('location')} htmlFor={`${id}-location`}>
          <input
            id={`${id}-location`}
            name="location"
            type="text"
            autoComplete="address-level2"
            className={styles.input}
          />
        </FormField>

        <FormField label={t('phone')} htmlFor={`${id}-phone`} wide>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={styles.input}
          />
        </FormField>

        <FormField label={t('message')} htmlFor={`${id}-message`} wide required>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            placeholder={t('messagePlaceholder')}
            className={`${styles.input} ${styles.textarea}`}
            required
          />
        </FormField>

        <Honeypot id={id} />

        <ConsentField id={`${id}-consent`}>
          <span className={styles.requiredMark} aria-hidden="true">
            *{' '}
          </span>
          {t('consent')}
        </ConsentField>

        <SubmitButton disabled={status === 'submitting'}>
          {status === 'submitting' ? t('submitting') : t('submit')}
        </SubmitButton>
      </form>

      {status === 'error' && <p className={styles.error}>{t('error')}</p>}
    </>
  );
}
