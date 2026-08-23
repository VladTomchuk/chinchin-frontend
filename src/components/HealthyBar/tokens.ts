// Кольори та відступи переїхали в components/shared/tokens.ts — тепер це один
// спільний набір на весь сайт. Файл лишений як реекспорт, щоб не переписувати
// імпорти в компонентах цієї сторінки.
export { c, FOCUS_RING, NAVBAR_OFFSET, CONTENT_MAX_WIDTH } from '@/components/shared/tokens';

// Адреса переїхала в config/site.ts — вона потрібна і в JSON-LD, і в CTA, тож
// однією сторінкою більше не обмежується. Реекспорт лишений, щоб не переписувати
// імпорти в компонентах цієї сторінки.
export { CONTACT_EMAIL } from '@/config/site';
