import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export default function Home({ params }: any) {
  const { locale } = params;

  setRequestLocale(locale);

  const t = useTranslations('Homepage');

  return (
    <div>
      <div>
        <h1>{t('title')}</h1>
        <p>{t('content')}</p>
      </div>
    </div>
  );
}
