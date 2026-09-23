# Dr. Ahmed Soliman — website

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4. Arabic (default, RTL) and English (LTR).

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /ar
npm run build && npm start
```

## Before launch — replace placeholder content

| What | Where |
| --- | --- |
| Phone, WhatsApp number, email, address, hours, map, social links, domain | `content/site.ts` (or set `NEXT_PUBLIC_SITE_URL`) |
| Photos (currently Unsplash stock) | `content/media.ts` — drop files in `public/images/` and point to `/images/…` |
| Videos | Put files in `public/videos/` matching the `src` names in `content/videos.ts`, or set `youtubeId`. Until then the players show a "coming soon" state. |
| Biography, credentials, milestones, achievements | `content/about.ts` |
| Services & treatments | `content/services.ts` |
| Stats, patient journey, reasons, reviews, FAQ | `content/home.ts` |
| Articles | `content/articles.ts` |
| All interface copy (both languages) | `lib/dictionary.ts` |

The specialty (orthopaedics & sports medicine), credentials, statistics and reviews are **illustrative placeholders** and must be replaced with verified facts.

The contact form has no backend: a valid submission opens WhatsApp with the request pre-filled.

## Structure

- `app/[locale]/…` — pages; `proxy.ts` redirects bare URLs to the saved or default language.
- `components/sections` — page sections (Hero, Statistics, DoctorCard, VideoSection, PatientJourney, WhyDoctor, FeaturedVideos, ReviewsFaq, FAQ, CTA, PageHero…).
- `components/cards` — FramedCard (3D glass frame) → ServiceCard, TreatmentCard, ArticleCard; ReviewCard.
- `components/ui` — GlassCard, GlassButton, SectionHeader, Icon, SocialLinks.
- `components/motion/Interactions.tsx` — the one client island for scroll reveal (`data-reveal`), pointer tilt (`data-tilt`) and glass light.
- `app/globals.css` — design tokens and the Liquid Glass system (`.glass`, `.frame-3d`, `.btn-*`).

Motion respects `prefers-reduced-motion`. SEO: per-page metadata with hreflang alternates, Open Graph/X cards, `sitemap.xml`, `robots.txt`, and JSON-LD (Physician/MedicalClinic, FAQPage, MedicalWebPage, BreadcrumbList).
