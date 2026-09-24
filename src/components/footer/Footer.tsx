import { getTranslations } from 'next-intl/server';
import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import { LuInstagram, LuLinkedin, LuFacebook } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { visibleNavItems } from '@/config/navigation';
import { SOCIAL_LINKS, WHATSAPP_URL } from '@/config/socials';
import { CONTACT_EMAIL } from '@/config/site';
import { CONTENT_MAX_WIDTH, FOCUS_RING, c } from '@/components/shared/tokens';
import styles from './Footer.module.css';

// Іконки для SOCIAL_LINKS у config/socials.ts беруться з react-icons напряму
// там, де вони й імпортовані (Icon: IconType на кожному записі) — тут лише
// мапимо ключ на конкретний компонент для рендеру.
const SOCIAL_ICONS = { instagram: LuInstagram, linkedin: LuLinkedin, facebook: LuFacebook, youtube: null } as const;

export default async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Navbar');
  const tContacts = await getTranslations('Contacts.details');

  const year = new Date().getFullYear();
  const exploreItems = visibleNavItems();

  return (
    // surfaceAlt, а не page: той самий токен, що дає легкий відступ фону від
    // полотна сторінки деінде (Gallery, Hero-блоки) — на c.page футер злився б
    // із секцією над ним і в темі, і в іншій, і межу між сторінкою й футером
    // не було б видно взагалі.
    <Box as="footer" bg={c.surfaceAlt} color={c.text}>
      <Box
        maxW={CONTENT_MAX_WIDTH}
        mx="auto"
        px={{ base: 5, md: 8 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 6, md: 8 }}
      >
        <Grid templateColumns={{ base: '1fr', md: '1.3fr 1fr 1fr' }} gap={{ base: 10, md: 8 }}>
          <Box>
            {/* Обидва варіанти лого рендеряться завжди — CSS-модуль (не JS)
                перемикає, який показати, через :global(html.dark), так само
                як лого-варіант BackLink.module.css чи іконка в DrawerMenu.
                display:none прибирає прихований варіант з дерева
                доступності, тож повторного імені для читалки нема. */}
            <Image
              src="/green_chinchin_logo.svg"
              alt="ChinChin"
              height="36px"
              mb={4}
              className={styles.logoLight}
            />
            <Image
              src="/pink_chinchin_logo.svg"
              alt="ChinChin"
              height="36px"
              mb={4}
              className={styles.logoDark}
            />
            <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.textMuted} maxW="32ch" mb={2}>
              {t('tagline')}
            </Text>
            <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.textMuted}>
              {tContacts('locationText')}
            </Text>
          </Box>

          <Box>
            <Text
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="xs"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={c.textMuted}
              mb={4}
            >
              {t('exploreHeading')}
            </Text>
            <Flex direction="column" gap={3} as="nav" aria-label={t('exploreHeading')}>
              {exploreItems.map((item) => (
                <Link key={item.key} href={item.href} className={styles.link}>
                  {tNav(item.key)}
                </Link>
              ))}
            </Flex>
          </Box>

          <Box>
            <Text
              fontFamily="var(--font-brand-ui)"
              fontWeight="600"
              fontSize="xs"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={c.textMuted}
              mb={4}
            >
              {t('contactHeading')}
            </Text>
            <Flex direction="column" gap={3} mb={5}>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
                {CONTACT_EMAIL}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {tContacts('whatsappCta')}
              </a>
            </Flex>

            <Flex gap={2}>
              {SOCIAL_LINKS.map(({ key, href }) => {
                const Icon = SOCIAL_ICONS[key];
                if (!Icon || !href) return null;
                return (
                  <Box key={key} asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={tContacts(`social.${key}`)}
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
                );
              })}
            </Flex>
          </Box>
        </Grid>

        <Flex
          mt={{ base: 10, md: 12 }}
          pt={6}
          borderTopWidth="1px"
          borderColor={c.line}
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={2}
          // Праворуч знизу завжди сидить плаваюча кнопка WhatsApp
          // (WhatsAppButton.module.css, position:fixed) — без цього запасу
          // довгий рядок копірайту заходить їй прямо під іконку на вузьких
          // екранах.
          pr={{ base: '64px', md: 0 }}
        >
          <Text fontFamily="var(--font-brand-ui)" fontSize="xs" color={c.textMuted}>
            © {year} ChinChin Bar Catering. {t('rights')}
          </Text>
          <Link href="/privacy-policy" className={styles.legalLink}>
            {t('privacyPolicy')}
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}
