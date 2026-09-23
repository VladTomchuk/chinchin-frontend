import { Grid } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import QuoteForm from '@/components/shared/QuoteForm/QuoteForm';
import ContactDetails from './ContactDetails';

type Props = {
  /** Якір для кнопок-скролів (IntroBanner, Process тощо на головній). */
  id?: string;
};

/**
 * Заголовок на всю ширину, під ним — форма запиту й картка "звʼязок напряму"
 * в одному ряду: по 50% кожна, вирівняні по центру по вертикалі (щоб коротша
 * ContactDetails не притискалась до верху поруч із вищою QuoteForm) — той,
 * хто не хоче заповнювати форму, одразу бачить email/WhatsApp поруч.
 *
 * Той самий компонент стоїть і на сторінці контактів (без id — там під
 * власним Hero), і на головній (id="quote-form" — ціль кнопок IntroBanner і
 * Process, тому й scrollMarginTop під фіксований навбар).
 */
export default async function ContactSection({ id }: Props = {}) {
  const t = await getTranslations('Contacts.form');

  return (
    <Section pt={0} id={id} scrollMarginTop={id ? '80px' : undefined}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={4}>{t('title')}</SectionTitle>
      <Lead mb={{ base: 8, md: 10 }}>{t('text')}</Lead>

      <Grid
        gap={{ base: 10, lg: 12 }}
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        alignItems="center"
      >
        {/* QuoteForm повертає фрагмент (<form>, за потреби ще й error-параграф)
            — без обгортки ці елементи "розплющились" би прямо
            в Grid як окремі grid-item'и, і ContactDetails зʼїхав би у другий
            рядок замість другої колонки. */}
        <div>
          <QuoteForm />
        </div>
        <ContactDetails />
      </Grid>
    </Section>
  );
}
