/**
 * Єдине місце, звідки сайт бере відгуки Google.
 *
 * Функція ходить до Places API напряму, а не через власний /api/reviews.
 * Серверний компонент, який фетчить власний роут, ламається на прегенерації:
 * під час `next build` сервер ще не слухає порт, а сторінок тут 34 і майже всі
 * статичні. Крім того це зайвий HTTP-хоп і потреба знати власний origin.
 *
 * Кеш — стандартний Data Cache Next.js: fetch із next.revalidate ключується по
 * URL+опціях, тож усі сторінки сайту ділять одну відповідь, і до Google іде
 * один запит на годину на кожну мову, скільки б сторінок його не викликало.
 *
 * Роут app/api/reviews теж викликає цю саму функцію й потрапляє в той самий
 * кеш — двох джерел правди немає.
 *
 * Файл серверний: він читає process.env.GOOGLE_PLACES_API_KEY, змінну без
 * префікса NEXT_PUBLIC_. Імпорт із клієнтського компонента підставив би туди
 * undefined, а не витік ключа, але зламався б мовчки — тому імпортувати цей
 * модуль можна лише з серверних компонентів і роутів. Пакет server-only, який
 * зробив би таку помилку помилкою збірки, у проєкті не встановлений.
 */

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places';
const FIELDS = 'reviews,rating,userRatingCount';

/** Година, як просив бриф. Google дозволяє кешувати відгуки до 30 днів. */
export const REVIEWS_REVALIDATE_SECONDS = 86400;

/**
 * Places API віддає щонайбільше пʼять «найрелевантніших» відгуків і не дає ні
 * сортування, ні пагінації. Це обмеження самого API, а не наш недогляд —
 * виносимо в константу, щоб не шукати пояснення в коментарях.
 */
export const GOOGLE_MAX_REVIEWS = 5;

export interface ReviewAuthor {
  displayName: string;
  /** Профіль автора в Google Maps. */
  uri?: string;
  /** Аватар. Хост googleusercontent.com дозволений у next.config.ts. */
  photoUri?: string;
}

export interface Review {
  /** Ресурсне імʼя відгуку в Places API — стабільний ключ для списку. */
  id: string;
  /** Ціле число 1–5. */
  rating: number;
  text: string;
  /** ISO-8601, для атрибута <time dateTime>. */
  publishTime: string;
  /** «2 months ago» / «2 місяці тому» — Google локалізує за languageCode. */
  relativeTime: string;
  author: ReviewAuthor;
}

export interface ReviewsPayload {
  /** null, якщо в закладу ще немає жодної оцінки. */
  rating: number | null;
  userRatingCount: number;
  reviews: Review[];
}

export type ReviewsResult =
  | { status: 'ok'; data: ReviewsPayload }
  /** Ключа чи Place ID немає в оточенні — це не помилка, а ненастроєний стан. */
  | { status: 'unconfigured'; message: string }
  | { status: 'error'; code: string; message: string; httpStatus: number };

/** Сира відповідь Places API v1. Описана окремо, щоб не приводити її через any. */
interface RawLocalizedText {
  text?: string;
  languageCode?: string;
}

interface RawReview {
  name?: string;
  rating?: number;
  text?: RawLocalizedText;
  originalText?: RawLocalizedText;
  publishTime?: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface RawPlaceResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: RawReview[];
  error?: { code?: number; message?: string; status?: string };
}

function normalize(raw: RawReview, index: number): Review | null {
  // Відгук без тексту чи без автора показувати нічого — пропускаємо, а не
  // виводимо порожню картку.
  const text = raw.text?.text ?? raw.originalText?.text;
  const displayName = raw.authorAttribution?.displayName;
  if (!text || !displayName) return null;

  return {
    id: raw.name ?? `review-${index}`,
    rating: typeof raw.rating === 'number' ? raw.rating : 0,
    text,
    publishTime: raw.publishTime ?? '',
    relativeTime: raw.relativePublishTimeDescription ?? '',
    author: {
      displayName,
      uri: raw.authorAttribution?.uri,
      photoUri: raw.authorAttribution?.photoUri,
    },
  };
}

/**
 * @param languageCode код мови BCP-47 ('en', 'uk'). Google повертає цією мовою
 *   і сам текст відгуку (переклад, якщо є), і підпис «2 місяці тому».
 */
export async function getGoogleReviews(languageCode: string): Promise<ReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    const missing = [!apiKey && 'GOOGLE_PLACES_API_KEY', !placeId && 'GOOGLE_PLACE_ID']
      .filter(Boolean)
      .join(', ');

    return {
      status: 'unconfigured',
      message: `Не задано ${missing} — блок відгуків вимкнено.`,
    };
  }

  const url = `${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}?fields=${FIELDS}&languageCode=${encodeURIComponent(languageCode)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELDS,
      },
      next: { revalidate: REVIEWS_REVALIDATE_SECONDS },
    });

    // Тіло читаємо навіть на помилці: Google кладе туди причину (нема доступу,
    // не той Place ID, перевищено квоту), і без неї діагностувати нічого.
    const body = (await response.json().catch(() => null)) as RawPlaceResponse | null;

    if (!response.ok) {
      return {
        status: 'error',
        code: body?.error?.status ?? `HTTP_${response.status}`,
        message: body?.error?.message ?? `Places API відповів ${response.status}.`,
        httpStatus: response.status,
      };
    }

    if (!body) {
      return {
        status: 'error',
        code: 'INVALID_JSON',
        message: 'Places API повернув відповідь, яку не вдалося розібрати як JSON.',
        httpStatus: 502,
      };
    }

    return {
      status: 'ok',
      data: {
        rating: typeof body.rating === 'number' ? body.rating : null,
        userRatingCount: body.userRatingCount ?? 0,
        reviews: (body.reviews ?? [])
          .map(normalize)
          .filter((review): review is Review => review !== null)
          .slice(0, GOOGLE_MAX_REVIEWS),
      },
    };
  } catch (cause) {
    // Мережа впала або спрацював таймаут. Кидати далі не можна: цей виклик
    // сидить у layout, тобто помилка поклала б кожну сторінку сайту.
    return {
      status: 'error',
      code: 'NETWORK_ERROR',
      message: cause instanceof Error ? cause.message : 'Не вдалося звʼязатися з Places API.',
      httpStatus: 502,
    };
  }
}

/** Публічна сторінка закладу — обовʼязкова атрибуція Google під блоком. */
export function googleMapsPlaceUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  return placeId ? `https://www.google.com/maps/place/?q=place_id:${placeId}` : null;
}
