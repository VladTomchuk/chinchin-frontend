import { Box, Heading, Text } from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { c, CONTENT_MAX_WIDTH } from './tokens';

// Спільні будівельні блоки для сторінок каталогу (services, events) і для
// шаблонних сторінок [slug]. PageTitle і SectionTitle розділені навмисно: на
// сторінці має бути рівно один h1, решта заголовків секцій — h2.

// Фон секції задано тут, а не на кожному місці виклику. Раніше кожна секція
// сама обирала `c.page` або `c.surfaceAlt`, і сторінки йшли смугами через одну.
// Система трималася на дисципліні, тож збої проникали непомітно — на Healthy Bar
// дві останні секції обидві були `surfaceAlt` і зливались у подвійну смугу.
// Тепер полотно сторінки одне (`c.page`), а глибину дають картки (`c.surface`)
// та лінії (`c.line`). Значення все ще можна перекрити пропом `bg`, але робити
// це варто свідомо — за замовчуванням усі секції однакові.
export function Section({ children, ...rest }: BoxProps) {
  return (
    <Box
      as="section"
      bg={c.page}
      px={{ base: 5, md: 8 }}
      py={{ base: 16, md: 24 }}
      {...rest}
    >
      <Box maxW={CONTENT_MAX_WIDTH} mx="auto">
        {children}
      </Box>
    </Box>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily="var(--font-brand-ui)"
      fontWeight="600"
      fontSize="xs"
      letterSpacing="0.16em"
      textTransform="uppercase"
      color={c.accent}
      mb={4}
    >
      {children}
    </Text>
  );
}

export function PageTitle({ children, ...rest }: BoxProps) {
  return (
    <Heading
      as="h1"
      fontFamily="var(--font-brand)"
      fontWeight="200"
      lineHeight="1.1"
      fontSize={{ base: '2.5rem', md: '3.5rem' }}
      color={c.text}
      {...rest}
    >
      {children}
    </Heading>
  );
}

export function SectionTitle({ children, ...rest }: BoxProps) {
  return (
    <Heading
      as="h2"
      fontFamily="var(--font-brand)"
      fontWeight="200"
      lineHeight="1.1"
      fontSize={{ base: '2rem', md: '3rem' }}
      color={c.text}
      {...rest}
    >
      {children}
    </Heading>
  );
}

export function Lead({ children, ...rest }: BoxProps) {
  return (
    <Text
      fontFamily="var(--font-brand-ui)"
      fontWeight="400"
      fontSize={{ base: 'md', md: 'lg' }}
      lineHeight="1.7"
      color={c.textMuted}
      maxW="62ch"
      {...rest}
    >
      {children}
    </Text>
  );
}
