import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set workspace root to silence lockfile warning
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Disable optimizer in development to avoid 500s from the dev image proxy
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
} as NextConfig;

export default nextConfig;
