import Image from 'next/image';
import { Box, Button } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import type { Service } from '@/data/services';
import { PageTitle } from '@/components/shared/primitives';
import { CONTENT_MAX_WIDTH } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/config/site';
import BackLink from '@/components/shared/BackLink';

/**
 * Повноекранна шапка сторінки послуги: фото на весь екран, поверх нього —
 * єдиний на сторінці h1 (окреме поле в перекладах, не назва картки й не title
 * у видачі), короткий опис і кнопка запиту кошторису.
 *
 * Фото спільне для обох мов, alt — свій у кожній. Шлях лежить у
 * data/services.ts, тож замінити кадр можна одним рядком даних.
 *
 * Кольори тут не з токенів теми, а зафіксовані світлими: текст лежить на
 * затемненому фото, тобто контекст завжди темний незалежно від того, світла в
 * користувача тема чи ні. Значення — ті самі, що бере темна тема в
 * shared/tokens.ts (акцент #f1d2d3, контраст #09090b), щоб герой не випадав із
 * брендової палітри.
 */

const ON_PHOTO = {
  text: '#ffffff',
  muted: 'rgba(255, 249, 246, 0.88)',
  accent: '#f1d2d3',
  accentContrast: '#09090b',
} as const;

// Кільце фокусу на кнопці поверх фото — теж світле, інакше на темному скримі
// його не видно.
const FOCUS_RING_ON_PHOTO = {
  outline: '2px solid',
  outlineColor: ON_PHOTO.accent,
  outlineOffset: '3px',
} as const;

export default async function ServiceHero({ service }: { service: Service }) {
  const t = await getTranslations(`ServiceItems.${service.slug}`);
  const tPage = await getTranslations('ServicesPage');
  const tCatalog = await getTranslations('Catalog');

  const subject = `${t('name')} — ${tCatalog('quoteEmailSubject')}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

  return (
    <Box
      as="header"
      position="relative"
      // svh, а не vh: на мобільних vh рахується від висоти екрана без урахування
      // панелей браузера, і герой вилазив би за нижній край.
      h={{ base: '92svh', md: '100svh' }}
      minH="560px"
      overflow="hidden"
    >
      <Image
        src={service.heroImage}
        alt={t('heroImageAlt')}
        fill
        priority
        sizes="100vw"
        // Центр композиції трохи нижче середини кадру. На вузьких екранах
        // обрізка з країв найсильніша, і без зсуву предмет зʼїжджав би вгору.
        style={{ objectFit: 'cover', objectPosition: '50% 55%' }}
      />

      {/* Скрим у два шари. Бічний (ліворуч) — головний: предмет у кадрі стоїть
          майже по центру, і текст неминуче підходить до нього впритул, тож ліва
          третина мусить бути стабільно темною за будь-якого співвідношення
          сторін. Нижній лише підбирає низ під кнопкою. Правий край лишається
          чистим — келих має бути видно. */}
      <Box
        position="absolute"
        inset="0"
        bgGradient={{
          // На вузькому екрані текст іде на всю ширину, тож бічний градієнт там
          // нічого не дає — потрібне суцільне затемнення знизу вгору.
          base: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.66) 46%, rgba(0,0,0,0.30) 76%, rgba(0,0,0,0.12) 100%)',
          // Від lg колонка тексту займає ліву половину, і затемнювати весь кадр
          // уже не треба: досить лівої третини плюс низу під кнопкою.
          lg: 'linear-gradient(to right, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.62) 26%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0) 78%), linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0) 58%)',
        }}
        pointerEvents="none"
      />

      <Box
        position="absolute"
        insetX="0"
        bottom="0"
        px={{ base: 5, md: 8 }}
        pb={{ base: 12, md: 20 }}
      >
        <Box maxW={CONTENT_MAX_WIDTH} mx="auto">
          {/* Колонка не ширша за половину екрана: далі праворуч у кадрі стоїть
              келих, і заголовок ліз би просто на нього. */}
          <Box maxW={{ base: '100%', lg: '46%' }}>
            {/* Це і рубрика над заголовком, і повернення до каталогу: обидва
                казали б те саме слово, тож замість двох рядків лишився один —
                той, що клікається. Стоїть у тій самій колонці, що h1 і кнопка,
                тому лівий край у всіх трьох спільний. */}
            <Box mb={4}>
              <BackLink href="/services" label={tPage('hero.eyebrow')} tone="onPhoto" />
            </Box>

            {/* Короткого опису тут навмисно немає: одразу під героєм іде вступ
              із доку, і два абзаци поспіль про те саме лише розганяли б шапку
              вниз. shortDescription далі працює в картках і в Open Graph. */}
            <PageTitle
              color={ON_PHOTO.text}
              fontSize={{ base: '1.75rem', sm: '2rem', md: '2.75rem', lg: '3.25rem' }}
              mb={8}
            >
              {t('h1')}
            </PageTitle>

            <Button
              asChild
              size="lg"
              px={8}
              rounded="full"
              bg={ON_PHOTO.accent}
              color={ON_PHOTO.accentContrast}
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              transition="opacity 200ms ease"
              _hover={{ opacity: 0.86, textDecoration: 'none' }}
              _focusVisible={FOCUS_RING_ON_PHOTO}
            >
              <a href={mailto}>{tCatalog('ctaQuote')}</a>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
