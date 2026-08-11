import type { IconType } from 'react-icons';
import { LuLeaf, LuMartini } from 'react-icons/lu';
import type { EventTypeSlug } from './eventTypes';

// Тексти (назва, опис, мета-теги) тут навмисно не лежать — вони в
// messages/{ua,en}.json під ключем ServiceItems.{slug}. Див. коментар у
// eventTypes.ts.
export const serviceSlugs = ['healthy-bar', 'cocktail-bar'] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type Service = {
  slug: ServiceSlug;
  /** Іконка картки. Не текст, тому лишається в даних, а не в перекладах. */
  Icon: IconType;
  /**
   * Типи подій, для яких послуга доречна. Звʼязок many-to-many описаний тільки
   * тут, в один бік. Зворотний ("які послуги радити для цієї події") не
   * дублюємо — його виводить фільтр у relations.ts, інакше два списки рано чи
   * пізно розійшлися б.
   */
  eventTypes: EventTypeSlug[];
  /**
   * true — послуга має власну сторінку з ручною версткою в
   * app/[locale]/services/{slug}/. Такі слаги виключаються з
   * generateStaticParams шаблонної сторінки [slug]: статичний маршрут у Next.js
   * і так перемагає динамічний, а генерувати обидва немає сенсу.
   */
  customPage?: true;
};

export const services: Service[] = [
  {
    slug: 'healthy-bar',
    Icon: LuLeaf,
    eventTypes: ['corporate-business-events'],
    customPage: true,
  },
  {
    slug: 'cocktail-bar',
    Icon: LuMartini,
    eventTypes: ['corporate-business-events', 'weddings'],
  },
];
