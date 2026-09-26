# Dr. Ahmed Soliman — website + CMS

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Storage, Auth, RLS).
Public site in Arabic (default, RTL) and English (LTR); content is managed in the admin at **`/admin`**.

```
CMS (/admin) → Supabase (database + storage) → Next.js → website
```

## Setup

```bash
npm install
cp .env.example .env.local      # fill in the values (see below)
npm run db:migrate              # create tables, RLS policies and storage buckets
npm run db:seed                 # copy the site's original content + images into the CMS (once)
npm run admin:create -- you@example.com 'a-strong-password'
npm run dev                     # http://localhost:3000 → /ar ; CMS at /admin
```

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | app + scripts | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | app + scripts | Publishable / anon key (safe in the browser; RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | **scripts only** | Seed + create-admin. Never used by the app, never sent to the browser |
| `SUPABASE_DB_URL` or `SUPABASE_DB_PASSWORD` | scripts only | `db:migrate` (the script finds the pooler from the password if no URL is given) |
| `NEXT_PUBLIC_SITE_URL` | optional | Fallback site address before the CMS "Website address" is set |

On a host (e.g. Vercel) set only the two `NEXT_PUBLIC_SUPABASE_*` variables.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run db:migrate` | Applies `supabase/migrations/*.sql` not yet run (history in `supabase_migrations.schema_migrations`, compatible with the Supabase CLI) |
| `npm run db:seed` | Populates an empty CMS from `lib/cms/defaults.ts` and uploads the images to Storage. `-- --force` wipes CMS content (not files) and re-seeds |
| `npm run admin:create -- <email> [password]` | Creates a confirmed Auth user (or updates the password) and adds it to `public.admins` |
| `npm run db:verify-security` | Live RLS check with a temporary non-admin user (deleted afterwards) |

## How it works

- **Database** (`supabase/migrations/…_cms_schema.sql`): bilingual text is stored as `<field>_ar` / `<field>_en`. Collections (services, treatments, technologies, specialties, timeline, achievements, certificates, videos, articles, reviews, FAQs, statistics, patient-journey steps, reasons, social links, navigation) have `sort_order` and `is_active` (articles: `status`). Page copy lives in `heroes` (one per page) and `sections` (content blocks); plus `site_settings`, `contact_info`, `seo_pages`.
- **Files** live in Storage buckets `images`, `videos`, `icons`, `certificates`, `documents`, in folders per area (e.g. `images/home/hero/…`, `videos/library/2026/09/…`). The `media` table stores path, public URL, name, type, size, dimensions/duration and alt text. Content references media with `ON DELETE RESTRICT`, so a file in use cannot be deleted accidentally.
- **Security**: RLS on every table. Visitors read only active/published rows; users listed in `public.admins` can read and write everything. The admin area uses the signed-in user's session (no service role at runtime); `/admin/*` is protected in `proxy.ts` and re-checked on the server and in every Server Action.
- **Publishing**: public pages are static. Every save in the CMS calls `revalidatePath`, so changes are live on the next visit.
- **Fallback**: before Supabase is configured or seeded (no `site_settings` row), the site renders the original content from `content/` + `lib/dictionary.ts`, via `lib/cms/defaults.ts`. Once seeded, Supabase is the only source.

### Code map

- `lib/cms/schema.ts` — every editable field, collection, page section and upload rule (drives the admin forms and server-side validation).
- `lib/cms/data.ts` — public data access (anonymous client) → the shapes the components render.
- `app/admin/actions.ts` — Server Actions (save, reorder, publish, delete with media safety, media library, sign-in).
- `lib/cms/upload.ts` + `components/admin/MediaUploader.tsx` — the single resumable (TUS) upload path with progress.
- `components/admin/*` — admin UI (shell, forms, field inputs, lists, media library).

Interface labels (menu words like "Read more", form labels, 404 text) stay in `lib/dictionary.ts`; everything that is content is in the CMS.

## Notes

- Supabase's global upload limit applies (Free plan: 50 MB per file). The `videos` bucket and the uploader allow up to 200 MB — raise the project limit in Storage settings for larger videos.
- The doctor's specialty, credentials, statistics and reviews seeded from the original site are placeholders — replace them in the CMS.
