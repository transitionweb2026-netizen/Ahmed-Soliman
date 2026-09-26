import "server-only";
import { cache } from "react";
import type { Localized } from "@/lib/i18n";
import { publicSupabase } from "@/lib/supabase/public";
import { isIconName, type IconName } from "@/components/ui/Icon";
import type {
  Achievement,
  Article,
  ArticleBlock,
  Certificate,
  DetailItem,
  Faq,
  JourneyStep,
  Milestone,
  Reason,
  Review,
  Service,
  Stat,
  Treatment,
  Video,
} from "@/content/types";
import { defaultContent, defaultHeroes, defaultSections, defaultSeo, defaultSite } from "./defaults";
import { emptySection, formatDuration, type HeroContent, type MediaRef, type PageKey, type SectionContent, type SeoContent, type SiteData } from "./types";

/*
 * Public website data.
 *
 * Every getter reads Supabase with the anonymous client (RLS returns only
 * active/published rows) and maps rows to the shapes the components render.
 * The original content in lib/cms/defaults.ts is used only while the CMS is
 * not set up — no Supabase keys, or the database not seeded yet (no
 * site_settings row). Once seeded, an empty collection really is empty.
 */

type Row = Record<string, unknown>;

// ── Row helpers ────────────────────────────────────────────────────────────

const str = (row: Row, key: string): string => (typeof row[key] === "string" ? (row[key] as string) : "");
const num = (row: Row, key: string): number | null => (row[key] == null ? null : Number(row[key]));
const loc = (row: Row, field: string): Localized => ({ ar: str(row, `${field}_ar`), en: str(row, `${field}_en`) });
const list = (row: Row, field: string): Localized<string[]> => ({
  ar: Array.isArray(row[`${field}_ar`]) ? (row[`${field}_ar`] as string[]) : [],
  en: Array.isArray(row[`${field}_en`]) ? (row[`${field}_en`] as string[]) : [],
});
const icon = (row: Row, fallback: IconName = "sparkle"): IconName => (isIconName(row.icon) ? row.icon : fallback);

// ── Fetching ───────────────────────────────────────────────────────────────

/** True when Supabase is configured and seeded; otherwise the site uses defaults. */
export const isCmsLive = cache(async (): Promise<boolean> => {
  if (!publicSupabase) return false;
  const { data, error } = await publicSupabase.from("site_settings").select("id").maybeSingle();
  if (error) {
    console.error("[cms] Supabase unavailable, using built-in content:", error.message);
    return false;
  }
  return Boolean(data);
});

async function rows(table: string, order: { column: string; ascending?: boolean } = { column: "sort_order" }): Promise<Row[]> {
  if (!publicSupabase) return [];
  const { data, error } = await publicSupabase.from(table).select("*").order(order.column, { ascending: order.ascending ?? true });
  if (error) throw new Error(`[cms] Could not load ${table}: ${error.message}`);
  return (data ?? []) as Row[];
}

type MediaRow = { id: string; public_url: string; alt_ar: string; alt_en: string; mime_type: string; duration_seconds: number | null };

/** All media metadata, keyed by id (one query per render, shared by every getter). */
const getMedia = cache(async (): Promise<Map<string, MediaRow>> => {
  if (!publicSupabase) return new Map();
  const { data, error } = await publicSupabase.from("media").select("id, public_url, alt_ar, alt_en, mime_type, duration_seconds");
  if (error) throw new Error(`[cms] Could not load media: ${error.message}`);
  return new Map((data as MediaRow[]).map((m) => [m.id, m]));
});

function mediaRef(mediaMap: Map<string, MediaRow>, id: unknown): MediaRef | undefined {
  if (typeof id !== "string") return undefined;
  const m = mediaMap.get(id);
  if (!m) return undefined;
  return { id: m.id, url: m.public_url, alt: { ar: m.alt_ar, en: m.alt_en }, mime: m.mime_type, duration: m.duration_seconds };
}

function mediaUrl(mediaMap: Map<string, MediaRow>, id: unknown): string | undefined {
  return mediaRef(mediaMap, id)?.url;
}

/** Load a collection from Supabase, or return the built-in content before setup. */
async function collection<T>(table: string, fallback: T[], map: (row: Row, media: Map<string, MediaRow>) => T, order?: { column: string; ascending?: boolean }) {
  if (!(await isCmsLive())) return fallback;
  const [data, media] = await Promise.all([rows(table, order), getMedia()]);
  return data.map((row) => map(row, media));
}

// ── Site-wide data ─────────────────────────────────────────────────────────

export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!(await isCmsLive()) || !publicSupabase) return defaultSite;
  const [settingsRes, contactRes, socials, nav, media] = await Promise.all([
    publicSupabase.from("site_settings").select("*").single(),
    publicSupabase.from("contact_info").select("*").maybeSingle(),
    rows("social_links"),
    rows("nav_items"),
    getMedia(),
  ]);
  if (settingsRes.error) throw new Error(`[cms] Could not load site settings: ${settingsRes.error.message}`);
  const s = settingsRes.data as Row;
  const c = (contactRes.data ?? {}) as Row;
  const phone = str(c, "phone");

  return {
    settings: {
      name: loc(s, "site_name"),
      tagline: loc(s, "tagline"),
      url: str(s, "site_url") || defaultSite.settings.url,
      seoTitle: loc(s, "seo_title"),
      seoDescription: loc(s, "seo_description"),
      defaultOgImage: mediaUrl(media, s.default_og_image_id),
      favicon: mediaUrl(media, s.favicon_id),
    },
    contact: {
      phone,
      phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
      whatsappNumber: str(c, "whatsapp_number"),
      whatsappMessage: loc(c, "whatsapp_message"),
      email: str(c, "email"),
      address: loc(c, "address"),
      hours: loc(c, "hours"),
      bookingUrl: str(c, "booking_url"),
      mapEmbedUrl: str(c, "map_embed_url"),
      latitude: num(c, "latitude"),
      longitude: num(c, "longitude"),
    },
    socials: socials.map((r) => ({
      id: String(r.id),
      platform: str(r, "platform"),
      label: str(r, "label") || str(r, "platform"),
      url: str(r, "url"),
      icon: icon(r, "link"),
      iconUrl: mediaUrl(media, r.icon_media_id),
    })),
    nav: nav.map((r) => ({ key: str(r, "nav_key"), path: str(r, "path"), label: loc(r, "label") })),
  };
});

// ── Page content: heroes, sections, SEO ────────────────────────────────────

export const getHero = cache(async (page: PageKey): Promise<HeroContent> => {
  const fallback = defaultHeroes[page];
  if (!(await isCmsLive()) || !publicSupabase) return fallback;
  const [{ data, error }, media] = await Promise.all([
    publicSupabase.from("heroes").select("*").eq("page_key", page).maybeSingle(),
    getMedia(),
  ]);
  if (error) throw new Error(`[cms] Could not load the ${page} hero: ${error.message}`);
  if (!data) return fallback;
  const r = data as Row;
  return {
    image: mediaUrl(media, r.image_id) ?? fallback.image,
    eyebrow: loc(r, "eyebrow"),
    title: loc(r, "title"),
    subtitle: loc(r, "subtitle"),
    primary: { label: loc(r, "primary_label"), href: str(r, "primary_href") },
    secondary: { label: loc(r, "secondary_label"), href: str(r, "secondary_href") },
    visible: r.is_visible !== false,
    showContactPanel: r.show_contact_panel !== false,
  };
});

const getAllSections = cache(async (): Promise<Record<string, SectionContent>> => {
  if (!(await isCmsLive())) return defaultSections;
  const [data, media] = await Promise.all([rows("sections", { column: "section_key" }), getMedia()]);
  const result: Record<string, SectionContent> = {};
  for (const r of data) {
    result[str(r, "section_key")] = {
      eyebrow: loc(r, "eyebrow"),
      title: loc(r, "title"),
      subtitle: loc(r, "subtitle"),
      body: loc(r, "body"),
      caption: loc(r, "caption"),
      items: list(r, "items"),
      button: { label: loc(r, "button_label"), href: str(r, "button_href") },
      button2: { label: loc(r, "button2_label"), href: str(r, "button2_href") },
      image: mediaRef(media, r.image_id),
      video: mediaRef(media, r.video_id),
      poster: mediaRef(media, r.poster_id),
    };
  }
  return result;
});

/** One content block; an unknown/unsaved key yields empty content rather than an error. */
export async function getSection(key: string): Promise<SectionContent> {
  return (await getAllSections())[key] ?? emptySection();
}

export const getSeo = cache(async (page: PageKey): Promise<SeoContent> => {
  const fallback = defaultSeo[page];
  if (!(await isCmsLive()) || !publicSupabase) return fallback;
  const [{ data, error }, media] = await Promise.all([
    publicSupabase.from("seo_pages").select("*").eq("page_key", page).maybeSingle(),
    getMedia(),
  ]);
  if (error) throw new Error(`[cms] Could not load SEO for ${page}: ${error.message}`);
  if (!data) return fallback;
  const r = data as Row;
  return {
    title: loc(r, "title"),
    description: loc(r, "description"),
    canonical: str(r, "canonical_url"),
    ogTitle: loc(r, "og_title"),
    ogDescription: loc(r, "og_description"),
    ogImage: mediaUrl(media, r.og_image_id),
  };
});

// ── Collections ────────────────────────────────────────────────────────────

export const getStats = cache(() =>
  collection<Stat>("stats", defaultContent.stats, (r, m) => ({
    id: String(r.id),
    value: num(r, "value") ?? 0,
    prefix: str(r, "prefix"),
    suffix: str(r, "suffix"),
    label: loc(r, "label"),
    icon: icon(r, "star"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

const getGallery = cache(async (): Promise<Map<string, string[]>> => {
  const [data, media] = await Promise.all([rows("service_images"), getMedia()]);
  const byService = new Map<string, string[]>();
  for (const r of data) {
    const url = mediaUrl(media, r.media_id);
    if (!url) continue;
    const key = String(r.service_id);
    byService.set(key, [...(byService.get(key) ?? []), url]);
  }
  return byService;
});

export const getServices = cache(async () => {
  if (!(await isCmsLive())) return defaultContent.services;
  const gallery = await getGallery();
  return collection<Service>("services", [], (r, m) => ({
    slug: str(r, "slug"),
    title: loc(r, "title"),
    summary: loc(r, "summary"),
    description: loc(r, "description"),
    benefits: list(r, "benefits"),
    image: mediaUrl(m, r.image_id) ?? "",
    gallery: gallery.get(String(r.id)) ?? [],
    icon: icon(r, "bone"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  }));
});

export const getTreatments = cache(() =>
  collection<Treatment>("treatments", defaultContent.treatments, (r, m) => ({
    slug: str(r, "slug"),
    title: loc(r, "title"),
    summary: loc(r, "summary"),
    description: loc(r, "description"),
    benefits: list(r, "benefits"),
    sessions: loc(r, "sessions"),
    image: mediaUrl(m, r.image_id) ?? "",
    icon: icon(r, "drop"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

function detailItem(r: Row, m: Map<string, MediaRow>): DetailItem {
  const description = loc(r, "description");
  const split = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return {
    id: String(r.id),
    title: loc(r, "title"),
    summary: loc(r, "summary"),
    details: { ar: split(description.ar), en: split(description.en) },
    highlights: list(r, "highlights"),
    image: mediaUrl(m, r.image_id) ?? "",
    icon: icon(r, "scan"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  };
}

export const getTechnologies = cache(() => collection<DetailItem>("technologies", defaultContent.technologies, detailItem));
export const getSpecialties = cache(() => collection<DetailItem>("specialties", defaultContent.specialties, detailItem));

export const getTimeline = cache(() =>
  collection<Milestone>("timeline_items", defaultContent.timeline, (r, m) => ({
    id: String(r.id),
    period: str(r, "period"),
    role: loc(r, "title"),
    place: loc(r, "subtitle"),
    text: loc(r, "description"),
    icon: icon(r, "sparkle"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

export const getAchievements = cache(() =>
  collection<Achievement>("achievements", defaultContent.achievements, (r, m) => ({
    id: String(r.id),
    title: loc(r, "title"),
    text: loc(r, "description"),
    year: str(r, "year") || undefined,
    image: mediaUrl(m, r.image_id),
    icon: icon(r, "award"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

export const getCertificates = cache(() =>
  collection<Certificate>("certificates", defaultContent.certificates, (r, m) => ({
    id: String(r.id),
    title: loc(r, "title"),
    description: loc(r, "description"),
    year: str(r, "year"),
    image: mediaUrl(m, r.image_id),
    pdf: mediaUrl(m, r.pdf_id),
  })),
);

export const getJourney = cache(() =>
  collection<JourneyStep>("journey_steps", defaultContent.journey, (r, m) => ({
    id: String(r.id),
    title: loc(r, "title"),
    text: loc(r, "description"),
    icon: icon(r, "sparkle"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

export const getReasons = cache(() =>
  collection<Reason>("reasons", defaultContent.reasons, (r, m) => ({
    id: String(r.id),
    title: loc(r, "title"),
    text: loc(r, "description"),
    icon: icon(r, "shield"),
    iconUrl: mediaUrl(m, r.icon_media_id),
  })),
);

export const getVideos = cache(() =>
  collection<Video>("videos", defaultContent.videos, (r, m) => {
    const file = mediaRef(m, r.video_id);
    return {
      id: String(r.id),
      title: loc(r, "title"),
      description: loc(r, "description"),
      category: loc(r, "category"),
      duration: str(r, "duration") || formatDuration(file?.duration),
      poster: mediaUrl(m, r.poster_id) ?? "",
      src: file?.url,
      youtubeId: str(r, "youtube_id") || undefined,
      featured: r.is_featured === true,
    };
  }),
);

/** The Home page shows exactly three featured videos, in display order. */
export async function getFeaturedVideos(): Promise<Video[]> {
  return (await getVideos()).filter((video) => video.featured).slice(0, 3);
}

function blocks(value: unknown): ArticleBlock[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((b): ArticleBlock[] => {
    if (b?.type === "list" && Array.isArray(b.items)) return [{ type: "list", items: b.items.map(String) }];
    if ((b?.type === "p" || b?.type === "h2" || b?.type === "quote") && typeof b.text === "string") return [{ type: b.type, text: b.text }];
    return [];
  });
}

export const getArticles = cache(() =>
  collection<Article>(
    "articles",
    defaultContent.articles,
    (r, m) => ({
      slug: str(r, "slug"),
      title: loc(r, "title"),
      excerpt: loc(r, "excerpt"),
      date: str(r, "published_on"),
      readMinutes: num(r, "read_minutes") ?? 3,
      image: mediaUrl(m, r.image_id) ?? "",
      category: loc(r, "category"),
      author: loc(r, "author"),
      body: { ar: blocks(r.body_ar), en: blocks(r.body_en) },
    }),
    { column: "sort_order" },
  ),
);

export const getReviews = cache(() =>
  collection<Review>("reviews", defaultContent.reviews, (r, m) => ({
    id: String(r.id),
    name: loc(r, "name"),
    treatment: loc(r, "treatment"),
    text: loc(r, "text"),
    rating: num(r, "rating") ?? 5,
    avatar: mediaUrl(m, r.avatar_id),
    date: str(r, "review_date") || undefined,
  })),
);

export const getFaqs = cache(() =>
  collection<Faq>("faqs", defaultContent.faqs, (r) => ({
    id: String(r.id),
    question: loc(r, "question"),
    answer: loc(r, "answer"),
  })),
);
