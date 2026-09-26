import type { Localized } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

/**
 * Content shapes rendered by the public site. They are filled from Supabase
 * (lib/cms/data.ts) and, before the CMS is set up, from the files in content/.
 *
 * Icons: `icon` is a built-in icon name; `iconUrl`, when set, is an icon
 * uploaded in the CMS and takes precedence.
 */
type WithIcon = { icon: IconName; iconUrl?: string };

export type Stat = WithIcon & {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: Localized;
};

export type Service = WithIcon & {
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  benefits: Localized<string[]>;
  image: string;
  /** Optional extra photos shown on the Services page. */
  gallery?: string[];
};

export type Treatment = WithIcon & {
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  benefits: Localized<string[]>;
  sessions: Localized;
  image: string;
};

export type JourneyStep = WithIcon & {
  id: string;
  title: Localized;
  text: Localized;
};

export type Reason = WithIcon & {
  id: string;
  title: Localized;
  text: Localized;
};

export type Video = {
  id: string;
  title: Localized;
  description?: Localized;
  category?: Localized;
  duration: string;
  poster: string;
  /** Uploaded file, e.g. a Supabase Storage URL or "/videos/knee-pain.mp4". */
  src?: string;
  /** Alternatively, a YouTube video id. */
  youtubeId?: string;
  featured?: boolean;
};

export type Review = {
  id: string;
  name: Localized;
  treatment: Localized;
  text: Localized;
  rating: number;
  avatar?: string;
  date?: string;
};

export type Faq = {
  id: string;
  question: Localized;
  answer: Localized;
};

/** One block of an article body, in a single language. */
export type ArticleBlock =
  | { type: "p" | "h2" | "quote"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  date: string;
  readMinutes: number;
  image: string;
  category: Localized;
  author?: Localized;
  body: Localized<ArticleBlock[]>;
};

/** Anything shown as a card that opens a detail modal (technologies, specialties). */
export type DetailItem = WithIcon & {
  id: string;
  title: Localized;
  summary: Localized;
  details: Localized<string[]>;
  highlights: Localized<string[]>;
  image: string;
};

export type Certificate = {
  id: string;
  title: Localized;
  description: Localized;
  year: string;
  /** Scan of the real certificate; a styled preview is drawn when missing. */
  image?: string;
  /** Optional PDF of the certificate. */
  pdf?: string;
};

export type Milestone = WithIcon & {
  id: string;
  period: string;
  role: Localized;
  place: Localized;
  text: Localized;
};

export type Achievement = WithIcon & {
  id: string;
  title: Localized;
  text: Localized;
  year?: string;
  image?: string;
};
