import styles from './FeedbackForm.module.css';

/**
 * Спільні будівельні блоки для єдиної форми зворотного звʼязку сайту
 * (components/shared/QuoteForm/QuoteForm.tsx): розмітка поля (лейбл + інпут),
 * чекбокс згоди на обробку даних і кнопка сабміту. Раніше на сайті було дві
 * майже однакові форми (Contacts/ContactForm.tsx, CorporateEvents/QuoteForm.tsx),
 * кожна з власною копією цього шару — тепер лишився один компонент форми, а
 * цей шар усе одно живе окремо: розмітку/стиль поля можна перевикористати,
 * якщо колись зʼявиться ще одна форма поза QuoteForm.
 *
 * Сам `<input>`/`<select>`/`<textarea>` кожна форма рендерить сама (нативний
 * елемент, не обгорнутий тут): набір і типи полів у кожної форми свої,
 * спільна лише обгортка навколо них. Класи стилю (styles.input,
 * styles.textarea, styles.form, styles.success, styles.error) експортуються
 * як feedbackFormStyles — форма бере звідти те, що їй потрібно напряму.
 */
export const feedbackFormStyles = styles;

export function FormField({
  label,
  htmlFor,
  wide = false,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  wide?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? `${styles.field} ${styles.wide}` : styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.requiredMark} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function SubmitButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className={`${styles.wide} ${styles.submitRow}`}>
      <button type="submit" className={styles.submit} {...rest}>
        {children}
      </button>
    </div>
  );
}

/**
 * Чекбокс згоди на обробку персональних даних — обов'язковий для будь-якого
 * сайту, що збирає дані відвідувачів (GDPR), тож `required` тут не пропс, а
 * незмінна частина поля. Нативна валідація браузера блокує сабміт форми, поки
 * чекбокс не відмічено, до того, як спрацює onSubmit-обробник форми.
 */
export function ConsentField({
  id,
  name = 'consent',
  children,
}: {
  id: string;
  name?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.wide} ${styles.consent}`}>
      <input id={id} name={name} type="checkbox" required className={styles.consentInput} />
      <label className={styles.consentLabel} htmlFor={id}>
        {children}
      </label>
    </div>
  );
}

/**
 * Пастка для ботів: реальний відвідувач поле не бачить і не заповнює
 * (сховано в FeedbackForm.module.css), заповнений бот відсіюється на сервері
 * без сигналу, що це сталося. `id` — префікс від useId() форми-власника, щоб
 * id інпута не збігався з іншими полями на сторінці.
 */
export function Honeypot({ id }: { id: string }) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor={`${id}-company`}>Company</label>
      <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
