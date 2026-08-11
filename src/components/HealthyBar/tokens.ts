// Кольори та відступи переїхали в components/shared/tokens.ts — тепер це один
// спільний набір на весь сайт. Файл лишений як реекспорт, щоб не переписувати
// імпорти в компонентах цієї сторінки.
export { c, FOCUS_RING, NAVBAR_OFFSET, CONTENT_MAX_WIDTH } from '@/components/shared/tokens';

// Специфічне саме для цієї сторінки: адреса, на яку ведуть її CTA.
export const CONTACT_EMAIL = 'info@chinchinevents.com';
