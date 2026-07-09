import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return [
        { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
      ];
    }
    return [];
  },
};

export default nextConfig;
