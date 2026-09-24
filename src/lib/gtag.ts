declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

/**
 * Тонка обгортка над window.gtag: без неї кожен виклик довелося б окремо
 * перевіряти на `typeof window.gtag === 'function'`. gtag зʼявляється лише
 * після згоди відвідувача на аналітичні cookies (CookieConsent/GoogleTags.tsx
 * вантажить скрипт лише тоді) — до цього моменту виклик тут просто no-op, а
 * не помилка.
 */
export function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/**
 * Конверсія для Google Ads на успішну відправку QuoteForm.tsx — саме на цю
 * подію Ads орієнтує оптимізацію показів. Без обох значень в env (кампанія
 * ще не налаштована) виклик тихо нічого не робить.
 *
 * page_path (звідки саме відправили форму — QuoteForm стоїть майже на
 * кожній сторінці сайту) їде як параметр події: у звітах GA4 його видно
 * одразу в деталях події, а щоб розрізняти/фільтрувати по ньому в таблицях
 * і Explore-звітах, param page_path треба один раз зареєструвати як custom
 * dimension (GA4 → Admin → Custom definitions) — сам параметр іде вже зараз.
 */
export function trackQuoteFormConversion(page: string) {
  if (!GOOGLE_ADS_ID || !GOOGLE_ADS_CONVERSION_LABEL) return;
  gtagEvent('conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    page_path: page,
  });
}
