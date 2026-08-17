import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Код локалі в проєкті — 'ua' (усталений в URL /ua і messages/ua.json), але
// правильний ISO-код української мови — 'uk' ('ua' — код країни, а не мови).
// Саме 'uk' реально надсилають браузери користувачів з українською системною
// мовою в Accept-Language, тож без цієї підміни next-intl його не впізнавав
// серед routing.locales і на "/" завжди редіректив на дефолтну англійську —
// автовизначення мови для україномовних відвідувачів фактично не працювало.
export default function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage && /\buk\b/i.test(acceptLanguage)) {
    const headers = new Headers(request.headers);
    headers.set('accept-language', acceptLanguage.replace(/\buk\b/gi, 'ua'));
    request = new NextRequest(request, { headers });
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
