import Image from 'next/image';
import { Box, Grid, Text } from '@chakra-ui/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { LuExternalLink } from 'react-icons/lu';
import type { Locale } from '@/i18n/routing';
import { BCP47_LOCALE } from '@/config/site';
import { getGoogleReviews, googleMapsPlaceUrl, type Review } from '@/lib/reviews';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import Stars from './Stars';

/**
 * Блок відгуків Google. Один на весь сайт: підключений у [locale]/layout.tsx,
 * тож на кожній сторінці це той самий компонент і той самий кеш.
 *
 * Дані бере lib/reviews напряму (не через /api/reviews) — пояснення там же.
 *
 * Скільки б сторінок його не рендерило, до Google іде один запит на годину на
 * мову: fetch усередині ключується по URL+опціях, і Data Cache спільний.
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

      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} locale={locale} />
        ))}
      </Grid>

      <Box
        mt={{ base: 8, md: 10 }}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        gap={3}
        justifyContent="space-between"
      >
        {/* Не баг: Places API віддає щонайбільше пʼять відгуків, які сам вважає
            найрелевантнішими, без сортування й пагінації. Пишемо це відвідувачу,
            щоб «а де решта відгуків» не виглядало як поламаний блок. */}
        <Text fontFamily="var(--font-brand-ui)" fontSize="xs" color={c.textMuted} maxW="60ch">
          {t('limitNote')}
        </Text>

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

function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  // Дату форматуємо самі: relativePublishTimeDescription від Google локалізовано,
  // але його може не бути, і машинозчитуваного значення воно не дає.
  const published = review.publishTime ? new Date(review.publishTime) : null;
  const absoluteDate =
    published && !Number.isNaN(published.getTime())
      ? new Intl.DateTimeFormat(BCP47_LOCALE[locale], { year: 'numeric', month: 'long' }).format(
          published,
        )
      : '';

  return (
    <Box
      as="article"
      bg={c.surface}
      borderWidth="1px"
      borderColor={c.line}
      rounded="2xl"
      p={{ base: 6, md: 8 }}
      h="full"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" alignItems="center" gap={4} mb={5}>
        {review.author.photoUri ? (
          <Box
            position="relative"
            w="44px"
            h="44px"
            rounded="full"
            overflow="hidden"
            flexShrink={0}
            bg={c.accentSoft}
          >
            <Image
              src={review.author.photoUri}
              alt=""
              fill
              // НЕ unoptimized: /_next/image мусить проксіювати запит через
              // сервер, інакше Google віддає 429 і Chromium ховає це як
              // net::ERR_BLOCKED_BY_ORB — деталі в next.config.ts.
              sizes="44px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ) : (
          // Аватар не обовʼязковий у відповіді — тоді ставимо ініціал, щоб
          // картки не розʼїжджалися по висоті заголовка.
          <Box
            w="44px"
            h="44px"
            rounded="full"
            flexShrink={0}
            bg={c.accentSoft}
            color={c.accent}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            aria-hidden
          >
            {review.author.displayName.trim().charAt(0).toUpperCase()}
          </Box>
        )}

        <Box minW={0}>
          <Text
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="sm"
            color={c.text}
            lineHeight="1.4"
          >
            {review.author.displayName}
          </Text>

          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Stars rating={review.rating} label={`${review.rating}/5`} />
            {(review.relativeTime || absoluteDate) && (
              <Text asChild fontFamily="var(--font-brand-ui)" fontSize="xs" color={c.textMuted}>
                <time dateTime={review.publishTime || undefined}>
                  {review.relativeTime || absoluteDate}
                </time>
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      <Text
        fontFamily="var(--font-brand-ui)"
        fontSize="sm"
        lineHeight="1.75"
        color={c.textMuted}
        whiteSpace="pre-line"
      >
        {review.text}
      </Text>
    </Box>
  );
}
