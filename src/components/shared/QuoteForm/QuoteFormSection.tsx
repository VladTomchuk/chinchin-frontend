import { getTranslations } from 'next-intl/server';
import type { EventTypeSlug } from '@/data/eventTypes';
import type { ServiceSlug } from '@/data/services';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import QuoteForm from './QuoteForm';

type Props = {
  /** Якір для кнопок-скролів (ServiceHero, HealthyBar/About Hero тощо). */
  id?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  defaultEventType?: EventTypeSlug;
  defaultService?: ServiceSlug;
};

/**
 * Обгортка "секція з заголовком" навколо єдиної QuoteForm.tsx — той самий
 * шаблон, що раніше жив окремо в CorporateEvents/QuoteSection.tsx. Без
 * власного eyebrow/title/text бере загальний текст сторінки контактів
 * (Contacts.form) — підходить як дефолт для сторінок без власного заклику
 * (головна, шаблонна сторінка типу події).
 */
export default async function QuoteFormSection({
  id = 'quote-form',
  eyebrow,
  title,
  text,
  defaultEventType,
  defaultService,
}: Props) {
  const t = await getTranslations('Contacts.form');

  return (
    <Section id={id} scrollMarginTop="80px">
      <Eyebrow>{eyebrow ?? t('eyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{title ?? t('title')}</SectionTitle>
      <Lead mb={{ base: 8, md: 10 }}>{text ?? t('text')}</Lead>

      <QuoteForm defaultEventType={defaultEventType} defaultService={defaultService} />
    </Section>
  );
}
