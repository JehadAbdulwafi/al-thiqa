import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rfdnnkfkubuhotenhptg.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  }
};

export default nextConfig;
