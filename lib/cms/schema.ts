/**
 * The CMS schema: every editable thing in the admin, described once.
 *
 * The same objects drive the admin forms (client) and the Server Actions that
 * save them, which only accept columns declared here. Form values are a flat
 * object keyed by database column (title_ar, title_en, image_id, …).
 */
import type { PageKey } from "./types";

export type MediaKind = "image" | "video" | "icon" | "certificate" | "pdf";

type BaseField = {
  /** Column name, or the column prefix for bilingual fields (title → title_ar + title_en). */
  name: string;
  label: string;
  help?: string;
  required?: boolean;
};

export type Field =
  | (BaseField & { type: "text" | "url" | "slug"; placeholder?: string })
  | (BaseField & { type: "textarea"; rows?: number })
  | (BaseField & { type: "l10n"; multiline?: boolean; rows?: number })
  | (BaseField & { type: "l10nList"; itemLabel?: string })
  | (BaseField & { type: "number"; min?: number; max?: number })
  | (BaseField & { type: "toggle" })
  | (BaseField & { type: "date" })
  | (BaseField & { type: "select"; options: Array<{ value: string; label: string }> })
  | (BaseField & { type: "media"; kind: MediaKind; folder: string })
  | (BaseField & { type: "icon"; folder: string })
  | (BaseField & { type: "blocks" })
  | (BaseField & { type: "gallery"; folder: string });

/** Columns a field writes to. */
export function columnsOf(field: Field): string[] {
  switch (field.type) {
    case "l10n":
    case "l10nList":
    case "blocks":
      return [`${field.name}_ar`, `${field.name}_en`];
    case "icon":
      return ["icon", "icon_media_id"];
    case "gallery":
      return [];
    default:
      return [field.name];
  }
}

// ── Upload rules ───────────────────────────────────────────────────────────

export const mediaKinds: Record<MediaKind, { bucket: string; mime: string[]; extensions: string[]; maxBytes: number; label: string }> = {
  image: {
    bucket: "images",
    mime: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"],
    extensions: ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"],
    maxBytes: 10 * 1024 * 1024,
    label: "Image (JPG, PNG, WebP, AVIF, SVG · up to 10 MB)",
  },
  icon: {
    bucket: "icons",
    mime: ["image/svg+xml", "image/png", "image/webp"],
    extensions: ["svg", "png", "webp"],
    maxBytes: 1024 * 1024,
    label: "Icon (SVG or transparent PNG · up to 1 MB)",
  },
  video: {
    bucket: "videos",
    mime: ["video/mp4", "video/webm", "video/quicktime"],
    extensions: ["mp4", "webm", "mov"],
    maxBytes: 200 * 1024 * 1024,
    label: "Video (MP4, WebM, MOV · up to 200 MB)",
  },
  certificate: {
    bucket: "certificates",
    mime: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    extensions: ["jpg", "jpeg", "png", "webp", "pdf"],
    maxBytes: 15 * 1024 * 1024,
    label: "Certificate scan (JPG, PNG, WebP or PDF · up to 15 MB)",
  },
  pdf: {
    bucket: "certificates",
    mime: ["application/pdf"],
    extensions: ["pdf"],
    maxBytes: 15 * 1024 * 1024,
    label: "PDF (up to 15 MB)",
  },
};

// ── Reusable field sets ────────────────────────────────────────────────────

const title = (label = "Title"): Field => ({ type: "l10n", name: "title", label, required: true });
const summary: Field = { type: "l10n", name: "summary", label: "Short description", multiline: true, rows: 3 };
const fullDescription: Field = {
  type: "l10n",
  name: "description",
  label: "Full description",
  multiline: true,
  rows: 6,
  help: "Separate paragraphs with an empty line.",
};
const icon = (folder: string): Field => ({ type: "icon", name: "icon", label: "Icon", folder });
const image = (folder: string, label = "Image"): Field => ({ type: "media", name: "image_id", label, kind: "image", folder });

// ── Collections ────────────────────────────────────────────────────────────

export type CollectionConfig = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  /** Bilingual field shown as the row title in lists. */
  titleField: string;
  /** Media column used as the list thumbnail. */
  thumbField?: string;
  /** "is_active" toggles, or "status" (draft/published) for articles. */
  statusField: "is_active" | "status";
  fields: Field[];
  /** Where the content appears, shown to the editor. */
  usedOn: string;
};

export const collections: CollectionConfig[] = [
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "Main services — the first four appear on Home; all active ones on the Services page.",
    usedOn: "Home · Services page · Contact form",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [
      title(),
      { type: "slug", name: "slug", label: "URL anchor", required: true, help: "Lowercase letters, numbers and dashes, e.g. knee-arthroscopy." },
      summary,
      { ...fullDescription, help: undefined },
      { type: "l10nList", name: "benefits", label: "Highlights", itemLabel: "Highlight" },
      image("services"),
      icon("services"),
      { type: "gallery", name: "gallery", label: "Additional images", folder: "services/gallery", help: "Optional extra photos shown under the main image." },
    ],
  },
  {
    key: "treatments",
    table: "treatments",
    label: "Treatments",
    singular: "Treatment",
    description: "Non-surgical treatments — the first four appear on Home; all active ones on the Services page.",
    usedOn: "Home · Services page (#treatments) · Contact form",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [
      title(),
      { type: "slug", name: "slug", label: "URL anchor", required: true },
      summary,
      { ...fullDescription, help: undefined },
      { type: "l10nList", name: "benefits", label: "Benefits", itemLabel: "Benefit" },
      { type: "l10n", name: "sessions", label: "Sessions (shown on the Home card)" },
      image("treatments"),
      icon("treatments"),
    ],
  },
  {
    key: "technologies",
    table: "technologies",
    label: "Technologies",
    singular: "Technology",
    description: "“Latest Technologies” cards on the About page; each opens a detail popup.",
    usedOn: "About page",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [title(), summary, fullDescription, { type: "l10nList", name: "highlights", label: "Highlights", itemLabel: "Highlight" }, image("technologies"), icon("technologies")],
  },
  {
    key: "specialties",
    table: "specialties",
    label: "Specialties",
    singular: "Specialty",
    description: "“Key Areas” cards on the About page; each opens a detail popup.",
    usedOn: "About page",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [title(), summary, fullDescription, { type: "l10nList", name: "highlights", label: "Highlights", itemLabel: "Highlight" }, image("specialties"), icon("specialties")],
  },
  {
    key: "timeline",
    table: "timeline_items",
    label: "Career Journey",
    singular: "Timeline item",
    description: "The professional timeline on the About page.",
    usedOn: "About page",
    titleField: "title",
    statusField: "is_active",
    fields: [
      { type: "text", name: "period", label: "Year / period", required: true, placeholder: "2015 — 2017" },
      title("Role / title"),
      { type: "l10n", name: "subtitle", label: "Place" },
      { type: "l10n", name: "description", label: "Description", multiline: true, rows: 3 },
      icon("timeline"),
    ],
  },
  {
    key: "achievements",
    table: "achievements",
    label: "Achievements",
    singular: "Achievement",
    description: "Achievement cards on the About page.",
    usedOn: "About page",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [
      title(),
      { type: "l10n", name: "description", label: "Description", multiline: true, rows: 3 },
      { type: "text", name: "year", label: "Year (optional)" },
      image("achievements", "Image (optional)"),
      icon("achievements"),
    ],
  },
  {
    key: "certificates",
    table: "certificates",
    label: "Certificates",
    singular: "Certificate",
    description: "The certificate strip on the About page (click opens an enlarged view).",
    usedOn: "About page",
    titleField: "title",
    thumbField: "image_id",
    statusField: "is_active",
    fields: [
      title("Certificate title"),
      { type: "l10n", name: "description", label: "Description / issuer", multiline: true, rows: 2 },
      { type: "text", name: "year", label: "Year" },
      { type: "media", name: "image_id", label: "Certificate", kind: "certificate", folder: "scans", help: "Upload a scan. Without one, an elegant certificate preview is drawn." },
      { type: "media", name: "pdf_id", label: "PDF (optional)", kind: "pdf", folder: "pdf" },
    ],
  },
  {
    key: "videos",
    table: "videos",
    label: "Videos",
    singular: "Video",
    description: "All active videos appear on the Videos page. Turn on “Featured on Home” for the three shown on Home.",
    usedOn: "Videos page · Home (featured)",
    titleField: "title",
    thumbField: "poster_id",
    statusField: "is_active",
    fields: [
      title(),
      { type: "l10n", name: "description", label: "Description", multiline: true, rows: 3 },
      { type: "l10n", name: "category", label: "Category" },
      { type: "media", name: "video_id", label: "Video file", kind: "video", folder: "library" },
      { type: "media", name: "poster_id", label: "Thumbnail / poster", kind: "image", folder: "videos/posters", help: "Vertical (9:16) images look best." },
      { type: "toggle", name: "is_featured", label: "Featured on Home", help: "The Home page shows the first three featured videos, in display order." },
      { type: "text", name: "duration", label: "Duration (optional)", placeholder: "1:05", help: "Filled in automatically from the uploaded video when left empty." },
      { type: "text", name: "youtube_id", label: "YouTube video ID (optional)", help: "Only if the video is hosted on YouTube instead of uploaded." },
    ],
  },
  {
    key: "articles",
    table: "articles",
    label: "Articles",
    singular: "Article",
    description: "Published articles appear on the Articles page (the first is the featured one) and open in a popup.",
    usedOn: "Articles page",
    titleField: "title",
    thumbField: "image_id",
    statusField: "status",
    fields: [
      title(),
      { type: "slug", name: "slug", label: "Slug", required: true },
      { type: "l10n", name: "excerpt", label: "Short description", multiline: true, rows: 3 },
      { type: "blocks", name: "body", label: "Article content" },
      { type: "media", name: "image_id", label: "Featured image", kind: "image", folder: "articles" },
      { type: "l10n", name: "author", label: "Author" },
      { type: "l10n", name: "category", label: "Category" },
      { type: "date", name: "published_on", label: "Publication date", required: true },
      { type: "number", name: "read_minutes", label: "Reading time (minutes)", min: 1, max: 120 },
    ],
  },
  {
    key: "reviews",
    table: "reviews",
    label: "Reviews",
    singular: "Review",
    description: "Patient reviews — the first four active ones appear on Home.",
    usedOn: "Home",
    titleField: "name",
    thumbField: "avatar_id",
    statusField: "is_active",
    fields: [
      { type: "l10n", name: "name", label: "Patient name", required: true },
      { type: "l10n", name: "treatment", label: "Treatment / procedure" },
      { type: "l10n", name: "text", label: "Review", multiline: true, rows: 4, required: true },
      {
        type: "select",
        name: "rating",
        label: "Rating",
        options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${"★".repeat(n)}${"☆".repeat(5 - n)}  (${n})` })),
      },
      { type: "media", name: "avatar_id", label: "Patient photo (optional)", kind: "image", folder: "reviews" },
      { type: "date", name: "review_date", label: "Date" },
    ],
  },
  {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "Question",
    description: "Frequently asked questions on Home.",
    usedOn: "Home",
    titleField: "question",
    statusField: "is_active",
    fields: [
      { type: "l10n", name: "question", label: "Question", required: true },
      { type: "l10n", name: "answer", label: "Answer", multiline: true, rows: 4, required: true },
    ],
  },
  {
    key: "stats",
    table: "stats",
    label: "Statistics",
    singular: "Statistic",
    description: "The count-up numbers under the Home hero. The first one also appears as the badge in “Why Dr. Ahmed Soliman”.",
    usedOn: "Home",
    titleField: "label",
    statusField: "is_active",
    fields: [
      { type: "number", name: "value", label: "Number", required: true, min: 0 },
      { type: "text", name: "prefix", label: "Prefix", placeholder: "+" },
      { type: "text", name: "suffix", label: "Suffix", placeholder: "+ or %" },
      { type: "l10n", name: "label", label: "Label", required: true },
      icon("stats"),
    ],
  },
  {
    key: "journey",
    table: "journey_steps",
    label: "Patient Journey",
    singular: "Step",
    description: "The connected steps of the patient journey on Home.",
    usedOn: "Home",
    titleField: "title",
    statusField: "is_active",
    fields: [title(), { type: "l10n", name: "description", label: "Description", multiline: true, rows: 2 }, icon("journey")],
  },
  {
    key: "reasons",
    table: "reasons",
    label: "Why Dr. Ahmed",
    singular: "Reason",
    description: "The points in “Why Dr. Ahmed Soliman” on Home.",
    usedOn: "Home",
    titleField: "title",
    statusField: "is_active",
    fields: [title(), { type: "l10n", name: "description", label: "Description", multiline: true, rows: 2 }, icon("reasons")],
  },
  {
    key: "social",
    table: "social_links",
    label: "Social Media",
    singular: "Social link",
    description: "Social icons in the hero contact bar, the footer and the Contact page.",
    usedOn: "Every page",
    titleField: "label",
    statusField: "is_active",
    fields: [
      {
        type: "select",
        name: "platform",
        label: "Platform",
        required: true,
        options: ["facebook", "instagram", "youtube", "tiktok", "x", "linkedin", "whatsapp", "other"].map((p) => ({ value: p, label: p === "x" ? "X (Twitter)" : p[0].toUpperCase() + p.slice(1) })),
      },
      { type: "text", name: "label", label: "Name (for screen readers)", required: true, placeholder: "Instagram" },
      { type: "url", name: "url", label: "Profile link", required: true, placeholder: "https://instagram.com/…" },
      { ...icon("social"), help: "Pick the platform's icon, or upload your own." },
    ],
  },
  {
    key: "navigation",
    table: "nav_items",
    label: "Navigation",
    singular: "Menu item",
    description: "Links in the top menu, the mobile menu and the footer.",
    usedOn: "Every page",
    titleField: "label",
    statusField: "is_active",
    fields: [
      { type: "l10n", name: "label", label: "Label", required: true },
      { type: "text", name: "path", label: "Link", required: true, placeholder: "/about", help: "A page path like /about (the language is added automatically) or a full https:// link." },
      { type: "slug", name: "nav_key", label: "Key", required: true, help: "Internal identifier, e.g. about." },
    ],
  },
];

export function getCollection(key: string): CollectionConfig | undefined {
  return collections.find((c) => c.key === key);
}

/** The column holding a collection's display title (English side of a bilingual field). */
export function titleColumnOf(c: CollectionConfig): string {
  const field = c.fields.find((f) => f.name === c.titleField);
  return field && (field.type === "l10n" || field.type === "l10nList") ? `${c.titleField}_en` : c.titleField;
}

// ── Singletons, heroes, sections, SEO ─────────────────────────────────────

export type RecordConfig = {
  table: string;
  keyColumn: string;
  keyValue: string | number;
  fields: Field[];
};

const button = (name: string, label: string): Field[] => [
  { type: "l10n", name: `${name}_label`, label: `${label} text` },
  { type: "text", name: `${name}_href`, label: `${label} link`, placeholder: "/contact", help: "A page path (/contact, /services#treatments) or a full https:// link." },
];

export const heroFields = (page: PageKey): Field[] => [
  { type: "media", name: "image_id", label: "Background image", kind: "image", folder: `${page}/hero` },
  { type: "l10n", name: "eyebrow", label: "Caption (small label above the title)" },
  { type: "l10n", name: "title", label: "Main title", required: true },
  { type: "l10n", name: "subtitle", label: "Subtitle", multiline: true, rows: 2 },
  { type: "l10n", name: "primary_label", label: "Button 1 text" },
  { type: "text", name: "primary_href", label: "Button 1 link", placeholder: "/contact" },
  { type: "l10n", name: "secondary_label", label: "Button 2 text" },
  { type: "text", name: "secondary_href", label: "Button 2 link", placeholder: "/services" },
  { type: "toggle", name: "is_visible", label: "Show this hero" },
  { type: "toggle", name: "show_contact_panel", label: "Show the social + phone bar" },
];

type SectionEditor = { key: string; label: string; description?: string; fields: Field[] };

const heading = (withSubtitle = true): Field[] => [
  { type: "l10n", name: "eyebrow", label: "Caption (small label)" },
  { type: "l10n", name: "title", label: "Title" },
  ...(withSubtitle ? [{ type: "l10n", name: "subtitle", label: "Subtitle", multiline: true, rows: 2 } as Field] : []),
];

const videoFields = (folder: string): Field[] => [
  { type: "media", name: "video_id", label: "Video file", kind: "video", folder },
  { type: "media", name: "poster_id", label: "Video thumbnail / poster", kind: "image", folder },
  { type: "l10n", name: "caption", label: "Video title" },
];

export type PageEditor = {
  key: string;
  label: string;
  description: string;
  hero?: PageKey;
  sections: SectionEditor[];
};

export const pageEditors: PageEditor[] = [
  {
    key: "home",
    label: "Home",
    description: "Hero and section texts of the Home page. Statistics, services, videos, reviews and FAQs have their own managers.",
    hero: "home",
    sections: [
      { key: "home.stats", label: "Statistics", description: "Label read by screen readers for the statistics band.", fields: [{ type: "l10n", name: "title", label: "Label" }] },
      {
        key: "home.intro",
        label: "Doctor introduction",
        fields: [
          ...heading(false),
          { type: "l10n", name: "body", label: "Text", multiline: true, rows: 6, help: "Separate paragraphs with an empty line." },
          { type: "l10nList", name: "items", label: "Highlights", itemLabel: "Highlight" },
          { type: "media", name: "image_id", label: "Doctor portrait (playing card)", kind: "image", folder: "home/intro" },
          { type: "l10n", name: "caption", label: "Role on the portrait card" },
          ...button("button", "Button"),
        ],
      },
      { key: "home.video", label: "Large video", fields: [...heading(), ...videoFields("home/video")] },
      { key: "home.services", label: "Services preview", fields: [...heading(), ...button("button", "Button")] },
      { key: "home.treatments", label: "Treatments preview", fields: [...heading(), ...button("button", "Button")] },
      { key: "home.journey", label: "Patient journey", fields: heading(false) },
      { key: "home.why", label: "Why Dr. Ahmed Soliman", fields: [...heading(), { type: "media", name: "image_id", label: "Image", kind: "image", folder: "home/why" }] },
      { key: "home.featured", label: "Featured videos", fields: [...heading(), ...button("button", "Button")] },
      { key: "home.reviews", label: "Reviews", fields: heading(false) },
      { key: "home.faq", label: "FAQ", fields: heading(false) },
    ],
  },
  {
    key: "about",
    label: "About",
    description: "Hero and section texts of the About page. Technologies, specialties, timeline, achievements and certificates have their own managers.",
    hero: "about",
    sections: [
      { key: "about.video", label: "Introductory video", fields: videoFields("about/video") },
      { key: "about.intro1", label: "Introduction — block 1", fields: [{ type: "l10n", name: "title", label: "Title" }, { type: "l10n", name: "body", label: "Text", multiline: true, rows: 5 }] },
      { key: "about.intro2", label: "Introduction — block 2", fields: [{ type: "l10n", name: "title", label: "Title" }, { type: "l10n", name: "body", label: "Text", multiline: true, rows: 5 }] },
      { key: "about.technologies", label: "Latest technologies — heading", fields: heading() },
      { key: "about.specialties", label: "Key areas — heading", fields: heading() },
      { key: "about.journey", label: "Career journey — heading", fields: heading() },
      { key: "about.achievements", label: "Achievements — heading", fields: heading(false) },
      { key: "about.certificates", label: "Certificates — heading", fields: heading() },
      {
        key: "about.philosophy",
        label: "Doctor philosophy",
        fields: [
          ...heading(false),
          { type: "l10n", name: "subtitle", label: "Quote", multiline: true, rows: 3 },
          { type: "l10n", name: "body", label: "Personal statement", multiline: true, rows: 6, help: "Separate paragraphs with an empty line." },
          { type: "media", name: "image_id", label: "Doctor portrait (playing card)", kind: "image", folder: "about/philosophy" },
          { type: "l10n", name: "caption", label: "Role on the portrait card" },
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Services page",
    description: "Hero and headings of the Services page.",
    hero: "services",
    sections: [
      { key: "services.services", label: "Services — heading", fields: heading() },
      { key: "services.treatments", label: "Treatments — heading", fields: heading() },
    ],
  },
  { key: "videos", label: "Videos page", description: "Hero of the Videos page.", hero: "videos", sections: [] },
  { key: "articles", label: "Articles page", description: "Hero of the Articles page.", hero: "articles", sections: [] },
  {
    key: "contact",
    label: "Contact page",
    description: "Hero and booking form texts. Phone, address and hours are in Contact Information.",
    hero: "contact",
    sections: [{ key: "contact.form", label: "Booking form", fields: [{ type: "l10n", name: "title", label: "Title" }, { type: "l10n", name: "subtitle", label: "Subtitle", multiline: true, rows: 2 }] }],
  },
  {
    key: "global",
    label: "Global CTA & Footer",
    description: "Blocks shown on every page.",
    sections: [
      {
        key: "global.cta",
        label: "Call-to-action card",
        fields: [
          { type: "media", name: "image_id", label: "Doctor image", kind: "image", folder: "global/cta" },
          { type: "l10n", name: "caption", label: "Role (badge)" },
          { type: "l10n", name: "title", label: "Line 1 (title)" },
          { type: "l10n", name: "subtitle", label: "Line 2", multiline: true, rows: 2 },
          { type: "l10n", name: "button_label", label: "WhatsApp button text", help: "Opens WhatsApp with the number from Contact Information." },
          ...button("button2", "Contact button"),
        ],
      },
      { key: "global.nav", label: "Menu booking button", fields: button("button", "Button") },
      {
        key: "global.footer",
        label: "Footer",
        fields: [
          { type: "l10n", name: "body", label: "About text", multiline: true, rows: 3 },
          { type: "l10n", name: "caption", label: "Closing line" },
        ],
      },
    ],
  },
];

export function getPageEditor(key: string): PageEditor | undefined {
  return pageEditors.find((p) => p.key === key);
}

export const siteSettingsFields: Field[] = [
  { type: "l10n", name: "site_name", label: "Site / doctor name", required: true },
  { type: "l10n", name: "tagline", label: "Specialty / tagline" },
  { type: "url", name: "site_url", label: "Website address", placeholder: "https://drahmedsoliman.com", help: "Used for canonical links, the sitemap and structured data." },
  { type: "l10n", name: "seo_title", label: "Default SEO title" },
  { type: "l10n", name: "seo_description", label: "Default SEO description", multiline: true, rows: 3 },
  { type: "media", name: "default_og_image_id", label: "Default social share image (1200×630)", kind: "image", folder: "seo" },
  { type: "media", name: "favicon_id", label: "Favicon", kind: "icon", folder: "site" },
];

export const contactFields: Field[] = [
  { type: "text", name: "phone", label: "Phone number", placeholder: "+20 100 000 0000", required: true },
  { type: "text", name: "whatsapp_number", label: "WhatsApp number", placeholder: "201000000000", help: "Digits only, with country code (no + or spaces).", required: true },
  { type: "l10n", name: "whatsapp_message", label: "WhatsApp pre-filled message" },
  { type: "text", name: "email", label: "Email" },
  { type: "l10n", name: "address", label: "Address", multiline: true, rows: 2 },
  { type: "l10n", name: "hours", label: "Working hours" },
  { type: "url", name: "booking_url", label: "Online booking link (optional)" },
  { type: "url", name: "map_embed_url", label: "Google Maps embed link", help: "In Google Maps: Share → Embed a map → copy the src link." },
  { type: "number", name: "latitude", label: "Latitude (for directions)" },
  { type: "number", name: "longitude", label: "Longitude (for directions)" },
];

export const seoFields = (page: PageKey): Field[] => [
  { type: "l10n", name: "title", label: "SEO title" },
  { type: "l10n", name: "description", label: "Meta description", multiline: true, rows: 3 },
  { type: "l10n", name: "og_title", label: "Social share title (optional)" },
  { type: "l10n", name: "og_description", label: "Social share description (optional)", multiline: true, rows: 2 },
  { type: "media", name: "og_image_id", label: "Social share image (1200×630, optional)", kind: "image", folder: `seo/${page}` },
  { type: "url", name: "canonical_url", label: "Canonical URL override (advanced)", help: "Leave empty — each language page is its own canonical by default." },
];

/** Every column that stores a media id — used to find where a file is used. */
export const mediaReferences: Array<{ table: string; column: string; keyColumn: string; titleColumn?: string; area: string; href: (key: string) => string }> = [
  ...["image_id", "video_id", "poster_id"].map((column) => ({
    table: "sections",
    column,
    keyColumn: "section_key",
    area: "Page section",
    href: (key: string) => `/admin/pages/${key.split(".")[0]}#${key}`,
  })),
  { table: "heroes", column: "image_id", keyColumn: "page_key", area: "Hero", href: (key) => `/admin/pages/${key}#hero` },
  { table: "seo_pages", column: "og_image_id", keyColumn: "page_key", area: "SEO", href: () => "/admin/seo" },
  { table: "site_settings", column: "default_og_image_id", keyColumn: "id", area: "Site settings", href: () => "/admin/settings" },
  { table: "site_settings", column: "favicon_id", keyColumn: "id", area: "Site settings", href: () => "/admin/settings" },
  { table: "service_images", column: "media_id", keyColumn: "service_id", area: "Service gallery", href: (id) => `/admin/services/${id}` },
  ...collections.flatMap((c) =>
    c.fields
      .flatMap((f) => (f.type === "media" ? [f.name] : f.type === "icon" ? ["icon_media_id"] : []))
      .map((column) => ({
        table: c.table,
        column,
        keyColumn: "id",
        titleColumn: titleColumnOf(c),
        area: c.singular,
        href: (id: string) => `/admin/${c.key}/${id}`,
      })),
  ),
];
