import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
  // Значення — шлях БЕЗ префікса локалі: його додає middleware.
  //
  // Послуги й типи подій — два паралельні розділи верхнього рівня, не вкладені
  // один в одного: звʼязок між ними many-to-many (див. src/data/relations.ts),
  // і будь-яка вкладеність зробила б одну зі сторін «головною».
  //
  // Динамічні записи покривають і сторінки з ручною версткою: у Next.js
  // статичний сегмент (services/healthy-bar) перемагає [slug], тож окремий
  // запис у pathnames для нього не потрібен.
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/services': '/services',
    '/services/[slug]': '/services/[slug]',
    '/events': '/events',
    '/events/[slug]': '/events/[slug]',
  },
});
