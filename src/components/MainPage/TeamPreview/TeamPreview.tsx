import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Eyebrow, Lead, Section, SectionTitle } from '@/components/shared/primitives';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { SOCIAL_LINKS } from '@/config/socials';
import ShakerReveal from './ShakerReveal';
import TiltPhoto from './TiltPhoto';

// Фото команди — public/about_us. Поки без прив'язки конкретного кадру до
// конкретної людини (реальних імен ще нема, тож просто 4 статичних фото,
// по одному на картку). Коли з'являться підписані фото — замінити масив на
// об'єкти { photo, name, role } і прибрати цей коментар.
const TEAM_PHOTOS = [
  '/about_us/Facetune_08-04-2025-22-10-59.jpeg',
  '/about_us/IMG_2572.JPG',
  '/about_us/IMG_4890.JPG',
  '/about_us/IMG_8979.jpeg',
];

// ШАБЛОН секції "про команду" для головної. Імена — заглушки: members у
// перекладах (TeamPreview.members) — placeholder-рядки "Ім'я" / "Посада",
// замінити на реальний склад команди там само, без правок тут.
// Секція веде на /about — повноцінну сторінку команди; окремої сторінки
// "/about/team" в маршрутизації (i18n/routing.ts) поки нема.
export default async function TeamPreview() {
  const t = await getTranslations('TeamPreview');

  return (
    <Section>
      <Flex justify="space-between" align="center" gap={8} mb={{ base: 10, md: 14 }}>
        <Box maxW="60ch">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionTitle mb={4}>{t('title')}</SectionTitle>
          <Lead>{t('lead')}</Lead>
        </Box>

        {/* Декоративний шейкер у вільному місці справа від тексту (сам
            малюнок, кольори теми й слайд-анімація на скролі — у
            ShakerReveal.tsx). flex="1" + justify="center" центрують картинку
            в решті вільного простору (а не притискають до правого краю).
            Ховаємо на вузьких екранах: там того вільного місця вже нема. */}
        <Flex flex="1" justify="center" display={{ base: 'none', lg: 'flex' }}>
          <ShakerReveal />
        </Flex>
      </Flex>

      {/* 4 статичних фото команди, без каруселі/автопрокрутки. */}
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
        gap={{ base: 4, md: 5 }}
        mb={{ base: 10, md: 14 }}
      >
        {/* Box тут — лише perspective + розмір: рамка/скруглення/тінь тепер
            на самій картці всередині TiltPhoto, бо саме вона нахиляється в
            3D. Якщо рамку лишити на цьому Box, зовні лишається статичний
            прямокутник, а "гойдається" тільки фото під ним. */}
        {TEAM_PHOTOS.map((src) => (
          <Box key={src} position="relative" aspectRatio="1" style={{ perspective: '800px' }}>
            <TiltPhoto src={src} alt={t('photoAlt')} sizes="(max-width: 30em) 50vw, 25vw" />
          </Box>
        ))}
      </Grid>

      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'flex-start', sm: 'center' }}
        justify="space-between"
        gap={6}
      >
        <Link href="/about">
          <Flex
            align="center"
            gap={2}
            px={7}
            py={3.5}
            rounded="full"
            bg={c.accent}
            color={c.accentContrast}
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="sm"
            transition="opacity 200ms ease"
            _hover={{ opacity: 0.86 }}
            _focusVisible={FOCUS_RING}
          >
            {t('cta')}
          </Flex>
        </Link>

        <Flex align="center" gap={4}>
          <Text
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            fontSize="xs"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={c.textMuted}
          >
            {t('socialsLabel')}
          </Text>

          <Flex gap={2}>
            {SOCIAL_LINKS.map(({ key, href, Icon }) => (
              <Box key={key} asChild>
                <a
                  href={href || '#'}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noopener noreferrer' : undefined}
                  aria-label={t(`social.${key}`)}
                >
                  <Flex
                    as="span"
                    w="40px"
                    h="40px"
                    rounded="full"
                    bg={c.accentSoft}
                    color={c.accent}
                    align="center"
                    justify="center"
                    transition="background-color 200ms ease, color 200ms ease"
                    _hover={{ bg: c.accent, color: c.accentContrast }}
                    _focusVisible={FOCUS_RING}
                  >
                    <Icon size={18} aria-hidden />
                  </Flex>
                </a>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Section>
  );
}
