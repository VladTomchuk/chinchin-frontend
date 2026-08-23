import { Box, Button, Heading, List, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import type { ServiceSlug } from '@/data/services';
import { Section, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/config/site';
import JsonLd from '@/components/shared/JsonLd';

/**
 * Тіло сторінки послуги. Увесь текст — з messages/{en,ua}.json під
 * ServiceItems.{slug}.body: тексти пишуть у Google Doc (тека послуг, веде
 * власниця) і переносять у файли перекладів руками, розробник їх не складає й
 * не перекладає. Поки доку немає, у значенні стоїть маркер [COPY PENDING — …],
 * який неможливо сплутати з готовим текстом.
 *
 * Набір секцій повторює структуру доку: вступ, що входить, для яких подій,
 * меню, як відбувається замовлення, заходи за межами Барселони, CTA, FAQ.
 *
 * Порядок і рівні заголовків однакові для обох мов, бо структуру задає цей
 * компонент, а не переклад: h1 у шапці, кожна секція — h2, аудиторії та
 * питання всередині секцій — h3. Рівні не перестрибуються. Вступ ідилить одразу
 * під h1 без власного заголовка — у доку його теж немає.
 */

type Audience = { name: string; text: string };
type FaqItem = { question: string; answer: string };

/** Значення-плейсхолдер із Task 1: у структуровані дані такий текст не віддаємо. */
const isPending = (value: string) => value.includes('[COPY PENDING');

function Body({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily="var(--font-brand-ui)"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight="1.75"
      color={c.textMuted}
      maxW="62ch"
    >
      {children}
    </Text>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading
      as="h3"
      fontFamily="var(--font-brand-ui)"
      fontWeight="600"
      fontSize={{ base: 'md', md: 'lg' }}
      lineHeight="1.4"
      color={c.text}
      mb={2}
    >
      {children}
    </Heading>
  );
}

function Stack({ children, gap = 4 }: { children: React.ReactNode; gap?: number }) {
  return (
    <Box display="flex" flexDirection="column" gap={gap} maxW="62ch">
      {children}
    </Box>
  );
}

export default async function ServiceBody({ slug }: { slug: ServiceSlug }) {
  const t = await getTranslations(`ServiceItems.${slug}.body`);
  const tItem = await getTranslations(`ServiceItems.${slug}`);
  const tCatalog = await getTranslations('Catalog');

  const intro = t.raw('intro.paragraphs') as string[];
  const includedItems = t.raw('included.items') as string[];
  const audiences = t.raw('perfectFor.items') as Audience[];
  const menuParagraphs = t.raw('menu.paragraphs') as string[];
  const steps = t.raw('howItWorks.steps') as string[];
  const internationalParagraphs = t.raw('international.paragraphs') as string[];
  const faqItems = t.raw('faq.items') as FaqItem[];

  // Розмітку FAQ віддаємо тільки коли текст справді затверджений: сніпет із
  // «[COPY PENDING …]» у видачі гірший, ніж його відсутність.
  const faqReady = faqItems.every((item) => !isPending(item.question) && !isPending(item.answer));

  return (
    <>
      <Section pt={0} pb={{ base: 12, md: 16 }}>
        <Stack>
          {intro.map((paragraph) => (
            <Body key={paragraph}>{paragraph}</Body>
          ))}
        </Stack>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 5, md: 6 }}>{t('included.title')}</SectionTitle>
        <Body>{t('included.lead')}</Body>

        <List.Root mt={6} gap={3} maxW="62ch" listStyleType="none" ml={0}>
          {includedItems.map((item) => (
            <List.Item
              key={item}
              fontFamily="var(--font-brand-ui)"
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight="1.75"
              color={c.textMuted}
              borderTopWidth="1px"
              borderColor={c.line}
              pt={3}
            >
              {item}
            </List.Item>
          ))}
        </List.Root>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 6, md: 8 }}>{t('perfectFor.title')}</SectionTitle>
        <Stack gap={8}>
          {audiences.map((audience) => (
            <Box key={audience.name}>
              <SubHeading>{audience.name}</SubHeading>
              <Body>{audience.text}</Body>
            </Box>
          ))}
        </Stack>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 6, md: 8 }}>{t('menu.title')}</SectionTitle>
        <Stack>
          {menuParagraphs.map((paragraph) => (
            <Body key={paragraph}>{paragraph}</Body>
          ))}
        </Stack>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 6, md: 8 }}>{t('howItWorks.title')}</SectionTitle>
        {/* Кроки нумеровані в самому доку, тож і тут це ol, а не список
            заголовків: порядок — частина змісту. */}
        <List.Root as="ol" gap={4} maxW="62ch" ml={5}>
          {steps.map((step) => (
            <List.Item
              key={step}
              fontFamily="var(--font-brand-ui)"
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight="1.75"
              color={c.textMuted}
              _marker={{ color: c.accent }}
            >
              {step}
            </List.Item>
          ))}
        </List.Root>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 6, md: 8 }}>{t('international.title')}</SectionTitle>
        <Stack>
          {internationalParagraphs.map((paragraph) => (
            <Body key={paragraph}>{paragraph}</Body>
          ))}
        </Stack>
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 6, md: 8 }}>{t('faq.title')}</SectionTitle>
        <Stack gap={8}>
          {faqItems.map((item) => (
            <Box key={item.question}>
              <SubHeading>{item.question}</SubHeading>
              <Body>{item.answer}</Body>
            </Box>
          ))}
        </Stack>

        {faqReady && (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }}
          />
        )}
      </Section>

      <Section pt={0}>
        <SectionTitle mb={{ base: 5, md: 6 }}>{t('cta.title')}</SectionTitle>
        <Body>{t('cta.text')}</Body>

        {/* Та сама кнопка й та сама адреса, що в шапці: заклик у доку є, а
            підпису кнопки немає, тож беремо вже затверджений рядок із Catalog,
            а не вигадуємо новий. */}
        <Button
          asChild
          mt={8}
          size="lg"
          px={8}
          rounded="full"
          bg={c.accent}
          color={c.accentContrast}
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          transition="opacity 200ms ease"
          _hover={{ opacity: 0.86, textDecoration: 'none' }}
          _focusVisible={FOCUS_RING}
        >
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              `${tItem('name')} — ${tCatalog('quoteEmailSubject')}`,
            )}`}
          >
            {tCatalog('ctaQuote')}
          </a>
        </Button>
      </Section>
    </>
  );
}
