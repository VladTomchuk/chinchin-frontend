import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  //devIndicators: false,
  // Аватари авторів відгуків Google (lh3.googleusercontent.com) МУСЯТЬ іти
  // через проксі /_next/image, а не unoptimized: Google віддає ці URL 200 на
  // будь-який запит без заголовка Sec-Fetch-Dest, але щойно браузер вантажить
  // їх напряму в <img> (а Chrome завжди підставляє Sec-Fetch-Dest: image),
  // CDN відповідає 429 з text/html — і Chromium ховає це від сторінки як
  // net::ERR_BLOCKED_BY_ORB (opaque response blocking), тож картинка просто
  // не з'являється. Перевірено curl'ом із тим самим заголовком: без нього —
  // 200 image/png, з ним — 429. next/image-проксі фетчить із сервера (без
  // Sec-Fetch-Dest, як звичайний curl), тож обходить це geo/anti-hotlink
  // обмеження. Звідси й remotePatterns нижче — без нього next/image відмовляє
  // оптимізувати чужий хост.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // и, при желании, 'react-icons'
  },
};

export default withNextIntl(nextConfig);
