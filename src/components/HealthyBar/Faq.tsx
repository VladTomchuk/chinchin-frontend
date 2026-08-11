import { Accordion, Box, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, SectionTitle } from './primitives';
import { c, FOCUS_RING } from './tokens';

type FaqItem = { question: string; answer: string };

export default async function Faq() {
  const t = await getTranslations('HealthyBar.faq');
  const items = t.raw('items') as FaqItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <Section bg={c.page}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }}>{t('title')}</SectionTitle>

      <Box maxW="820px">
        <Accordion.Root collapsible>
          {items.map((item, i) => (
            <Accordion.Item
              key={item.question}
              value={String(i)}
              borderBottomWidth="1px"
              borderColor={c.line}
            >
              <Accordion.ItemTrigger
                py={5}
                gap={6}
                cursor="pointer"
                textAlign="start"
                transition="color 200ms ease"
                _hover={{ color: c.accent }}
                _focusVisible={FOCUS_RING}
              >
                <Text
                  flex="1"
                  fontFamily="var(--font-brand-ui)"
                  fontWeight="500"
                  fontSize={{ base: 'md', md: 'lg' }}
                  lineHeight="1.5"
                  color="inherit"
                >
                  {item.question}
                </Text>
                <Accordion.ItemIndicator color={c.accent} />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody pb={6}>
                  <Text
                    fontFamily="var(--font-brand-ui)"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight="1.75"
                    color={c.textMuted}
                    maxW="62ch"
                  >
                    {item.answer}
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Box>

      {/* Розмітка для сніпета FAQ у пошуку. Текст свій, з файлів перекладу;
          екрануємо `<`, щоб рядок не міг закрити тег script. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </Section>
  );
}
