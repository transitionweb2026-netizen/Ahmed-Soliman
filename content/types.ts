import type { Localized } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

export type Stat = {
  id: string;
  value: number;
  suffix?: string;
  label: Localized;
  icon: IconName;
};

export type Service = {
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  benefits: Localized<string[]>;
  image: string;
  icon: IconName;
};

export type Treatment = {
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  benefits: Localized<string[]>;
  duration: Localized;
  sessions: Localized;
  recovery: Localized;
  image: string;
  icon: IconName;
};

export type JourneyStep = {
  id: string;
  title: Localized;
  text: Localized;
  icon: IconName;
};

export type Reason = {
  id: string;
  title: Localized;
  text: Localized;
  icon: IconName;
};

export type Video = {
  id: string;
  title: Localized;
  duration: string;
  poster: string;
  /** Self-hosted file, e.g. "/videos/knee-pain.mp4". */
  src?: string;
  /** Alternatively, a YouTube video id. */
  youtubeId?: string;
};

export type Review = {
  id: string;
  name: Localized;
  treatment: Localized;
  text: Localized;
  rating: number;
};

export type Faq = {
  id: string;
  question: Localized;
  answer: Localized;
};

export type ArticleBlock =
  | { type: "p"; text: Localized }
  | { type: "h2"; text: Localized }
  | { type: "list"; items: Localized<string[]> }
  | { type: "quote"; text: Localized };

export type Article = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  date: string;
  readMinutes: number;
  image: string;
  category: Localized;
  body: ArticleBlock[];
};

export type Credential = {
  id: string;
  title: Localized;
  issuer: Localized;
  year: string;
  icon: IconName;
};

export type Milestone = {
  id: string;
  period: string;
  role: Localized;
  place: Localized;
};
