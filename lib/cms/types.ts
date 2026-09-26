import type { Localized } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";
import type { Video } from "@/content/types";

export const pageKeys = ["home", "about", "services", "videos", "articles", "contact"] as const;
export type PageKey = (typeof pageKeys)[number];

export type MediaRef = {
  id?: string;
  url: string;
  alt: Localized;
  mime?: string;
  /** Seconds, for videos (captured at upload). */
  duration?: number | null;
};

/** A button: label per language + a link. Internal links are stored without the locale ("/contact"). */
export type LinkButton = { label: Localized; href: string };

export type HeroContent = {
  image: string;
  eyebrow: Localized;
  title: Localized;
  subtitle: Localized;
  primary: LinkButton;
  secondary: LinkButton;
  visible: boolean;
  showContactPanel: boolean;
};

/** A generic block of page copy; each section uses the fields it needs. */
export type SectionContent = {
  eyebrow: Localized;
  title: Localized;
  subtitle: Localized;
  body: Localized;
  caption: Localized;
  items: Localized<string[]>;
  button: LinkButton;
  button2: LinkButton;
  image?: MediaRef;
  video?: MediaRef;
  poster?: MediaRef;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: IconName;
  iconUrl?: string;
};

export type NavLink = { key: string; path: string; label: Localized };

export type ContactInfo = {
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappMessage: Localized;
  email: string;
  address: Localized;
  hours: Localized;
  bookingUrl: string;
  mapEmbedUrl: string;
  latitude: number | null;
  longitude: number | null;
};

export type SiteSettings = {
  name: Localized;
  tagline: Localized;
  url: string;
  seoTitle: Localized;
  seoDescription: Localized;
  defaultOgImage?: string;
  favicon?: string;
};

export type SiteData = {
  settings: SiteSettings;
  contact: ContactInfo;
  socials: SocialLink[];
  nav: NavLink[];
};

export type SeoContent = {
  title: Localized;
  description: Localized;
  canonical: string;
  ogTitle: Localized;
  ogDescription: Localized;
  ogImage?: string;
};

const emptyLocalized: Localized = { ar: "", en: "" };

export function emptySection(): SectionContent {
  return {
    eyebrow: emptyLocalized,
    title: emptyLocalized,
    subtitle: emptyLocalized,
    body: emptyLocalized,
    caption: emptyLocalized,
    items: { ar: [], en: [] },
    button: { label: emptyLocalized, href: "" },
    button2: { label: emptyLocalized, href: "" },
  };
}

/** Split multi-paragraph text (paragraphs separated by a blank line). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "m:ss" from seconds (video durations are captured when a file is uploaded). */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || !Number.isFinite(seconds)) return "";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** A playable video built from a section's uploaded file, poster and caption. */
export function sectionVideo(id: string, section: SectionContent): Video {
  return {
    id,
    title: section.caption,
    duration: formatDuration(section.video?.duration),
    poster: section.poster?.url ?? "",
    src: section.video?.url,
  };
}
