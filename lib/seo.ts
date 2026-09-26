import type { Metadata } from "next";
import { defaultLocale, locales, localePath, ogLocale, otherLocale, tr, type Locale } from "@/lib/i18n";
import { getSeo, getSiteData } from "@/lib/cms/data";
import type { PageKey, SiteData } from "@/lib/cms/types";

const pagePath = (page: PageKey) => (page === "home" ? "" : `/${page}`);

/**
 * Per-page metadata from the CMS SEO settings: title, description, canonical
 * + hreflang alternates, Open Graph and X cards. Empty CMS fields fall back to
 * the global site defaults; the OG image falls back to the page photo, then the
 * site's default OG image, then the branded /api/og card.
 */
export async function pageMetadata(locale: Locale, page: PageKey, pageImage?: string): Promise<Metadata> {
  const [seo, site] = await Promise.all([getSeo(page), getSiteData()]);
  const path = pagePath(page);
  const name = tr(site.settings.name, locale);

  const title = tr(seo.title, locale) || name;
  const description = tr(seo.description, locale) || tr(site.settings.seoDescription, locale);
  const ogTitle = tr(seo.ogTitle, locale) || title;
  const ogDescription = tr(seo.ogDescription, locale) || description;
  const ogImage = seo.ogImage || pageImage || site.settings.defaultOgImage || "/api/og";
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));

  return {
    // Home shows the full site title; other pages get "Page | Name" from the layout template.
    title: page === "home" ? { absolute: tr(site.settings.seoTitle, locale) || title } : title,
    description,
    alternates: {
      canonical: seo.canonical || localePath(locale, path),
      languages: { ...languages, "x-default": localePath(defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      url: localePath(locale, path),
      siteName: name,
      title: ogTitle,
      description: ogDescription,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
      images: [{ url: ogImage, alt: ogTitle }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images: [ogImage] },
  };
}

/** schema.org Physician + MedicalClinic describing the practice. */
export function physicianSchema(locale: Locale, site: SiteData, image?: string) {
  const { settings, contact, socials } = site;
  return {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalClinic"],
    "@id": `${settings.url}/#physician`,
    name: tr(settings.name, locale),
    description: tr(settings.tagline, locale),
    url: `${settings.url}${localePath(locale)}`,
    ...(image ? { image } : {}),
    telephone: contact.phone,
    email: contact.email,
    medicalSpecialty: ["Orthopedic", "SportsMedicine"],
    availableLanguage: ["ar", "en"],
    address: { "@type": "PostalAddress", streetAddress: tr(contact.address, locale), addressCountry: "EG" },
    ...(contact.latitude != null && contact.longitude != null
      ? { geo: { "@type": "GeoCoordinates", latitude: contact.latitude, longitude: contact.longitude } }
      : {}),
    sameAs: socials.map((s) => s.url),
  };
}

export function breadcrumbSchema(siteUrl: string, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
