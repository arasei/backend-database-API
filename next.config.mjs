/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.jp"], 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.microcms-assets.io' },
    ],
  },
};

export default nextConfig;