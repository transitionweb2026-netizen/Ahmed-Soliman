import type { Metadata } from "next";
import { defaultLocale, locales, localePath, ogLocale, otherLocale, tr, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { media } from "@/content/media";

type PageMeta = {
  locale: Locale;
  /** Path after the locale, e.g. "/services". Empty for home. */
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Per-page metadata with canonical + hreflang alternates, Open Graph and X cards. */
export function buildMetadata({ locale, path, title, description, image, type = "website", publishedTime }: PageMeta): Metadata {
  // Without a page photo, the branded app/[locale]/opengraph-image is used.
  const images = image ? [{ url: image, alt: title }] : undefined;
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, "x-default": localePath(defaultLocale, path) },
    },
    openGraph: {
      type,
      url: localePath(locale, path),
      siteName: tr(site.name, locale),
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

/** schema.org Physician + MedicalClinic describing the practice. */
export function physicianSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalClinic"],
    "@id": `${site.url}/#physician`,
    name: tr(site.name, locale),
    description: tr(site.specialty, locale),
    url: `${site.url}${localePath(locale)}`,
    image: media.doctorPortrait,
    telephone: site.phone,
    email: site.email,
    medicalSpecialty: ["Orthopedic", "SportsMedicine"],
    availableLanguage: ["ar", "en"],
    address: {
      "@type": "PostalAddress",
      streetAddress: tr(site.address, "en"),
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "16:00",
      closes: "22:00",
    },
    sameAs: site.socials.map((s) => s.href),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
