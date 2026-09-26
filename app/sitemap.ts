import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { getArticles, getSiteData } from "@/lib/cms/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, articles] = await Promise.all([getSiteData(), getArticles()]);
  const base = site.settings.url;
  const today = new Date().toISOString().slice(0, 10);
  // Pages in the CMS navigation (internal links only), plus Home.
  const paths = ["", ...site.nav.map((n) => n.path).filter((p) => p.startsWith("/") && p !== "/")];

  return [...new Set(paths)].flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${localePath(locale, path)}`,
      lastModified: path === "/articles" && articles[0]?.date ? articles[0].date : today,
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : 1,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, path)}`])),
      },
    })),
  );
}
