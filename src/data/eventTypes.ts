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
