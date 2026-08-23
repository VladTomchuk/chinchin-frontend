import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  //devIndicators: false,
  // Аватари авторів відгуків Google (googleusercontent.com) рендеряться з
  // unoptimized — Google вже віддає їх готовим маленьким файлом, оптимізувати
  // нема чого. Через unoptimized next/image не проксіює їх через /_next/image,
  // тож allow-list на remotePatterns тут не потрібен.
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // и, при желании, 'react-icons'
  },
};

export default withNextIntl(nextConfig);
