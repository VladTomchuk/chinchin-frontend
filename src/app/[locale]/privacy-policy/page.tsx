import type { Metadata } from 'next';
import { Box, List, Text } from '@chakra-ui/react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Eyebrow, Lead, PageTitle, Section, SectionTitle } from '@/components/shared/primitives';
import { c, NAVBAR_OFFSET } from '@/components/shared/tokens';

type Props = { params: Promise<{ locale: string }> };

type PolicySection = { title: string; paragraphs: string[]; items?: string[]; note?: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily="var(--font-brand-ui)"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight="1.75"
      color={c.textMuted}
      maxW="70ch"
    >
      {children}
    </Text>
  );
}

/**
 * Текст — юридичний (GDPR-нотіс), не з Google Doc копірайтерки, як інші
 * сторінки (ServiceBody.tsx): рахує один намспейс PrivacyPolicy.sections,
 * кожна секція — title + paragraphs, за потреби ще й items (список).
 */
export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });
  const sections = t.raw('sections') as PolicySection[];

  return (
    <main>
      <Section as="header" pt={NAVBAR_OFFSET} pb={{ base: 10, md: 14 }}>
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <PageTitle mb={6}>{t('hero.title')}</PageTitle>
        <Lead mb={0}>{t('hero.lead')}</Lead>
      </Section>

      {sections.map((section) => (
        <Section key={section.title} pt={0}>
          <SectionTitle mb={{ base: 4, md: 5 }}>{section.title}</SectionTitle>
          <Box display="flex" flexDirection="column" gap={4} maxW="70ch">
            {section.paragraphs.map((paragraph) => (
              <Body key={paragraph}>{paragraph}</Body>
            ))}
          </Box>

          {section.items && (
            <List.Root mt={4} gap={2} maxW="70ch" listStyleType="disc" ml={5}>
              {section.items.map((item) => (
                <List.Item
                  key={item}
                  fontFamily="var(--font-brand-ui)"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight="1.75"
                  color={c.textMuted}
                >
                  {item}
                </List.Item>
              ))}
            </List.Root>
          )}

          {section.note && (
            <Box mt={4}>
              <Body>{section.note}</Body>
            </Box>
          )}
        </Section>
      ))}
    </main>
  );
}
