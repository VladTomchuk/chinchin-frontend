import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';

export default async function WhyUs() {
  const t = await getTranslations('CorporateEvents.why');

  return (
    <Section bg={c.surfaceAlt}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={6} maxW="22ch">
        {t('title')}
      </SectionTitle>
      <Lead>{t('text')}</Lead>
    </Section>
  );
}
