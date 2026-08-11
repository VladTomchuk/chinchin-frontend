import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import QuoteForm from './QuoteForm';

/**
 * Обгортка серверного рівня: заголовки й опис рендеряться на сервері, а
 * клієнтським лишається тільки саме поле форми.
 */
export default async function QuoteSection() {
  const t = await getTranslations('CorporateEvents.quote');

  return (
    <Section bg={c.page} id="quote" scrollMarginTop="80px">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('title')}</SectionTitle>
      <Lead mb={{ base: 8, md: 10 }}>{t('text')}</Lead>

      <QuoteForm />
    </Section>
  );
}
