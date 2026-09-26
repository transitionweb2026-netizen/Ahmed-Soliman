/**
 * Populates the CMS with the website's current content (lib/cms/defaults.ts):
 * uploads every image into Supabase Storage, registers it in the media
 * library, and writes all pages, sections and collections.
 *
 *   npm run db:seed            # only when the CMS is empty
 *   npm run db:seed -- --force # wipe CMS content (not media files) and seed again
 *
 * Uses the service-role key, so it must only ever run on a trusted machine.
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./lib/env.mts";

loadEnv();
const { defaultContent, defaultHeroes, defaultSections, defaultSeo, defaultSite } = await import("../lib/cms/defaults");
type Localized = { ar: string; en: string };

const supabase = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});
const force = process.argv.includes("--force");

function check<T>(result: { data: T; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`${what}: ${result.error.message}`);
  return result.data;
}

// ── Guard ──────────────────────────────────────────────────────────────────

const existing = check(await supabase.from("site_settings").select("id").maybeSingle(), "Reading site settings");
const contentTables = [
  "service_images", "services", "treatments", "technologies", "specialties", "timeline_items", "achievements",
  "certificates", "journey_steps", "reasons", "videos", "articles", "reviews", "faqs", "stats", "social_links",
  "nav_items", "heroes", "sections", "seo_pages", "contact_info", "site_settings",
];
if (existing && !force) {
  console.log("The CMS already has content — nothing to do. Use `npm run db:seed -- --force` to wipe and re-seed.");
  process.exit(0);
}
if (force) {
  for (const table of contentTables) {
    const key = table === "heroes" || table === "seo_pages" ? "page_key" : table === "sections" ? "section_key" : "id";
    check(await supabase.from(table).delete().not(key, "is", null), `Clearing ${table}`);
  }
  console.log("Cleared existing CMS content (media files kept).");
}

// ── Media: download each image once, upload to Storage, register ──────────

const mediaIds = new Map<string, string>();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "image";
}

async function uploadImage(url: string | undefined, folder: string, name: string, alt?: Localized): Promise<string | null> {
  if (!url || !url.startsWith("http")) return null;
  const cached = mediaIds.get(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  const mime = response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  const ext = mime === "image/webp" ? "webp" : mime === "image/png" ? "png" : mime === "image/avif" ? "avif" : "jpg";
  const bytes = new Uint8Array(await response.arrayBuffer());
  const path = `${folder}/${slugify(name)}.${ext}`;

  check(await supabase.storage.from("images").upload(path, bytes, { contentType: mime, upsert: true, cacheControl: "31536000" }), `Uploading ${path}`);
  const publicUrl = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  const row = check(
    await supabase
      .from("media")
      .upsert(
        {
          bucket: "images",
          path,
          public_url: publicUrl,
          filename: `${slugify(name)}.${ext}`,
          mime_type: mime,
          size_bytes: bytes.byteLength,
          alt_ar: alt?.ar ?? "",
          alt_en: alt?.en ?? "",
          category: folder.split("/")[0],
        },
        { onConflict: "bucket,path" },
      )
      .select("id")
      .single(),
    `Registering ${path}`,
  );
  mediaIds.set(url, row.id);
  process.stdout.write(".");
  return row.id;
}

// ── Helpers to turn view models back into rows ─────────────────────────────

const l = (field: string, value: Localized | undefined) => ({ [`${field}_ar`]: value?.ar ?? "", [`${field}_en`]: value?.en ?? "" });
const ll = (field: string, value: { ar: string[]; en: string[] } | undefined) => ({ [`${field}_ar`]: value?.ar ?? [], [`${field}_en`]: value?.en ?? [] });

async function insert(table: string, data: Record<string, unknown>[] | Record<string, unknown>) {
  check(await supabase.from(table).insert(data), `Writing ${table}`);
  console.log(`\n  ✓ ${table} (${Array.isArray(data) ? data.length : 1})`);
}

console.log("Uploading images to Supabase Storage");

// ── Site-wide ──────────────────────────────────────────────────────────────

const { settings, contact, socials, nav } = defaultSite;
await insert("site_settings", {
  id: 1,
  ...l("site_name", settings.name),
  ...l("tagline", settings.tagline),
  site_url: settings.url,
  ...l("seo_title", settings.seoTitle),
  ...l("seo_description", settings.seoDescription),
});
await insert("contact_info", {
  id: 1,
  phone: contact.phone,
  whatsapp_number: contact.whatsappNumber,
  ...l("whatsapp_message", contact.whatsappMessage),
  email: contact.email,
  ...l("address", contact.address),
  ...l("hours", contact.hours),
  booking_url: contact.bookingUrl,
  map_embed_url: contact.mapEmbedUrl,
  latitude: contact.latitude,
  longitude: contact.longitude,
});
await insert("social_links", socials.map((s, i) => ({ platform: s.platform, label: s.label, url: s.url, icon: s.icon, sort_order: i })));
await insert("nav_items", nav.map((n, i) => ({ nav_key: n.key, path: n.path, ...l("label", n.label), sort_order: i })));

// ── Heroes, sections, SEO ──────────────────────────────────────────────────

const heroRows = [];
for (const [page, hero] of Object.entries(defaultHeroes)) {
  heroRows.push({
    page_key: page,
    image_id: await uploadImage(hero.image, `${page}/hero`, `${page}-hero`),
    ...l("eyebrow", hero.eyebrow),
    ...l("title", hero.title),
    ...l("subtitle", hero.subtitle),
    ...l("primary_label", hero.primary.label),
    primary_href: hero.primary.href,
    ...l("secondary_label", hero.secondary.label),
    secondary_href: hero.secondary.href,
    is_visible: hero.visible,
    show_contact_panel: hero.showContactPanel,
  });
}
await insert("heroes", heroRows);

const sectionRows = [];
for (const [key, s] of Object.entries(defaultSections)) {
  const [page, name] = key.split(".");
  sectionRows.push({
    section_key: key,
    page_key: page,
    ...l("eyebrow", s.eyebrow),
    ...l("title", s.title),
    ...l("subtitle", s.subtitle),
    ...l("body", s.body),
    ...l("caption", s.caption),
    ...ll("items", s.items),
    ...l("button_label", s.button.label),
    button_href: s.button.href,
    ...l("button2_label", s.button2.label),
    button2_href: s.button2.href,
    image_id: await uploadImage(s.image?.url, `${page}/${name}`, `${page}-${name}`, s.image?.alt),
    poster_id: await uploadImage(s.poster?.url, `${page}/${name}`, `${page}-${name}-poster`),
    // Videos are uploaded from the CMS; the old placeholder paths had no files.
    video_id: null,
  });
}
await insert("sections", sectionRows);

await insert(
  "seo_pages",
  Object.entries(defaultSeo).map(([page, seo]) => ({
    page_key: page,
    ...l("title", seo.title),
    ...l("description", seo.description),
    canonical_url: seo.canonical,
    ...l("og_title", seo.ogTitle),
    ...l("og_description", seo.ogDescription),
  })),
);

// ── Collections ────────────────────────────────────────────────────────────

const c = defaultContent;

await insert("stats", c.stats.map((s, i) => ({ value: s.value, prefix: s.prefix ?? "", suffix: s.suffix ?? "", ...l("label", s.label), icon: s.icon, sort_order: i })));

const serviceRows = [];
for (const [i, s] of c.services.entries()) {
  serviceRows.push({
    slug: s.slug, ...l("title", s.title), ...l("summary", s.summary), ...l("description", s.description), ...ll("benefits", s.benefits),
    image_id: await uploadImage(s.image, "services", s.slug, s.title), icon: s.icon, sort_order: i,
  });
}
await insert("services", serviceRows);

const treatmentRows = [];
for (const [i, t] of c.treatments.entries()) {
  treatmentRows.push({
    slug: t.slug, ...l("title", t.title), ...l("summary", t.summary), ...l("description", t.description), ...ll("benefits", t.benefits),
    ...l("sessions", t.sessions), image_id: await uploadImage(t.image, "treatments", t.slug, t.title), icon: t.icon, sort_order: i,
  });
}
await insert("treatments", treatmentRows);

for (const [table, items] of [["technologies", c.technologies], ["specialties", c.specialties]] as const) {
  const detailRows = [];
  for (const [i, d] of items.entries()) {
    detailRows.push({
      ...l("title", d.title), ...l("summary", d.summary),
      description_ar: d.details.ar.join("\n\n"), description_en: d.details.en.join("\n\n"),
      ...ll("highlights", d.highlights), image_id: await uploadImage(d.image, table, `${table}-${d.id}`, d.title), icon: d.icon, sort_order: i,
    });
  }
  await insert(table, detailRows);
}

await insert("timeline_items", c.timeline.map((m, i) => ({ period: m.period, ...l("title", m.role), ...l("subtitle", m.place), ...l("description", m.text), icon: m.icon, sort_order: i })));
await insert("achievements", c.achievements.map((a, i) => ({ ...l("title", a.title), ...l("description", a.text), year: a.year ?? "", icon: a.icon, sort_order: i })));
await insert("certificates", c.certificates.map((cert, i) => ({ ...l("title", cert.title), ...l("description", cert.description), year: cert.year, sort_order: i })));
await insert("journey_steps", c.journey.map((j, i) => ({ ...l("title", j.title), ...l("description", j.text), icon: j.icon, sort_order: i })));
await insert("reasons", c.reasons.map((r, i) => ({ ...l("title", r.title), ...l("description", r.text), icon: r.icon, sort_order: i })));

const videoRows = [];
for (const [i, v] of c.videos.entries()) {
  videoRows.push({
    ...l("title", v.title), duration: v.duration, poster_id: await uploadImage(v.poster, "videos/posters", `video-${v.id}`, v.title),
    is_featured: v.featured === true, sort_order: i,
  });
}
await insert("videos", videoRows);

const articleRows = [];
const sortedArticles = [...c.articles].sort((a, b) => b.date.localeCompare(a.date));
for (const [i, a] of sortedArticles.entries()) {
  articleRows.push({
    slug: a.slug, ...l("title", a.title), ...l("excerpt", a.excerpt), body_ar: a.body.ar, body_en: a.body.en,
    ...l("author", a.author), ...l("category", a.category), image_id: await uploadImage(a.image, "articles", a.slug, a.title),
    published_on: a.date, read_minutes: a.readMinutes, status: "published", sort_order: i,
  });
}
await insert("articles", articleRows);

await insert("reviews", c.reviews.map((r, i) => ({ ...l("name", r.name), ...l("treatment", r.treatment), ...l("text", r.text), rating: r.rating, sort_order: i })));
await insert("faqs", c.faqs.map((f, i) => ({ ...l("question", f.question), ...l("answer", f.answer), sort_order: i })));

console.log(`\nDone. ${mediaIds.size} images uploaded to the "images" bucket and registered in the media library.`);
