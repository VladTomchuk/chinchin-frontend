import { getTranslations } from 'next-intl/server';
import ProcessSteps, { type ProcessStep } from '@/components/shared/ProcessSteps';

/**
 * П'ять кроків від першого повідомлення до події — дані й підпис CTA беруться
 * з About.process, розмітку й стилі дає спільний
 * components/shared/ProcessSteps.tsx (та сама вертикальна нумерована
 * розкладка тепер доступна й іншим сторінкам — досить підставити свій простір
 * перекладів і посилання CTA). Кнопка скролить до вбудованої форми внизу
 * сторінки (About/FinalCta.tsx), а не відкриває mailto:.
 */
export default async function Process() {
  const t = await getTranslations('About.process');
  const items = t.raw('items') as ProcessStep[];

  return (
    <ProcessSteps
      eyebrow={t('eyebrow')}
      title={t('title')}
      items={items}
      cta={{ label: t('briefingCta'), href: '#quote-form' }}
    />
  );
}
