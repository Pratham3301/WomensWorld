import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force all pages to be server-rendered on demand.
  // This prevents Vercel from attempting DB connections during the build phase.
  experimental: {
    // Use PPR (Partial Prerendering) disabled - all pages dynamic
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

