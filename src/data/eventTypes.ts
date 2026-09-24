import type { IconType } from 'react-icons';
import { LuBriefcase, LuHeart } from 'react-icons/lu';

// Слаги — єдине джерело правди для маршрутів /events/{slug} і для звʼязків із
// послугами. Тексти (назва, опис, мета-теги) тут навмисно не лежать: сайт
// двомовний, тож весь текст живе в messages/{ua,en}.json під ключем
// EventItems.{slug}. Інакше дані були б одномовними.
export const eventTypeSlugs = ['corporate-business-events', 'weddings'] as const;

export type EventTypeSlug = (typeof eventTypeSlugs)[number];

export type EventType = {
  slug: EventTypeSlug;
  /** Іконка картки. Не текст, тому лишається в даних, а не в перекладах. */
  Icon: IconType;
  /**
   * true — тип події має власну сторінку з ручною версткою в
   * app/[locale]/events/{slug}/. Статичний маршрут у Next.js перемагає
   * динамічний [slug], тож такі слаги виключаються з generateStaticParams
   * шаблонної сторінки, щоб не було двох маршрутів на одну адресу.
   */
  customPage?: true;
};

export const eventTypes: EventType[] = [
  { slug: 'corporate-business-events', Icon: LuBriefcase, customPage: true },
  { slug: 'weddings', Icon: LuHeart },
];

/**
 * Додаткові варіанти поля "Тип події" у формі запиту (QuoteForm) — навмисно
 * НЕ типи події каталогу: без картки на /events, без власної сторінки й
 * meta-тегів, без запису в sitemap. Це просто контекст для листа менеджеру
 * ("з чим прийшов клієнт"), тому вони не в eventTypeSlugs/eventTypes вище —
 * інакше /events/{slug} (перевірка там теж через isEventTypeSlug) віддав би
 * для них живу, але порожню сторінку.
 */
export const extraEventTypeValues = ['private-party', 'brand-activation', 'other'] as const;

export type ExtraEventTypeValue = (typeof extraEventTypeValues)[number];

// Ключ перекладу в messages/{locale}.json → QuoteForm.eventTypeExtra.* —
// спільний для випадаючого списку форми (клієнт, QuoteForm.tsx) і листа
// менеджеру (сервер, app/api/contact/route.ts), щоб підпис не розʼїхався.
export const extraEventTypeLabelKeys: Record<ExtraEventTypeValue, string> = {
  'private-party': 'eventTypeExtra.privateParty',
  'brand-activation': 'eventTypeExtra.brandActivation',
  other: 'eventTypeExtra.other',
};
