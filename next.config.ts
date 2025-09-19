import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  //devIndicators: false,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // и, при желании, 'react-icons'
  },
};

export default withNextIntl(nextConfig);
