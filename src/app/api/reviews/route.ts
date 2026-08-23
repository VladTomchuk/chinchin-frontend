import { NextResponse } from 'next/server';
import { getGoogleReviews, REVIEWS_REVALIDATE_SECONDS } from '@/lib/reviews';

/**
 * GET /api/reviews?lang=uk
 *
 * Роут не потрібен самому блоку відгуків: сторінки серверні й викликають
 * lib/reviews напряму. Він лишається як публічна точка для клієнтського коду й
 * для перевірки настройок вручну — і бере дані з тієї самої функції, тож ділить
 * із сайтом один кеш і не додає запитів до Google.
 *
 * Ключ у відповідь не потрапляє: назовні йдуть лише розібрані відгуки.
 */

// Дозволені мови. Довільний рядок із query сюди пускати не можна — кожне нове
// значення це окремий запис у Data Cache і окремий запит до Google.
const SUPPORTED = new Set(['en', 'uk']);
const DEFAULT_LANGUAGE = 'en';

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get('lang');
  const languageCode = requested && SUPPORTED.has(requested) ? requested : DEFAULT_LANGUAGE;

  const result = await getGoogleReviews(languageCode);

  if (result.status === 'ok') {
    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${REVIEWS_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
      },
    });
  }

  // Жодного голого 500: і ненастроєний стан, і збій віддають той самий
  // передбачуваний JSON із кодом, за яким видно причину.
  if (result.status === 'unconfigured') {
    return NextResponse.json(
      { error: { code: 'NOT_CONFIGURED', message: result.message } },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { error: { code: result.code, message: result.message } },
    { status: result.httpStatus >= 400 && result.httpStatus <= 599 ? result.httpStatus : 502 },
  );
}
