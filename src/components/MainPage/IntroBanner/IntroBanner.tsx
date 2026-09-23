import { Button, Heading } from '@chakra-ui/react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import styles from './IntroBanner.module.css';

// Повноекранне відео-хіро на всю ширину. Раніше тут пробували "розсічення на
// скло" — той самий кадр удруге, пропущений крізь SVG-дисторсію
// (feTurbulence/feDisplacementMap) і сітку ромбів-граней, — але обидва варіанти
// (відео- і фото-версію) прибрали як тимчасово закоментований код: ефект так і
// не дійшов до продакшену. Слоган і CTA лежать праворуч (content зсунутий на
// md+) просто поверх скриму на відео.
export default async function IntroBanner() {
  const t = await getTranslations('HeroSection');
  const locale = (await getLocale()) as Locale;

  // Monoton не має кирилічних нарисів — для укр локалі заголовок хіро
  // рендеримо Climate Crisis, решта мов лишаються на Monoton. Climate Crisis
  // підключений напряму з Google Fonts (layout.tsx, <link> на YEAR@1979) —
  // самохостнута через next/font/local версія давала не той нарис, тож від
  // неї відмовились.
  const isUkrainian = locale === 'ua';
  const titleFontFamily = isUkrainian
    ? "'Climate Crisis', sans-serif"
    : 'var(--font-monoton)';

  return (
    <header className={styles.hero}>
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/betby_cocktail.jpg"
        aria-label={t('introAlt')}
      >
        <source src="/hero/betby_video.mp4" type="video/mp4" />
      </video>

      <div className={styles.scrim} />
      <div className={styles.textScrim} />

      <div className={styles.content}>
        <Heading
          as="h1"
          fontFamily={titleFontFamily}
          fontWeight="400"
          lineHeight="1.4"
          letterSpacing="0.02em"
          fontSize={{ base: '2.1rem', md: '3.2rem', lg: '3.75rem' }}
          color="#fff9f6"
          whiteSpace="pre-line"
          textAlign="left"
          textShadow="0 2px 24px rgba(0, 0, 0, 0.35)"
          mb={8}
        >
          {t('title')}
        </Heading>

        <Button
          asChild
          size="lg"
          px={7}
          rounded="full"
          bg={c.accent}
          color={c.accentContrast}
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          transition="opacity 200ms ease"
          _hover={{ opacity: 0.86, textDecoration: 'none' }}
          _focusVisible={FOCUS_RING}
        >
          <a href="#quote-form">{t('ctaQuote')}</a>
        </Button>
      </div>
    </header>
  );
}
