import { Box, Text } from '@chakra-ui/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { LuExternalLink } from 'react-icons/lu';
import type { Locale } from '@/i18n/routing';
import { BCP47_LOCALE } from '@/config/site';
import { getGoogleReviews, googleMapsPlaceUrl } from '@/lib/reviews';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import ReviewsCarousel from '@/components/MainPage/ReviewsCarousel/ReviewsCarousel';
import Stars from './Stars';

/**
 * Блок відгуків Google. Підключається через GoogleReviews/ReviewsSection на
 * кожній сторінці сайту, де він доречний — той самий компонент і той самий
 * кеш, скільки б сторінок його не рендерило.
 *
 * Дані бере lib/reviews напряму (не через /api/reviews) — пояснення там же.
 *
 * Скільки б сторінок його не рендерило, до Google іде один запит на добу на
 * мову: fetch усередині ключується по URL+опціях, і Data Cache спільний.
 *
 * Подання одне на весь сайт: керована людиною горизонтальна карусель
 * ReviewsCarousel.tsx (стрілки, крапки-пагінація, свайп, стрілки клавіатури)
 * усередині заголовка/рейтингу/футера цього компонента.
 */
export default async function GoogleReviews() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('Reviews');

  // Google локалізує і текст відгуку, і підпис «2 місяці тому» за цим кодом.
  // Код мови, не локалі в URL: у проєкті шлях /ua, а мова 'uk'.
  const result = await getGoogleReviews(BCP47_LOCALE[locale]);

  // Ключа ще немає — блок просто не існує. Виводити на всіх тридцяти сторінках
  // повідомлення про помилку, поки налаштування не дороблені, гірше, ніж
  // не показувати нічого; причина пишеться в лог сервера.
  if (result.status === 'unconfigured') {
    console.warn(`[GoogleReviews] ${result.message}`);
    return null;
  }

  if (result.status === 'error') {
    console.error(`[GoogleReviews] ${result.code}: ${result.message}`);

    return (
      <Section>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <SectionTitle mb={5}>{t('title')}</SectionTitle>
        <Lead>{t('unavailable')}</Lead>
      </Section>
    );
  }

  const { rating, userRatingCount, reviews } = result.data;
  if (reviews.length === 0) return null;

  const placeUrl = googleMapsPlaceUrl();

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={5}>{t('title')}</SectionTitle>

      {rating !== null && (
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap" mb={{ base: 8, md: 12 }}>
          <Stars rating={rating} label={t('ratingAria', { rating })} />

          <Text fontFamily="var(--font-brand-ui)" fontWeight="600" fontSize="lg" color={c.text}>
            {t('ratingValue', { rating })}
          </Text>

          {/* Українську форму цього рядка навмисно записано без узгодження з
              числом («Відгуків у Google: 47»). ICU-плюралізація тут не працює:
              next-intl віддає в Intl код локалі 'ua', а це код країни, не мови,
              і Intl.PluralRules('ua') повертає англійські категорії — 47
              потрапляло б у other і давало «47 відгука». */}
          <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.textMuted}>
            {t('count', { count: userRatingCount })}
          </Text>
        </Box>
      )}

      <ReviewsCarousel reviews={reviews} locale={locale} />

      <Box mt={{ base: 8, md: 10 }} display="flex" flexWrap="wrap" alignItems="center" gap={3} justifyContent="flex-end">
        {/* Посилання на джерело — вимога умов використання Places API.
            asChild, а не as="a": у Chakra v3 проп as не розширює типи, і href
            на Box не проходить перевірку. Той самий підхід, що з Button. */}
        {placeUrl && (
          <Box
            asChild
            display="inline-flex"
            alignItems="center"
            gap={2}
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="sm"
            color={c.accent}
            rounded="sm"
            _hover={{ textDecoration: 'underline' }}
            _focusVisible={FOCUS_RING}
          >
            <a href={placeUrl} target="_blank" rel="noopener noreferrer">
              {t('seeOnGoogle')}
              <LuExternalLink size={14} aria-hidden />
            </a>
          </Box>
        )}
      </Box>
    </Section>
  );
}
