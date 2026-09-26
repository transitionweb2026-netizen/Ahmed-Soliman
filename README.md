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
| Videos (incl. the About intro video) | Put files in `public/videos/` matching the `src` names in `content/videos.ts`, or set `youtubeId`. Until then the players show a "coming soon" state. |
| About: technologies, key areas, career milestones, achievements, certificates | `content/about.ts` (add `image` to a certificate to show its real scan) |
| Services & treatments | `content/services.ts` |
| Stats, patient journey, reasons, reviews, FAQ | `content/home.ts` |
| Articles | `content/articles.ts` |
| All interface copy (both languages) | `lib/dictionary.ts` |

The specialty (orthopaedics & sports medicine), credentials, statistics and reviews are **illustrative placeholders** and must be replaced with verified facts.

The contact form has no backend: a valid submission opens WhatsApp with the request pre-filled.

Articles, technologies, specialties and certificates open in a modal (`components/ui/Modal.tsx`) rather than separate pages.

## Structure

- `app/[locale]/…` — pages; `proxy.ts` redirects bare URLs to the saved or default language.
- `components/sections` — page sections. `Hero` is the one hero for every page (`size="full"` on Home/About, `"page"` elsewhere) and includes the `SocialContactBar`; `CTA` is rendered once from the layout.
- `components/cards` — FramedCard (3D glass frame) → ServiceCard, TreatmentCard; DetailCard and ArticleCard open the shared Modal; ReviewCard.
- `components/ui` — GlassCard, GlassButton, SectionHeader, Icon, SocialLinks, SocialContactBar, Modal.
- `components/motion/Interactions.tsx` — the one client island for scroll reveal (`data-reveal`), pointer tilt (`data-tilt`) and glass light.
- `app/globals.css` — design tokens and the Liquid Glass system (`.glass`, `.frame-3d`, `.btn-*`).

Motion respects `prefers-reduced-motion`. SEO: per-page metadata with hreflang alternates, Open Graph/X cards, `sitemap.xml`, `robots.txt`, and JSON-LD (Physician/MedicalClinic, FAQPage, MedicalProcedure list, BreadcrumbList).
