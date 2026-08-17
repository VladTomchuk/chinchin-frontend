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
  // Статичний сегмент (services/healthy-bar) у файловій маршрутизації Next.js
  // перемагає [slug] — це означає лише, який файл рендерить сторінку, а не
  // те, як next-intl резолвить internal pathname для LocaleSwitcher/router.
  // Для цього explicit-запис усе одно потрібен: useParams() на бесспоук-
  // сторінці (customPage: true в data/services.ts, data/eventTypes.ts) не
  // містить slug (немає такого сегмента), тож якби next-intl зматчив URL на
  // шаблон "/services/[slug]", підстановка впала б з "Insufficient params".
  // next-intl сам пріоритизує статичні записи над динамічними при матчингу
  // (сортування в getSortedPathnames), тож explicit-запис нижче й вирішує це.
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/services': '/services',
    '/services/healthy-bar': '/services/healthy-bar',
    '/services/[slug]': '/services/[slug]',
    '/events': '/events',
    '/events/corporate-business-events': '/events/corporate-business-events',
    '/events/[slug]': '/events/[slug]',
  },
});
