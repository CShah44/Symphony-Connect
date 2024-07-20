/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '**',
          },
        ],
      },
};

export default nextConfig;
