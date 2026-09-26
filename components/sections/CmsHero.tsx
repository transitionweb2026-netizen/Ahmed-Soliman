import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { tr } from "@/lib/i18n";
import { getHero, getSiteData } from "@/lib/cms/data";
import type { PageKey } from "@/lib/cms/types";
import { Hero } from "./Hero";

type CmsHeroProps = {
  locale: Locale;
  page: PageKey;
  size?: "full" | "page";
  /** Inner pages show "Home › Page" above the caption. */
  breadcrumb?: boolean;
};

/** Loads a page's hero from the CMS and renders the shared Hero component. */
export async function CmsHero({ locale, page, size = "full", breadcrumb = false }: CmsHeroProps) {
  const [content, site] = await Promise.all([getHero(page), getSiteData()]);
  const dict = getDictionary(locale);
  return (
    <Hero
      locale={locale}
      labels={dict.hero}
      content={content}
      socials={site.socials}
      phone={{ display: site.contact.phone, href: site.contact.phoneHref }}
      size={size}
      breadcrumb={
        breadcrumb
          ? { label: dict.common.breadcrumb, homeLabel: dict.common.home, current: tr(content.title, locale) }
          : undefined
      }
    />
  );
}
