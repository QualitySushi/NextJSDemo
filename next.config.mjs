/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:4000/ws/:path*',
      },
    ];
  },
};

export default nextConfig;