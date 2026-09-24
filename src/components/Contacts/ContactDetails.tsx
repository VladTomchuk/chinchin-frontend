import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { LuMail, LuMapPin } from 'react-icons/lu';
import { TbBrandTelegram } from 'react-icons/tb';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/config/site';
import {
  SOCIAL_LINKS,
  TELEGRAM_URL,
  TELEGRAM_URL_2,
  WHATSAPP_DISPLAY,
  WHATSAPP_DISPLAY_2,
  WHATSAPP_URL,
  WHATSAPP_URL_2,
} from '@/config/socials';
import { WhatsAppIcon } from '@/components/shared/icons/WhatsAppIcon';

// Конверт без лого (public/contacts/sobre_sin_logo_card.png) — на крафт-клапані,
// де раніше в оригінального фото був штамп "CHIN CHIN", тепер лежить локація.
// Картинка статична (не залежить від теми сайту), тож текст поверх неї теж
// лишається на фіксованих, а не токенізованих кольорах — інакше в темній темі
// c.text став би майже білим і зник би на кремовому папері.
const CARD_TEXT = '#3d3630';
const CARD_TEXT_MUTED = '#8a7f6f';
const CARD_ACCENT = '#6b5f1c';
const FLAP_BADGE_BG = '#f1e6d3';
// Темніший, ніж CARD_TEXT_MUTED — той підбирався під контраст із білим
// папером, а тут фон середньо-теплий крафт, на якому світліший приглушений
// тон губиться так само, як губився світлий варіант до цього.
const FLAP_LABEL = '#5c4f3d';

/**
 * Картка "звʼязок напряму" поряд із формою (ContactSection.tsx). На великих
 * екранах — конверт із усією інформацію: email, WhatsApp і Telegram (по два
 * номери кожен) та соцмережі на листі, локація на місці штампу лого на
 * клапані. На мобільних конверт замінює проста картка (той самий вміст без
 * Telegram) — на вузькому екрані ілюстрація займає багато місця, а дрібний
 * текст на ній важче читати, ніж звичайні рядки.
 */
export default async function ContactDetails() {
  const t = await getTranslations('Contacts.details');

  return (
    <Box h="fit-content">
      <Box display={{ base: 'block', lg: 'none' }}>
        <SimpleCard t={t} />
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <Envelope t={t} />
      </Box>
    </Box>
  );
}

function Envelope({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <Box h="fit-content">
      <Flex justify="center" py={{ base: 4, md: 6 }}>
        <Box position="relative" w="full" maxW="480px" aspectRatio="264 / 318">
          <Image
            src="/contacts/sobre_sin_logo_card.png"
            alt=""
            fill
            sizes="480px"
            style={{ objectFit: 'contain' }}
          />

          {/* Текст лежить лише у верхній частині "листа" — нижче лінія
              клапана конверта звужується по діагоналі, довший блок там
              обрізало б картинкою. */}
          <Flex position="absolute" top="21%" left="18%" right="18%" direction="column" align="center">
            <Heading
              as="h2"
              fontFamily="var(--font-heading)"
              fontWeight="400"
              fontSize={{ base: 'lg', md: 'xl' }}
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={CARD_TEXT}
              textAlign="center"
            >
              {t('envelopeTitle')}
            </Heading>

            {/* Email, WhatsApp і Telegram — той самий формат "бейдж-іконка +
                підпис + значення", що раніше стояв у картці під конвертом
                (Contacts/ContactDetails.tsx до перенесення сюди). Одна колонка
                з align="flex-start" — інакше кожен рядок центрувався б окремо
                своєю шириною, і бейджі не збігались би по лівому краю (рядки з
                двома номерами ширші за email). */}
            <Flex direction="column" align="flex-start" mt={3} gap={2}>
              <PaperRow icon={<LuMail size={12} aria-hidden />} label={t('emailLabel')}>
                <Link
                  href={mailto}
                  display="inline-block"
                  fontFamily="var(--font-brand-ui)"
                  fontWeight="600"
                  fontSize="xs"
                  color={CARD_TEXT}
                  _hover={{ color: CARD_ACCENT }}
                  _focusVisible={FOCUS_RING}
                  wordBreak="break-all"
                >
                  {CONTACT_EMAIL}
                </Link>
              </PaperRow>

              <PaperRow icon={<WhatsAppIcon size={12} />} label={t('whatsappLabel')}>
                <PhoneLinks hrefA={WHATSAPP_URL} labelA={WHATSAPP_DISPLAY} hrefB={WHATSAPP_URL_2} labelB={WHATSAPP_DISPLAY_2} />
              </PaperRow>

              <PaperRow icon={<TbBrandTelegram size={13} aria-hidden />} label={t('telegramLabel')}>
                <PhoneLinks hrefA={TELEGRAM_URL} labelA={WHATSAPP_DISPLAY} hrefB={TELEGRAM_URL_2} labelB={WHATSAPP_DISPLAY_2} />
              </PaperRow>
            </Flex>
          </Flex>

          {/* Іконки соцмереж винесені окремо від тексту вище й підняті майже
              впритул до краю конверта — той самий стиль (шрифт/іконка/колір),
              що був у картці "FOLLOW US" під конвертом до перенесення сюди. */}
          <Flex position="absolute" top="54%" left="0" right="0" justify="center" gap={2}>
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
                    w="30px"
                    h="30px"
                    rounded="full"
                    bg={c.accentSoft}
                    color={c.accent}
                    align="center"
                    justify="center"
                    transition="background-color 200ms ease, color 200ms ease"
                    _hover={{ bg: c.accent, color: c.accentContrast }}
                    _focusVisible={FOCUS_RING}
                  >
                    <Icon size={14} aria-hidden />
                  </Flex>
                </a>
              </Box>
            ))}
          </Flex>

          {/* Клапан конверта, майже впритул до нижнього краю — тут в
              оригінального фото був штамп "CHIN CHIN", на
              sobre_sin_logo_card.png це місце порожнє. Темний колір (не
              світлий, як для лого) — кремовий/жовтуватий текст на крафті
              читається гірше, ніж темний, тож тут той самий CARD_TEXT/MUTED,
              що й на папері. */}
          <Flex position="absolute" top="85.7%" left="8%" right="8%" align="center" justify="center" gap={2}>
            <Flex
              w="38px"
              h="38px"
              flexShrink={0}
              rounded="full"
              bg={FLAP_BADGE_BG}
              color={CARD_ACCENT}
              align="center"
              justify="center"
            >
              <LuMapPin size={18} aria-hidden />
            </Flex>

            <Box textAlign="left">
              <Text
                fontFamily="var(--font-brand-ui)"
                fontWeight="700"
                fontSize="12px"
                textTransform="uppercase"
                letterSpacing="0.06em"
                color={FLAP_LABEL}
                mb="1px"
              >
                {t('locationLabel')}
              </Text>
              <Text fontFamily="var(--font-brand-ui)" fontWeight="600" fontSize="sm" color={CARD_TEXT}>
                {t('locationText')}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

/**
 * Проста картка для мобільних — той самий вміст, що на конверті (email,
 * WhatsApp і Telegram по два номери кожен, локація), звичайним текстовим
 * списком замість ілюстрації.
 */
function SimpleCard({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <Box bg={c.surface} borderWidth="1px" borderColor={c.line} rounded="3xl" p={{ base: 6, md: 8 }}>
      <Heading as="h2" fontFamily="var(--font-brand-ui)" fontWeight="600" fontSize="lg" color={c.text} mb={6}>
        {t('title')}
      </Heading>

      <Flex direction="column" gap={5}>
        <DetailRow icon={<LuMail size={18} aria-hidden />} label={t('emailLabel')}>
          <Link href={mailto} color="inherit" _hover={{ color: c.accent }} _focusVisible={FOCUS_RING}>
            {CONTACT_EMAIL}
          </Link>
        </DetailRow>

        <DetailRow icon={<WhatsAppIcon size={18} />} label={t('whatsappLabel')}>
          <SimplePhoneLinks hrefA={WHATSAPP_URL} labelA={WHATSAPP_DISPLAY} hrefB={WHATSAPP_URL_2} labelB={WHATSAPP_DISPLAY_2} />
        </DetailRow>

        <DetailRow icon={<TbBrandTelegram size={19} aria-hidden />} label={t('telegramLabel')}>
          <SimplePhoneLinks hrefA={TELEGRAM_URL} labelA={WHATSAPP_DISPLAY} hrefB={TELEGRAM_URL_2} labelB={WHATSAPP_DISPLAY_2} />
        </DetailRow>

        <DetailRow icon={<LuMapPin size={18} aria-hidden />} label={t('locationLabel')}>
          {t('locationText')}
        </DetailRow>
      </Flex>

      <Box mt={7} pt={6} borderTopWidth="1px" borderColor={c.line}>
        <Flex align="center" justify="space-between" gap={4}>
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
      </Box>
    </Box>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Flex align="flex-start" gap={3}>
      <Flex
        w="36px"
        h="36px"
        flexShrink={0}
        rounded="full"
        bg={c.accentSoft}
        color={c.accent}
        align="center"
        justify="center"
      >
        {icon}
      </Flex>

      <Box minW={0} pt={1}>
        <Text
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          fontSize="xs"
          letterSpacing="0.06em"
          textTransform="uppercase"
          color={c.textMuted}
          mb={0.5}
        >
          {label}
        </Text>
        {/* Box (div), не Text (p): рядки з двома номерами (SimplePhoneLinks)
            кладуть сюди Flex, а div усередині p — невалідна вкладеність. */}
        <Box fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.text} wordBreak="break-word">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

/** Два номери через "/", кожен зі своїм посиланням — WhatsApp і Telegram у простій картці. */
function SimplePhoneLinks({
  hrefA,
  labelA,
  hrefB,
  labelB,
}: {
  hrefA: string;
  labelA: string;
  hrefB: string;
  labelB: string;
}) {
  return (
    <Flex wrap="wrap" align="baseline" gap="4px">
      <Link href={hrefA} target="_blank" rel="noopener noreferrer" color="inherit" _hover={{ color: c.accent }} _focusVisible={FOCUS_RING}>
        {labelA}
      </Link>
      <Text as="span" color={c.textMuted}>
        /
      </Text>
      <Link href={hrefB} target="_blank" rel="noopener noreferrer" color="inherit" _hover={{ color: c.accent }} _focusVisible={FOCUS_RING}>
        {labelB}
      </Link>
    </Flex>
  );
}

/** Бейдж-іконка + підпис зверху + значення знизу — email/WhatsApp/Telegram на листі. */
function PaperRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Flex align="center" gap={2}>
      <Flex
        w="26px"
        h="26px"
        flexShrink={0}
        rounded="full"
        bg={c.accentSoft}
        color={c.accent}
        align="center"
        justify="center"
      >
        {icon}
      </Flex>
      <Box textAlign="left">
        <Text
          fontFamily="var(--font-brand-ui)"
          fontSize="9px"
          textTransform="uppercase"
          letterSpacing="0.06em"
          color={CARD_TEXT_MUTED}
        >
          {label}
        </Text>
        {children}
      </Box>
    </Flex>
  );
}

/** Два номери через "/", кожен зі своїм посиланням — спільний вигляд для WhatsApp і Telegram. */
function PhoneLinks({
  hrefA,
  labelA,
  hrefB,
  labelB,
}: {
  hrefA: string;
  labelA: string;
  hrefB: string;
  labelB: string;
}) {
  return (
    <Flex wrap="wrap" align="baseline" gap="4px">
      <Link
        href={hrefA}
        target="_blank"
        rel="noopener noreferrer"
        fontFamily="var(--font-brand-ui)"
        fontWeight="600"
        fontSize="xs"
        color={CARD_TEXT}
        _hover={{ color: CARD_ACCENT }}
        _focusVisible={FOCUS_RING}
      >
        {labelA}
      </Link>
      <Text as="span" fontSize="xs" color={CARD_TEXT_MUTED}>
        /
      </Text>
      <Link
        href={hrefB}
        target="_blank"
        rel="noopener noreferrer"
        fontFamily="var(--font-brand-ui)"
        fontWeight="600"
        fontSize="xs"
        color={CARD_TEXT}
        _hover={{ color: CARD_ACCENT }}
        _focusVisible={FOCUS_RING}
      >
        {labelB}
      </Link>
    </Flex>
  );
}
