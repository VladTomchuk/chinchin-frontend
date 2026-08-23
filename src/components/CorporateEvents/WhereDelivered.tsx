import { Box, Grid, Table, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { LuMapPin } from 'react-icons/lu';
import Gallery from '@/components/shared/Gallery';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import { c } from '@/components/shared/tokens';
import { eventPhotos } from '@/data/eventPhotos';

type Row = { city: string; event: string };

export default async function WhereDelivered() {
  const t = await getTranslations('CorporateEvents.delivered');
  const tGallery = await getTranslations('CorporateEvents.gallery');
  const rows = t.raw('rows') as Row[];

  // alt-и лежать у перекладах під ключем із самої фотографії, щоб текст був
  // мовою сторінки, а не мовою імені файлу.
  const alts = eventPhotos.map((photo) => tGallery(`alt.${photo.altKey}`));

  return (
    <Section>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <SectionTitle mb={{ base: 8, md: 12 }} maxW="24ch">
        {t('title')}
      </SectionTitle>

      {/* На вузьких екранах таблиця з двох колонок читається гірше за картки,
          тому там — картки, а таблиця вмикається з md. */}
      <Grid
        display={{ base: 'grid', md: 'none' }}
        gap={3}
        templateColumns="1fr"
        mb={{ base: 8, md: 0 }}
      >
        {rows.map((row) => (
          <Box
            key={row.city}
            bg={c.surface}
            borderWidth="1px"
            borderColor={c.line}
            rounded="xl"
            px={5}
            py={4}
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Box color={c.accent} display="grid" placeItems="center">
              <LuMapPin size={18} aria-hidden />
            </Box>
            <Box>
              <Text
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="md"
                color={c.text}
                lineHeight="1.3"
              >
                {row.city}
              </Text>
              <Text fontFamily="var(--font-brand-ui)" fontSize="sm" color={c.textMuted}>
                {row.event}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>

      <Box display={{ base: 'none', md: 'block' }} maxW="640px">
        <Table.Root size="md" variant="outline" bg={c.surface} rounded="xl" overflow="hidden">
          <Table.Header>
            <Table.Row bg={c.surfaceAlt}>
              <Table.ColumnHeader
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="xs"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={c.textMuted}
              >
                {t('cityLabel')}
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="var(--font-brand-ui)"
                fontWeight="600"
                fontSize="xs"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={c.textMuted}
              >
                {t('eventLabel')}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.city} bg={c.surface}>
                <Table.Cell
                  fontFamily="var(--font-brand-ui)"
                  fontWeight="600"
                  fontSize="md"
                  color={c.text}
                >
                  {row.city}
                </Table.Cell>
                <Table.Cell fontFamily="var(--font-brand-ui)" fontSize="md" color={c.textMuted}>
                  {row.event}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Box mt={{ base: 8, md: 12 }}>
        <Gallery photos={eventPhotos} alts={alts} emptyText={tGallery('empty')} />
      </Box>

      <Text
        fontFamily="var(--font-brand-ui)"
        fontSize={{ base: 'sm', md: 'md' }}
        lineHeight="1.75"
        color={c.textMuted}
        maxW="70ch"
        mt={{ base: 8, md: 10 }}
      >
        {t('caption')}
      </Text>
    </Section>
  );
}
