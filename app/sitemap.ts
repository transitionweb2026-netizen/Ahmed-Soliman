import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { navItems } from "@/lib/nav";
import { articles } from "@/content/articles";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ...navItems.map((item) => ({ path: item.path, lastModified: undefined as string | undefined, priority: item.path ? 0.8 : 1 })),
    ...articles.map((a) => ({ path: `/articles/${a.slug}`, lastModified: a.date, priority: 0.6 })),
  ];

  return pages.flatMap(({ path, lastModified, priority }) =>
    locales.map((locale) => ({
      url: `${site.url}${localePath(locale, path)}`,
      lastModified: lastModified ?? new Date().toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${localePath(l, path)}`])),
      },
    })),
  );
}
