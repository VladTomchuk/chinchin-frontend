import HeroSection from '@/components/MainPage/HeroSection/HeroSection';
import { setRequestLocale } from 'next-intl/server';
// import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  // const t = await getTranslations('Homepage');

  return (
    <div>
      <div>
        <HeroSection />
        {/* <h1>{t('title')}</h1>
        <p>{t('content')}</p> */}
      </div>
    </div>
  );
}
