import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import JsonLd from '@/components/shared/JsonLd';
import { buildLocalBusinessJsonLd } from '@/lib/seo';
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

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Homepage.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <div>
      <div>
        <JsonLd data={jsonLd} />
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
