import type { IconType } from 'react-icons';
import { LuConciergeBell, LuInstagram, LuPartyPopper, LuUsers } from 'react-icons/lu';

// TODO: підставити реальний профіль, напр. 'https://www.instagram.com/chinchin.bar'.
// Поки рядок порожній, пункт Instagram не рендериться — щоб у меню не було
// посилання в нікуди.
export const INSTAGRAM_URL = '';

type InternalItem = {
  key: 'services' | 'events' | 'about';
  kind: 'internal';
  // Шлях має бути оголошений у pathnames (i18n/routing.ts), інакше типізований
  // Link із next-intl його не прийме.
  href: '/services' | '/events' | '/about';
  Icon: IconType;
};

type ExternalItem = {
  key: 'instagram';
  kind: 'external';
  href: string;
  Icon: IconType;
};

export type NavItem = InternalItem | ExternalItem;

// Порядок — згори вниз, як у меню.
export const NAV_ITEMS: NavItem[] = [
  { key: 'services', kind: 'internal', href: '/services', Icon: LuConciergeBell },
  { key: 'events', kind: 'internal', href: '/events', Icon: LuPartyPopper },
  { key: 'about', kind: 'internal', href: '/about', Icon: LuUsers },
  { key: 'instagram', kind: 'external', href: INSTAGRAM_URL, Icon: LuInstagram },
];

// Пункти без адреси не показуємо: краще коротше меню, ніж посилання в нікуди.
export const visibleNavItems = () => NAV_ITEMS.filter((item) => item.href.length > 0);
