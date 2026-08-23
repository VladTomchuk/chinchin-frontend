import type { MetadataRoute } from 'next';
import { absoluteUrl, SITE_URL } from '@/config/site';

/**
 * Обхід дозволений повністю: закривати нема чого, а сторінки послуг живуть під
 * префіксом локалі (/en/services/…, /ua/services/…), тож будь-яке правило
 * вужче за "/" довелося б переписувати з кожною новою мовою.
 *
 * Закриті тільки службові маршрути Next.js — у видачі їм робити нічого.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
