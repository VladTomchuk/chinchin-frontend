import type { IconType } from 'react-icons';
import { LuFacebook, LuInstagram, LuLinkedin, LuYoutube } from 'react-icons/lu';

// Єдине джерело даних про соцмережі команди — і для навбару (navigation.ts
// імпортує INSTAGRAM_URL звідси), і для списку іконок унизу секції "команда"
// на головній. LinkedIn/Facebook/YouTube поки без акаунтів, тож лишаються
// порожніми рядками.
export const INSTAGRAM_URL =
  'https://www.instagram.com/chinchincatering_bcn?igsi=MW91ejlkaWo3aDQ2Mw%3D%3D&utm_source=qr';
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/chin-chin-bar-catering-05a704388?utm_source=share_via&utm_content=profile&utm_medium=member_ios';
export const FACEBOOK_URL = 'https://www.facebook.com/share/1PkDq8bag9/?mibextid=wwXIfr';
export const YOUTUBE_URL = '';

// TODO: замінити на реальний номер (код країни + номер, без "+", пробілів і
// провідного 0), напр. іспанський '34612345678'. Поки що заглушка, кнопка
// WhatsApp відкриє чат із неіснуючим номером, доки значення не замінять.
export const WHATSAPP_NUMBER = '34698458276';
// Другий номер — картка контактів показує обидва поруч через "/", кожен зі
// своїм посиланням на чат (два канали замість одного).
export const WHATSAPP_NUMBER_2 = '34698458286';
export const WHATSAPP_MESSAGE = 'Hola! Me gustaría pedir información sobre Chin Chin catering.';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const WHATSAPP_URL_2 = `https://wa.me/${WHATSAPP_NUMBER_2}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Людський формат номера (код країни + групи по 3 цифри) для показу в UI,
// напр. картка контактів на сторінці Contacts. WHATSAPP_URL лишається
// суцільним рядком під wa.me — це лише похідне значення для відображення.
function formatDisplayPhone(number: string): string {
  return `+${number.slice(0, 2)} ${number.slice(2).match(/.{1,3}/g)?.join(' ') ?? number.slice(2)}`;
}

export const WHATSAPP_DISPLAY = formatDisplayPhone(WHATSAPP_NUMBER);
export const WHATSAPP_DISPLAY_2 = formatDisplayPhone(WHATSAPP_NUMBER_2);

// Той самий номер — Telegram deep-link за номером телефону (не за юзернеймом,
// якого в команди нема): https://t.me/+<номер> відкриває чат так само, як
// wa.me робить для WhatsApp.
export const TELEGRAM_URL = `https://t.me/+${WHATSAPP_NUMBER}`;
export const TELEGRAM_URL_2 = `https://t.me/+${WHATSAPP_NUMBER_2}`;

export type SocialKey = 'instagram' | 'linkedin' | 'facebook' | 'youtube';

export type SocialLink = {
  key: SocialKey;
  href: string;
  Icon: IconType;
};

// Порядок — той, у якому іконки йдуть у секції "команда" на головній.
export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'instagram', href: INSTAGRAM_URL, Icon: LuInstagram },
  { key: 'linkedin', href: LINKEDIN_URL, Icon: LuLinkedin },
  { key: 'facebook', href: FACEBOOK_URL, Icon: LuFacebook },
  //{ key: 'youtube', href: YOUTUBE_URL, Icon: LuYoutube },
];
