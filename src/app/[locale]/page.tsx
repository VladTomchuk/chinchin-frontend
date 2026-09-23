import IntroBanner from '@/components/MainPage/IntroBanner/IntroBanner';
import HeroSection from '@/components/MainPage/HeroSection/HeroSection';
import EventTypesScroll from '@/components/MainPage/EventTypesScroll/EventTypesScroll';
import ServicesLateralScroll from '@/components/MainPage/ServicesLateralScroll/ServicesLateralScroll';
import EventServicesSlider from '@/components/MainPage/EventServicesSlider/EventServicesSlider';
import BrandsMarquee from '@/components/MainPage/BrandsMarquee/BrandsMarquee';
import DriftloomGallery from '@/components/MainPage/Driftloom/DriftloomGallery';
import TeamPreview from '@/components/MainPage/TeamPreview/TeamPreview';
import PlaceholderSections from '@/components/MainPage/PlaceholderSections/PlaceholderSections';
import HowWeWork from '@/components/MainPage/HowWeWork/HowWeWork';
import ReviewsSection from '@/components/GoogleReviews/ReviewsSection';
import ContactSection from '@/components/Contacts/ContactSection';
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

        {/* Паралакс-галерея фото подій (Driftloom) — візуальна пауза між
            брендами-партнерами й каруселлю послуг. */}
        {/* <DriftloomGallery /> */}

        <EventServicesSlider />

        {/* <EventTypesScroll /> */}
        {/* <ServicesLateralScroll /> */}
        <HowWeWork />

        {/* Соціальний доказ одразу після того, як показали, як ми працюємо.
            Карусель відгуків (стрілки/крапки/свайп) — дефолт компонента,
            а не пінована на скрол секція. */}
        <ReviewsSection />

        {/* Ціль кнопок IntroBanner і HowWeWork (обидві скролять на
            #quote-form) — форма запиту й картка "звʼязок напряму"
            (email/WhatsApp) поруч, той самий компонент, що на сторінці
            контактів. */}
        <ContactSection id="quote-form" />

        {/* ТИМЧАСОВО: рибні секції, щоб було видно повну прокрутку. */}
        {/* <PlaceholderSections />

        <HeroSection /> */}
      </div>
    </div>
  );
}
