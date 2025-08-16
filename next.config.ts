import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'], // и, при желании, 'react-icons'
  },
};

export default nextConfig;

