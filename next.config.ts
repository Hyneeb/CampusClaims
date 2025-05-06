import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
                pathname: '/**', // allow all paths
            },
            {
                protocol: 'https',
                hostname: 'static.wikia.nocookie.net',
                pathname: '/**',      // allow any path under that host
            }
        ],
    },
};

export default nextConfig;
