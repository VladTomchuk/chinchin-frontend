import type { IconType } from 'react-icons';
import { LuConciergeBell, LuMail, LuUsers } from 'react-icons/lu';

export type NavItem = {
  key: 'services' | 'about' | 'contacts';
  // Усі три пункти ведуть не на окремі сторінки, а на якорі відповідних
  // секцій прямо на головній: "Послуги" — на каруселі послуг
  // (EventServicesSlider, id="services-by-event"), "About" — на секцію "про
  // нас" (TeamPreview, id="about"; сама сторінка /about тимчасово прихована,
  // ABOUT_HIDDEN нижче), "Контакти" — на форму запиту (ContactSection,
  // id="quote-form"). Сторінки /services і /about лишаються доступними
  // напряму за URL, просто поза меню. Значення мусить бути оголошене в
  // pathnames (i18n/routing.ts), інакше типізований Link із next-intl його не
  // прийме.
  href: { pathname: '/'; hash: string };
  Icon: IconType;
};

// ТИМЧАСОВО: ці дві сторінки прибрані з показу — той самий принцип, що
// Service.status === 'soon' у data/services.ts. Кожен прапорець керує адресою
// в сайтмапі (app/sitemap.ts) і самим вмістом сторінки (app/[locale]/about/
// page.tsx, app/[locale]/services/page.tsx — показують заглушку замість
// реального вмісту), а також кнопками по сайту, що вели на ці сторінки
// (About/Hero, About/Offer, TeamPreview, EventServicesSlider тощо — там
// лишається "Soon"). У меню (NAV_ITEMS нижче) обидва прапорці більше не
// задіяні: пункти "Послуги" й "About" ведуть на якорі домашньої сторінки, а
// не на самі приховані сторінки, тож позначка "Soon" там не потрібна.
export const ABOUT_HIDDEN = true;
export const SERVICES_CATALOG_HIDDEN = true;

// Порядок — згори вниз, як у меню.
export const NAV_ITEMS: NavItem[] = [
  { key: 'services', href: { pathname: '/', hash: 'services-by-event' }, Icon: LuConciergeBell },
  { key: 'about', href: { pathname: '/', hash: 'about' }, Icon: LuUsers },
  { key: 'contacts', href: { pathname: '/', hash: 'quote-form' }, Icon: LuMail },
];

export const visibleNavItems = () => NAV_ITEMS;
