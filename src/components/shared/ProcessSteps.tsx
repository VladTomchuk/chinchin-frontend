import { Stack } from '@chakra-ui/react';
import { Eyebrow, Section, SectionTitle } from '@/components/shared/primitives';
import ProcessStepCard from '@/components/shared/ProcessStepCard';

export type ProcessStep = { name: string; text: string };

type ProcessStepsProps = {
  eyebrow: string;
  title: string;
  items: ProcessStep[];
  /** CTA під першим кроком — куди ведеться клієнт, що готовий почати. Без нього кроки йдуть без кнопки. */
  cta?: { label: string; href: string };
};

// Атмосферні кадри барного сервісу Chin Chin (public/events) — той самий
// прийом декоративних фото, що DECORATIVE_PHOTOS у
// MainPage/EventTypesScroll.tsx: кадри не прив'язані буквально до
// конкретного кроку (немає окремого фото "заповнення брифу"), тож циклічно
// підставляються по індексу, а вся унікальна інформація лишається в тексті
// поруч (звідси alt="" у ProcessStepCard.tsx).
const PHOTOS = [
  '/events/bar-service-01.jpg',
  '/events/bar-service-02.jpg',
  '/events/bar-service-03.jpg',
  '/events/bar-service-04.jpg',
  '/events/bar-service-05.jpg',
  '/events/bar-service-06.jpg',
];

/**
 * Нумерований таймлайн кроків "як ми працюємо" — раніше жив лише
 * в components/About/Process.tsx (сторінка "Про нас"). Компонент суто
 * презентаційний: не знає нічого про переклади чи конкретну сторінку — весь
 * текст і посилання CTA приходять пропсами, тож будь-яка сторінка може
 * показати свій набір кроків, підставивши власні дані з власного простору
 * перекладів. Розмітку й анімацію кожного кроку (фото, бейдж, рейка-конектор,
 * поява при скролі) дає shared/ProcessStepCard.tsx.
 *
 * Не плутати з HealthyBar/Process.tsx: та сторінка показує процес як сітку
 * карток (4 пункти, без CTA і без фото) — інший, самостійний дизайн, а не
 * той самий компонент з іншими даними, тож лишається окремою реалізацією.
 */
export default function ProcessSteps({ eyebrow, title, items, cta }: ProcessStepsProps) {
  return (
    <Section>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle mb={{ base: 10, md: 14 }}>{title}</SectionTitle>

      <Stack as="ol" gap={0} maxW="960px" listStyleType="none">
        {items.map((item, i) => (
          <ProcessStepCard
            key={item.name}
            index={i}
            item={item}
            photo={PHOTOS[i % PHOTOS.length]}
            isLast={i === items.length - 1}
            cta={cta}
          />
        ))}
      </Stack>
    </Section>
  );
}
