import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': {
      ua: '/ua/about',
    },
  },
});
