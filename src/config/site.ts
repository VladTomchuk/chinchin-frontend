import type { Locale } from '@/i18n/routing';

/**
 * Дані про сайт як про ресурс: адреса, організація, коди мов. Усе, що потрібно
 * для канонічних URL, hreflang, Open Graph і JSON-LD, лежить тут в одному місці —
 * інакше домен розповзся б копіями по sitemap, robots і кожній сторінці окремо.
 */

// Продакшн-адреса поки ніде в проєкті не зафіксована (у .env лише API_URL), тож
// значення за замовчуванням виведене з поштового домену команди. Якщо сайт
// поїде на інший домен — достатньо задати NEXT_PUBLIC_SITE_URL, правити код не
// доведеться. Кінцевий слеш зрізаємо, щоб конкатенація не давала подвійний.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chinchinevents.com').replace(
  /\/+$/,
  '',
);

export const CONTACT_EMAIL = 'info@chinchinevents.com';

export const ORGANIZATION = {
  name: 'ChinChin Bar Catering',
  email: CONTACT_EMAIL,
  logo: '/black_chinchin_logo.svg',
  addressLocality: 'Barcelona',
  addressCountry: 'ES',
} as const;

/**
 * Код локалі в URL — 'ua' (усталений у проєкті), але валідний BCP-47 тег
 * української мови — 'uk'. Та сама підміна, що вже є в middleware.ts і в
 * html[lang] у layout.tsx: в адресі лишається /ua, а пошуковику і hreflang
 * віддаємо 'uk', інакше Google просто проігнорує невідомий йому код мови.
 */
export const BCP47_LOCALE: Record<Locale, string> = { en: 'en', ua: 'uk' };

/** Open Graph очікує формат language_TERRITORY, а не голий код мови. */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', ua: 'uk_UA' };

/** Абсолютний URL із шляху від кореня сайту. Потрібен для canonical, OG і JSON-LD. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
