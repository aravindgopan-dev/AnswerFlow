import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match all requests starting with /api/
        destination: 'https://answerflow-0j2v.onrender.com/api/:path*', // Redirect to the backend server
      },
    ];
  },
};

export default nextConfig;
