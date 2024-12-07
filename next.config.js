/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'tklblvxgprkvletfrsnn.supabase.co'
    ],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone'
};

module.exports = nextConfig;