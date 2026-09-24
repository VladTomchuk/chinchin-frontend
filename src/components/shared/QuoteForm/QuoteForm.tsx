'use client';

import { useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  eventTypeSlugs,
  extraEventTypeLabelKeys,
  extraEventTypeValues,
  type EventTypeSlug,
} from '@/data/eventTypes';
import { serviceSlugs, type ServiceSlug } from '@/data/services';
import { trackQuoteFormConversion } from '@/lib/gtag';
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
 * "Тип події" додатково має варіанти з extraEventTypeValues (data/eventTypes.ts)
 * — пункти лише для цього селекта, без картки в каталозі й власної сторінки.
 */
export default function QuoteForm({ defaultEventType = '', defaultService = '' }: Props = {}) {
  const t = useTranslations('QuoteForm');
  const tEventItems = useTranslations('EventItems');
  const tServiceItems = useTranslations('ServiceItems');
  const locale = useLocale();
  // Реальний шлях у браузері (з префіксом локалі) — команда бачить у листі,
  // з якої сторінки саме прийшла заявка (QuoteForm стоїть майже на кожній
  // сторінці сайту, і "Послуга"/"Тип події" не завжди її однозначно видають:
  // на /contacts чи головній обидва поля можуть лишитись порожніми).
  const pathname = usePathname();

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
      eventDate: String(data.get('eventDate') ?? ''),
      service: String(data.get('service') ?? ''),
      guests: String(data.get('guests') ?? ''),
      location: String(data.get('location') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''),
      locale,
      page: pathname,
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
      trackQuoteFormConversion(pathname);
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
            placeholder={`${t('name')} *`}
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
            placeholder={`${t('email')} *`}
            className={styles.input}
            required
          />
        </FormField>

        <FormField label={t('phone')} htmlFor={`${id}-phone`}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('phone')}
            className={styles.input}
          />
        </FormField>

        {/* type="date" не підтримує звичайний текстовий placeholder (браузер
            замість нього показує власну підказку формату, а на мобільному
            часто взагалі нічого) — тож тут, на відміну від решти полів,
            лейбл лишаємо видимим, а не sr-only. */}
        <FormField label={t('eventDate')} htmlFor={`${id}-eventDate`}>
          <input id={`${id}-eventDate`} name="eventDate" type="date" className={styles.input} />
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
            {extraEventTypeValues.map((value) => (
              <option key={value} value={value}>
                {t(extraEventTypeLabelKeys[value])}
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
            placeholder={t('guests')}
            className={styles.input}
          />
        </FormField>

        <FormField label={t('location')} htmlFor={`${id}-location`}>
          <input
            id={`${id}-location`}
            name="location"
            type="text"
            autoComplete="address-level2"
            placeholder={t('location')}
            className={styles.input}
          />
        </FormField>

        <FormField label={t('message')} htmlFor={`${id}-message`} wide>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            placeholder={`* ${t('messagePlaceholder')}`}
            className={`${styles.input} ${styles.textarea}`}
          />
        </FormField>

        <Honeypot id={id} />

        <ConsentField id={`${id}-consent`}>
          <span className={styles.requiredMark} aria-hidden="true">
            *{' '}
          </span>
          {t.rich('consent', {
            // Нова вкладка — щоб перегляд політики не знімав із монтування
            // цю форму (і разом з нею вже введені відвідувачем поля).
            link: (chunks) => (
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.consentLink}
              >
                {chunks}
              </Link>
            ),
          })}
        </ConsentField>

        <SubmitButton disabled={status === 'submitting'}>
          {status === 'submitting' ? t('submitting') : t('submit')}
        </SubmitButton>
      </form>

      {status === 'error' && <p className={styles.error}>{t('error')}</p>}
    </>
  );
}
