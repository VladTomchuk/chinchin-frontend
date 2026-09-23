import { getTranslations } from 'next-intl/server';
import QuoteFormSection from '@/components/shared/QuoteForm/QuoteFormSection';

/**
 * Раніше тут була власна форма (QuoteForm.tsx, вилучена) з полем "тип події"
 * на основі форматів заходу (CorporateEvents.formats) і сабмітом через
 * mailto:. Тепер це єдина форма сайту (components/shared/QuoteForm) — поле
 * "Тип події" веде до спільного каталогу типів подій, і сторінка просто
 * підставляє свій тип (corporate-business-events) як обраний за замовчуванням.
 */
export default async function QuoteSection() {
  const t = await getTranslations('CorporateEvents.quote');

  return (
    <QuoteFormSection
      id="quote-form"
      eyebrow={t('eyebrow')}
      title={t('title')}
      text={t('text')}
      defaultEventType="corporate-business-events"
    />
  );
}
