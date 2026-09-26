import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

const nextConfig: NextConfig = {
  // A package-lock.json higher up on the Desktop would otherwise be picked as the root.
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/webp"],
    qualities: [70, 75, 85],
    remotePatterns: [
      // CMS uploads (Supabase Storage public buckets)
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : []),
      // Built-in placeholder photography, used only before the CMS is seeded
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
