import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuMail, LuMapPin } from 'react-icons/lu';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/config/site';
import { SOCIAL_LINKS, WHATSAPP_URL } from '@/config/socials';
import { WhatsAppIcon } from '@/components/shared/icons/WhatsAppIcon';

/**
 * Картка "звʼязок напряму" поряд із формою (ContactSection.tsx): email,
 * WhatsApp, локація команди й соцмережі — для тих, хто хоче написати одразу,
 * не заповнюючи форму.
 */
export default async function ContactDetails() {
  const t = await getTranslations('Contacts.details');
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <Box
      bg={c.surface}
      borderWidth="1px"
      borderColor={c.line}
      rounded="3xl"
      p={{ base: 6, md: 8 }}
      h="fit-content"
    >
      <Heading
        as="h2"
        fontFamily="var(--font-brand-ui)"
        fontWeight="600"
        fontSize="lg"
        color={c.text}
        mb={6}
      >
        {t('title')}
      </Heading>

      <Flex direction="column" gap={5}>
        <DetailRow icon={<LuMail size={18} aria-hidden />} label={t('emailLabel')}>
          <Link
            href={mailto}
            color="inherit"
            _hover={{ color: c.accent }}
            _focusVisible={FOCUS_RING}
          >
            {CONTACT_EMAIL}
          </Link>
        </DetailRow>

        <DetailRow icon={<WhatsAppIcon size={18} />} label={t('whatsappLabel')}>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            _hover={{ color: c.accent }}
            _focusVisible={FOCUS_RING}
          >
            {t('whatsappCta')}
          </Link>
        </DetailRow>

        <DetailRow icon={<LuMapPin size={18} aria-hidden />} label={t('locationLabel')}>
          {t('locationText')}
        </DetailRow>
      </Flex>

      <Box mt={7} pt={6} borderTopWidth="1px" borderColor={c.line}>
        <Text
          fontFamily="var(--font-brand-ui)"
          fontWeight="600"
          fontSize="xs"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color={c.textMuted}
          mb={3}
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
        <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.text} wordBreak="break-word">
          {children}
        </Text>
      </Box>
    </Flex>
  );
}
