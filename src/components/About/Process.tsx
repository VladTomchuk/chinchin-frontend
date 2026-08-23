import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/components/HealthyBar/tokens';

type Step = { name: string; text: string };

/**
 * П'ять кроків від першого повідомлення до події. Вертикальний список, а не
 * сітка: пунктів більше, ніж у HealthyBar.process (4), і рівна сітка на 5
 * колонок стискала б текст. Під першим кроком — CTA: саме сюди веде клієнта,
 * що готовий почати.
 */
export default async function Process() {
  const t = await getTranslations('About.process');
  const tCta = await getTranslations('About.cta');
  const items = t.raw('items') as Step[];

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(tCta('emailSubject'))}`;

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }}>{t('title')}</SectionTitle>

      <Stack as="ol" gap={0} maxW="760px" listStyleType="none">
        {items.map((item, i) => (
          <Box
            as="li"
            key={item.name}
            display="flex"
            gap={{ base: 4, md: 6 }}
            py={{ base: 6, md: 7 }}
            borderTopWidth={i === 0 ? '0' : '1px'}
            borderColor={c.line}
          >
            <Text
              fontFamily="var(--font-brand)"
              fontWeight="200"
              fontSize={{ base: '1.5rem', md: '1.75rem' }}
              lineHeight="1.2"
              color={c.accent}
              flexShrink={0}
              w={{ base: '2.25rem', md: '2.75rem' }}
            >
              {String(i + 1).padStart(2, '0')}
            </Text>

            <Box>
              <Heading
                as="h3"
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="md"
                color={c.text}
                mb={2}
              >
                {item.name}
              </Heading>

              <Text
                fontFamily="var(--font-brand-ui)"
                fontSize="sm"
                lineHeight="1.7"
                color={c.textMuted}
                maxW="52ch"
              >
                {item.text}
              </Text>

              {/* CTA лише під першим кроком — там, де клієнт іще нічого не
                  надіслав і йому потрібна конкретна дія. */}
              {i === 0 && (
                <Button
                  asChild
                  mt={5}
                  size="sm"
                  px={6}
                  rounded="full"
                  bg={c.accent}
                  color={c.accentContrast}
                  fontFamily="var(--font-brand-ui)"
                  fontWeight="600"
                  transition="opacity 200ms ease"
                  _hover={{ opacity: 0.86, textDecoration: 'none' }}
                  _focusVisible={FOCUS_RING}
                >
                  <a href={mailto}>{t('briefingCta')}</a>
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Section>
  );
}
