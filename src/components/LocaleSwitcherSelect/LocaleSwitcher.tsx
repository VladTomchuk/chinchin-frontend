'use client';

import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const items = routing.locales.map((cur) => ({
    value: cur,
    label: t(`locale.${cur}`),
  }));

  return <LocaleSwitcherSelect items={items} defaultValue={locale} label={t('label')} />;
}
