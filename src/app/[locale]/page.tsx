import IntroBanner from '@/components/MainPage/IntroBanner/IntroBanner';
import HeroSection from '@/components/MainPage/HeroSection/HeroSection';
// import HeroReveal from '@/components/MainPage/HeroReveal/HeroReveal';
import EventTypesScroll from '@/components/MainPage/EventTypesScroll/EventTypesScroll';
import PlaceholderSections from '@/components/MainPage/PlaceholderSections/PlaceholderSections';
import { setRequestLocale } from 'next-intl/server';
// import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  // const t = await getTranslations('Homepage');

  return (
    <div>
      <div>
        <IntroBanner />
        <HeroSection />
        {/* HeroReveal тимчасово вимкнено */}
        {/* <HeroReveal /> */}
        <PlaceholderSections />
        <EventTypesScroll />
        {/* ТИМЧАСОВО: рибні секції, щоб було видно повну прокрутку. */}
        <PlaceholderSections indented />
        {/* <h1>{t('title')}</h1>
        <p>{t('content')}</p> */}
      </div>
    </div>
  );
}
