/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'getstream.io',
      },
      {
        protocol: 'https',
        hostname: 'thispersondoesnotexist.com',
      },
    ],
  },
};

module.exports = nextConfig;
