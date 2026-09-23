import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { sendContactEmail } from '@/lib/mailer';
import { isEventTypeSlug, isServiceSlug } from '@/data/relations';
import { routing } from '@/i18n/routing';

/**
 * POST /api/contact
 *
 * Обробник єдиної форми зворотного зв'язку і запиту на прорахунок
 * (components/shared/QuoteForm/QuoteForm.tsx) — тепер це і форма на сторінці
 * контактів, і форма внизу кожної сторінки послуги/типу події. Раніше кнопки
 * там просто відкривали mailto: у поштовому клієнті відвідувача, тепер лист
 * реально йде з бекенду через SMTP Titan Email (lib/mailer.ts) — надійніше на
 * мобільних (не всі мають налаштований поштовий клієнт) і не вимагає від
 * відвідувача самому натискати "надіслати" в чужому вікні.
 *
 * Той самий стиль відповідей, що й у api/reviews/route.ts: жодного голого
 * 500 — і ненастроєний стан (нема пароля скриньки), і збій SMTP віддають
 * передбачуваний JSON із кодом.
 */

const MAX_LENGTHS = { name: 120, email: 200, phone: 40, location: 200, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_GUESTS = 100000;

// Проста заглушка від ботів: прихований інпут "company" у формі, який
// справжній відвідувач ніколи не бачить і не заповнює (CSS ховає його,
// components/shared/FeedbackForm.module.css). Заповнений — тихо повертаємо
// "успіх", не витрачаючи SMTP-квоту й не даючи боту сигналу, що його відсіяли.
function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  return typeof body.company === 'string' && body.company.trim().length > 0;
}

// Друга пастка від ботів, незалежна від honeypot: форма надсилає момент
// свого рендеру (QuoteForm.tsx, useState(() => Date.now())), і сабміт менш
// ніж за MIN_FILL_MS після нього фізично не встигає бути людиною, яка
// прочитала форму, обрала два select і написала повідомлення. Скрипт, що
// постить напряму в цей ендпоінт, це поле або взагалі не пришле (isFast —
// true за замовчуванням, як і при некоректному значенні), або пришле з
// нульовою затримкою.
const MIN_FILL_MS = 2000;

function isTooFast(body: Record<string, unknown>): boolean {
  const renderedAt = typeof body.renderedAt === 'number' ? body.renderedAt : NaN;
  if (!Number.isFinite(renderedAt)) return true;

  const elapsed = Date.now() - renderedAt;
  return elapsed < MIN_FILL_MS;
}

// Легкий троттлінг за IP, без зовнішньої інфраструктури (Redis тощо) — той
// самий компроміс "мінімально достатньо", що й mailto-фолбек раніше: не
// хардкор проти цілеспрямованого спаму, а швидкий запобіжник проти
// автоматичних скриптів. Стан живе в пам'яті процесу, тож на serverless із
// кількома інстансами чи після редеплою ліміт обнуляється — це прийнятно
// для форми з низьким природним трафіком.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_PER_WINDOW) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

function badRequest(message: string) {
  return NextResponse.json({ error: { code: 'VALIDATION', message } }, { status: 400 });
}

export async function POST(request: Request) {
  // x-forwarded-for може містити список через кому (проксі за проксі) —
  // перший запис найближчий до клієнта.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Забагато запитів. Спробуйте, будь ласка, пізніше.',
        },
      },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Некоректне тіло запиту.');
  }

  if (isHoneypotTriggered(body) || isTooFast(body)) {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const eventTypeSlug = typeof body.eventType === 'string' ? body.eventType.trim() : '';
  const serviceSlug = typeof body.service === 'string' ? body.service.trim() : '';
  const guestsRaw = typeof body.guests === 'string' ? body.guests.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const requestedLocale = typeof body.locale === 'string' ? body.locale : '';
  const locale = (routing.locales as readonly string[]).includes(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  if (!name || name.length > MAX_LENGTHS.name) {
    return badRequest('Некоректне імʼя.');
  }
  if (!email || email.length > MAX_LENGTHS.email || !EMAIL_RE.test(email)) {
    return badRequest('Некоректний email.');
  }
  if (phone.length > MAX_LENGTHS.phone) {
    return badRequest('Некоректний телефон.');
  }
  if (!message || message.length > MAX_LENGTHS.message) {
    return badRequest('Некоректне повідомлення.');
  }
  // Обидва поля необов'язкові (загальна заявка з /contacts їх не заповнює),
  // але якщо щось прийшло — це має бути відомий слаг, а не довільний рядок.
  if (eventTypeSlug && !isEventTypeSlug(eventTypeSlug)) {
    return badRequest('Некоректний тип події.');
  }
  if (serviceSlug && !isServiceSlug(serviceSlug)) {
    return badRequest('Некоректна послуга.');
  }
  // Число гостей необов'язкове, але якщо прийшло — має бути справжнім
  // додатним числом у розумних межах, а не довільний текст.
  const guestsNumber = guestsRaw ? Number(guestsRaw) : null;
  if (guestsRaw && (!Number.isInteger(guestsNumber) || guestsNumber! < 1 || guestsNumber! > MAX_GUESTS)) {
    return badRequest('Некоректна кількість гостей.');
  }
  if (location.length > MAX_LENGTHS.location) {
    return badRequest('Некоректна локація.');
  }

  // Лист читає команда, тож у тілі має бути назва мовою відвідувача
  // ("Весілля"), а не техічний слаг ("weddings") — перекладаємо тут, а не в
  // mailer.ts, щоб той лишався простим форматером готових рядків.
  const tEventItems = await getTranslations({ locale, namespace: 'EventItems' });
  const tServiceItems = await getTranslations({ locale, namespace: 'ServiceItems' });
  const eventType = eventTypeSlug ? tEventItems(`${eventTypeSlug}.name`) : '';
  const service = serviceSlug ? tServiceItems(`${serviceSlug}.name`) : '';

  const result = await sendContactEmail({
    name,
    email,
    phone,
    eventType,
    service,
    guests: guestsRaw,
    location,
    message,
  });

  if (result.status === 'ok') {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }

  if (result.status === 'unconfigured') {
    console.warn(`[contact] ${result.message}`);
    return NextResponse.json(
      { error: { code: 'NOT_CONFIGURED', message: result.message } },
      { status: 503 },
    );
  }

  console.error(`[contact] ${result.message}`);
  return NextResponse.json(
    { error: { code: 'SEND_FAILED', message: result.message } },
    { status: 502 },
  );
}
