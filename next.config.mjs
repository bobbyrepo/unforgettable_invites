/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/studio',
        destination: '/studio.html',
      },
      {
        source: '/portal',
        destination: '/portal.html',
      },
    ];
  },
};

export default nextConfig;
