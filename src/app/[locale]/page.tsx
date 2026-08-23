import IntroBanner from '@/components/MainPage/IntroBanner/IntroBanner';
import HeroSection from '@/components/MainPage/HeroSection/HeroSection';
import EventTypesScroll from '@/components/MainPage/EventTypesScroll/EventTypesScroll';
import ServicesLateralScroll from '@/components/MainPage/ServicesLateralScroll/ServicesLateralScroll';
import EventServicesSlider from '@/components/MainPage/EventServicesSlider/EventServicesSlider';
import BrandsMarquee from '@/components/MainPage/BrandsMarquee/BrandsMarquee';
import TeamPreview from '@/components/MainPage/TeamPreview/TeamPreview';
import PlaceholderSections from '@/components/MainPage/PlaceholderSections/PlaceholderSections';
import ReviewsSection from '@/components/GoogleReviews/ReviewsSection';
import { setRequestLocale } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div>
      <div>
        <IntroBanner />
        <TeamPreview />
        <BrandsMarquee />
        <EventServicesSlider />

        <EventTypesScroll />
        <ServicesLateralScroll />
        {/* Соціальний доказ одразу після того, як показали, що саме робимо. */}
        <ReviewsSection />

        {/* ТИМЧАСОВО: рибні секції, щоб було видно повну прокрутку. */}
        <PlaceholderSections />

        <HeroSection />
      </div>
    </div>
  );
}
