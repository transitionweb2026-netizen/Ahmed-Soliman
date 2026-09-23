import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json higher up on the Desktop would otherwise be picked as the root.
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/webp"],
    qualities: [70, 75, 85],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
