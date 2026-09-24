/**
 * Надсилання листів через SMTP поштової скриньки Titan Email — тієї, що на
 * домені chinchinevents.com (CONTACT_EMAIL, config/site.ts). Titan — провайдер
 * поштової скриньки, а не окремий сервіс розсилок: авторизуємось логіном й
 * паролем самої скриньки й надсилаємо від її імені собі ж, з Reply-To на
 * відвідувача сайту — команда відповідає прямо з клієнта пошти, не заходячи
 * нікуди окремо.
 *
 * Той самий компроміс, що й у lib/reviews.ts з GOOGLE_PLACES_API_KEY: якщо
 * пароль скриньки ще не заданий в оточенні — ендпоінт (app/api/contact/route.ts)
 * віддає 'unconfigured', а не падає й не показує відвідувачу технічну помилку.
 *
 * Файл серверний: читає TITAN_SMTP_PASSWORD, змінну без префікса NEXT_PUBLIC_.
 * Імпортувати можна лише з серверних модулів (API routes, RSC) — так само, як
 * lib/reviews.ts.
 */

import nodemailer from 'nodemailer';
import { CONTACT_EMAIL } from '@/config/site';

// smtp.titan.email:465 (SSL) — стандартний вихідний сервер Titan Email,
// той самий, що наведений у їхній інструкції з налаштування поштових клієнтів.
// Хост/порт винесені в оточення на випадок, якщо колись знадобиться інший
// провайдер без правок коду — але за замовчуванням це саме Titan.
const SMTP_HOST = process.env.TITAN_SMTP_HOST ?? 'smtp.titan.email';
const SMTP_PORT = Number(process.env.TITAN_SMTP_PORT ?? 465);

// Скринька, від імені якої йде авторизація й лист. За замовчуванням та сама,
// що й публічна контактна адреса (CONTACT_EMAIL) — окрему технічну скриньку
// заводити не обов'язково, лист просто приходить у ту саму пошту, куди й так
// пишуть клієнти.
const SMTP_USER = process.env.TITAN_SMTP_USER || CONTACT_EMAIL;
const SMTP_PASSWORD = process.env.TITAN_SMTP_PASSWORD;

export type ContactRequest = {
  name: string;
  email: string;
  phone: string;
  /** Уже перекладена назва (напр. "Весілля"), не слаг — рахує api/contact/route.ts. */
  eventType: string;
  /** yyyy-mm-dd (input[type=date]) або порожній рядок, якщо не вказано. */
  eventDate: string;
  service: string;
  guests: string;
  location: string;
  message: string;
  /** Абсолютний URL сторінки, з якої відправлена форма — рахує api/contact/route.ts. */
  page: string;
};

export type SendContactEmailResult =
  | { status: 'ok' }
  | { status: 'unconfigured'; message: string }
  | { status: 'error'; message: string };

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  // Транспорт створюємо один раз і перевикористовуємо між викликами (в межах
  // одного серверного процесу) — так само, як Data Cache в lib/reviews.ts
  // уникає зайвого мережевого хопу на кожен запит.
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }
  return cachedTransporter;
}

/**
 * Надсилає команді лист із заявкою з форми контактів. Reply-To — email
 * відвідувача: відповідь із поштового клієнта команди йде напряму йому,
 * а не на технічну скриньку сайту.
 */
export async function sendContactEmail(data: ContactRequest): Promise<SendContactEmailResult> {
  if (!SMTP_PASSWORD) {
    return {
      status: 'unconfigured',
      message: 'Не задано TITAN_SMTP_PASSWORD — надсилання листів вимкнено.',
    };
  }

  const lines = [
    `Імʼя: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Телефон: ${data.phone}` : null,
    data.page ? `Сторінка заявки: ${data.page}` : null,
    data.eventType ? `Тип події: ${data.eventType}` : null,
    data.eventDate ? `Дата події: ${data.eventDate}` : null,
    data.service ? `Послуга: ${data.service}` : null,
    data.guests ? `Кількість гостей: ${data.guests}` : null,
    data.location ? `Локація: ${data.location}` : null,
    '',
    data.message,
  ].filter((line): line is string => line !== null);

  try {
    await getTransporter().sendMail({
      from: `"ChinChin website" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `Заявка з сайту — ${data.name}`,
      text: lines.join('\n'),
    });

    return { status: 'ok' };
  } catch (cause) {
    // Мережа/авторизація впали. Кидати далі не можна: викликає це API route,
    // і відвідувачу має піти зрозуміла відповідь, а не 500 без пояснення.
    return {
      status: 'error',
      message: cause instanceof Error ? cause.message : 'Не вдалося надіслати лист через SMTP.',
    };
  }
}
