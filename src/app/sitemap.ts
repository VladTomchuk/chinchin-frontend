import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { services } from '@/data/services';
import { eventTypes } from '@/data/eventTypes';
import { ABOUT_HIDDEN, SERVICES_CATALOG_HIDDEN } from '@/config/navigation';
import { absoluteUrl, BCP47_LOCALE } from '@/config/site';

/**
 * Мапа сайту. Адреси не перелічені руками, а зібрані з тих самих даних, що й
 * самі сторінки (data/services.ts, data/eventTypes.ts) — додали послугу в
 * масив, і вона зʼявилась у мапі в обох мовах сама. Список, який ведуть окремо,
 * рано чи пізно відстає від сайту.
 *
 * Вісім послуг × дві мови = шістнадцять адрес послуг, плюс індексні сторінки й
 * типи подій.
 *
 * У кожного запису є alternates.languages: так пошуковик бачить, що /en/… і
 * /ua/… — переклади однієї сторінки, а не дублікати. Ключ — код мови ('uk'), а
 * не код локалі в URL ('ua'): у мапі діють ті самі правила, що й у hreflang.
 */

// Шляхи без префікса локалі — префікс додається для кожної мови нижче.
const STATIC_PATHS = ['', '/about', '/services', '/events', '/contacts'] as const;

type Entry = { path: string; changeFrequency: 'monthly' | 'yearly'; priority: number };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    // ABOUT_HIDDEN / SERVICES_CATALOG_HIDDEN (config/navigation.ts) — сторінки
    // тимчасово прибрані, URL віддає заглушку з noindex (about/page.tsx,
    // services/page.tsx), тож у мапі їм робити нічого.
    ...STATIC_PATHS.filter((path) => {
      if (path === '/about') return !ABOUT_HIDDEN;
      if (path === '/services') return !SERVICES_CATALOG_HIDDEN;
      return true;
    }).map((path) => ({
      path,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    // 'soon' — послуга ще не запущена, URL віддає ComingSoon (робить noindex,
    // src/lib/seo.ts) замість сторінки послуги, тож у мапі їй робити нічого:
    // sitemap не повинен активно пропонувати пошуковику саме те, що noindex
    // просить не індексувати.
    ...services
      .filter((service) => service.status !== 'soon')
      .map((service) => ({
        path: `/services/${service.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ...eventTypes.map((eventType) => ({
      path: `/events/${eventType.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const lastModified = new Date();

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${entry.path}`),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [BCP47_LOCALE[alt], absoluteUrl(`/${alt}${entry.path}`)]),
        ),
      },
    })),
  );
}
