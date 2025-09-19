import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
//const withNextIntl = createNextIntlPlugin('./path/to/i18n/request.tsx');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // и, при желании, 'react-icons'
  },
};

export default withNextIntl(nextConfig);
