/**
 * The site's original content, shaped exactly like the CMS data.
 *
 * Two consumers, one source:
 *  - scripts/seed.mts writes it into Supabase once, to populate the CMS;
 *  - lib/cms/data.ts falls back to it only while the CMS has not been set up
 *    (no Supabase keys, or the database has not been seeded yet).
 * Once seeded, Supabase is the source of truth and edits happen in /admin.
 */
import { getDictionary } from "@/lib/dictionary";
import type { Localized } from "@/lib/i18n";
import { navItems } from "@/lib/nav";
import { achievements, certificates, keyAreas, milestones, technologies } from "@/content/about";
import { articles } from "@/content/articles";
import { faqs, journey, reasons, reviews, stats } from "@/content/home";
import { media } from "@/content/media";
import { services, treatments } from "@/content/services";
import { site } from "@/content/site";
import { aboutVideo, introVideo, videos } from "@/content/videos";
import { emptySection, type HeroContent, type PageKey, type SectionContent, type SeoContent, type SiteData } from "./types";

const ar = getDictionary("ar");
const en = getDictionary("en");

/** Build a Localized value by picking the same path from both dictionaries. */
function both<T>(pick: (dict: typeof ar) => T): Localized<T> {
  return { ar: pick(ar), en: pick(en) };
}

const empty: Localized = { ar: "", en: "" };

function section(values: Partial<SectionContent>): SectionContent {
  return { ...emptySection(), ...values };
}

function image(url: string, alt: Localized = empty) {
  return { url, alt };
}

export const defaultSite: SiteData = {
  settings: {
    name: site.name,
    tagline: site.specialty,
    url: site.url,
    seoTitle: { ar: `${site.name.ar} | ${site.specialty.ar}`, en: `${site.name.en} | ${site.specialty.en}` },
    seoDescription: both((d) => d.footer.about),
  },
  contact: {
    phone: site.phone,
    phoneHref: site.phoneHref,
    whatsappNumber: site.whatsappNumber,
    whatsappMessage: both((d) => d.cta.whatsappMessage),
    email: site.email,
    address: site.address,
    hours: site.hours,
    bookingUrl: "",
    mapEmbedUrl: site.mapEmbedUrl,
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  socials: site.socials.map((s) => ({ id: s.name.toLowerCase(), platform: s.name.toLowerCase(), label: s.name, url: s.href, icon: s.icon })),
  nav: navItems.map((item) => ({ key: item.key, path: item.path, label: both((d) => d.nav[item.key]) })),
};

const heroButtons = {
  primary: { label: both((d) => d.hero.book), href: "/contact" },
  secondary: { label: both((d) => d.hero.services), href: "/services" },
};

function hero(img: string, eyebrow: Localized, title: Localized, subtitle: Localized): HeroContent {
  return { image: img, eyebrow, title, subtitle, ...heroButtons, visible: true, showContactPanel: true };
}

export const defaultHeroes: Record<PageKey, HeroContent> = {
  home: hero(media.heroCover, both((d) => d.hero.eyebrow), both((d) => d.hero.line1), both((d) => d.hero.line2)),
  about: hero(media.heroCover, both((d) => d.about.heroEyebrow), both((d) => d.about.heroLine1), both((d) => d.about.heroLine2)),
  services: hero(media.operatingRoom, both((d) => d.servicesPage.eyebrow), both((d) => d.servicesPage.title), both((d) => d.servicesPage.subtitle)),
  videos: hero(media.consultation, both((d) => d.videosPage.eyebrow), both((d) => d.videosPage.title), both((d) => d.videosPage.subtitle)),
  articles: hero(media.laptop, both((d) => d.articlesPage.eyebrow), both((d) => d.articlesPage.title), both((d) => d.articlesPage.subtitle)),
  contact: hero(media.reception, both((d) => d.contactPage.eyebrow), both((d) => d.contactPage.title), both((d) => d.contactPage.subtitle)),
};

const joinParagraphs = (list: string[]) => list.join("\n\n");

export const defaultSections: Record<string, SectionContent> = {
  // ── Home ──
  "home.stats": section({ title: both((d) => d.stats.title) }),
  "home.intro": section({
    eyebrow: both((d) => d.intro.eyebrow),
    title: both((d) => d.intro.title),
    body: both((d) => joinParagraphs(d.intro.body)),
    items: both((d) => d.intro.highlights),
    caption: both((d) => d.intro.cardRole),
    button: { label: both((d) => d.intro.cta), href: "/about" },
    image: image(media.doctorPortrait, site.name),
  }),
  "home.video": section({
    eyebrow: both((d) => d.video.eyebrow),
    title: both((d) => d.video.title),
    subtitle: both((d) => d.video.subtitle),
    caption: introVideo.title,
    video: introVideo.src ? { url: introVideo.src, alt: introVideo.title } : undefined,
    poster: image(introVideo.poster),
  }),
  "home.services": section({
    eyebrow: both((d) => d.services.eyebrow),
    title: both((d) => d.services.title),
    subtitle: both((d) => d.services.subtitle),
    button: { label: both((d) => d.services.cta), href: "/services#services" },
  }),
  "home.treatments": section({
    eyebrow: both((d) => d.treatments.eyebrow),
    title: both((d) => d.treatments.title),
    subtitle: both((d) => d.treatments.subtitle),
    button: { label: both((d) => d.treatments.cta), href: "/services#treatments" },
  }),
  "home.journey": section({ eyebrow: both((d) => d.journey.eyebrow), title: both((d) => d.journey.title) }),
  "home.why": section({
    eyebrow: both((d) => d.why.eyebrow),
    title: both((d) => d.why.title),
    subtitle: both((d) => d.why.subtitle),
    image: image(media.doctorWithPatient),
  }),
  "home.featured": section({
    eyebrow: both((d) => d.featured.eyebrow),
    title: both((d) => d.featured.title),
    subtitle: both((d) => d.featured.subtitle),
    button: { label: both((d) => d.featured.cta), href: "/videos" },
  }),
  "home.reviews": section({ eyebrow: both((d) => d.reviews.eyebrow), title: both((d) => d.reviews.title) }),
  "home.faq": section({ eyebrow: both((d) => d.faq.eyebrow), title: both((d) => d.faq.title) }),

  // ── About ──
  "about.video": section({
    caption: aboutVideo.title,
    video: aboutVideo.src ? { url: aboutVideo.src, alt: aboutVideo.title } : undefined,
    poster: image(aboutVideo.poster),
  }),
  "about.intro1": section({ title: both((d) => d.about.introBlocks[0].title), body: both((d) => d.about.introBlocks[0].text) }),
  "about.intro2": section({ title: both((d) => d.about.introBlocks[1].title), body: both((d) => d.about.introBlocks[1].text) }),
  "about.technologies": section({
    eyebrow: both((d) => d.about.techEyebrow),
    title: both((d) => d.about.techTitle),
    subtitle: both((d) => d.about.techSubtitle),
  }),
  "about.specialties": section({
    eyebrow: both((d) => d.about.areasEyebrow),
    title: both((d) => d.about.areasTitle),
    subtitle: both((d) => d.about.areasSubtitle),
  }),
  "about.journey": section({
    eyebrow: both((d) => d.about.journeyEyebrow),
    title: both((d) => d.about.journeyTitle),
    subtitle: both((d) => d.about.journeySubtitle),
  }),
  "about.achievements": section({ eyebrow: both((d) => d.about.achievementsEyebrow), title: both((d) => d.about.achievementsTitle) }),
  "about.certificates": section({
    eyebrow: both((d) => d.about.certificatesEyebrow),
    title: both((d) => d.about.certificatesTitle),
    subtitle: both((d) => d.about.certificatesSubtitle),
  }),
  "about.philosophy": section({
    eyebrow: both((d) => d.about.philosophyEyebrow),
    title: both((d) => d.about.philosophyTitle),
    subtitle: both((d) => d.about.philosophyQuote),
    body: both((d) => joinParagraphs(d.about.philosophyBody)),
    caption: both((d) => d.intro.cardRole),
    image: image(media.doctorPortraitAlt, site.name),
  }),

  // ── Services / Contact ──
  "services.services": section({
    eyebrow: both((d) => d.services.eyebrow),
    title: both((d) => d.services.title),
    subtitle: both((d) => d.services.subtitle),
  }),
  "services.treatments": section({
    eyebrow: both((d) => d.treatments.eyebrow),
    title: both((d) => d.treatments.title),
    subtitle: both((d) => d.treatments.subtitle),
  }),
  "contact.form": section({ title: both((d) => d.contactPage.formTitle), subtitle: both((d) => d.contactPage.formSubtitle) }),

  // ── Global (every page) ──
  "global.cta": section({
    caption: both((d) => d.intro.cardRole),
    title: both((d) => d.cta.line1),
    subtitle: both((d) => d.cta.line2),
    button: { label: both((d) => d.cta.whatsapp), href: "" },
    button2: { label: both((d) => d.cta.contact), href: "/contact" },
    image: image(media.doctorPortrait, site.name),
  }),
  "global.nav": section({ button: { label: both((d) => d.nav.book), href: "/contact" } }),
  "global.footer": section({ body: both((d) => d.footer.about), caption: both((d) => d.footer.tagline) }),
};

function seo(title: Localized, description: Localized): SeoContent {
  return { title, description, canonical: "", ogTitle: empty, ogDescription: empty };
}

export const defaultSeo: Record<PageKey, SeoContent> = {
  home: seo(site.name, both((d) => d.footer.about)),
  about: seo(both((d) => d.about.title), both((d) => d.about.subtitle)),
  services: seo(both((d) => d.servicesPage.title), both((d) => d.servicesPage.subtitle)),
  videos: seo(both((d) => d.videosPage.title), both((d) => d.videosPage.subtitle)),
  articles: seo(both((d) => d.articlesPage.title), both((d) => d.articlesPage.subtitle)),
  contact: seo(both((d) => d.contactPage.title), both((d) => d.contactPage.subtitle)),
};

/** All collections, in display order. */
export const defaultContent = {
  stats,
  services,
  treatments,
  technologies,
  specialties: keyAreas,
  timeline: milestones,
  achievements,
  certificates,
  journey,
  reasons,
  videos: videos.map((video, i) => ({ ...video, featured: i < 3 })),
  articles,
  reviews,
  faqs,
};
