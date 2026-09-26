import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/cms/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getSiteData();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${settings.url}/sitemap.xml`,
    host: settings.url,
  };
}
