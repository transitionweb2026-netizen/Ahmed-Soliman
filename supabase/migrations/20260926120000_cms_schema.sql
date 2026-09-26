-- =============================================================================
-- Dr. Ahmed Soliman — CMS schema
--
-- Conventions
--   * Bilingual text uses paired columns: <field>_ar / <field>_en.
--   * Files live in Supabase Storage; `media` holds their metadata and every
--     content table points at it with ON DELETE RESTRICT, so a file that is
--     still in use can never be deleted by accident.
--   * Repeated content has sort_order + is_active (articles use status).
--   * Public (anon) users read only active/published rows; admins (rows in
--     public.admins) can do everything. Writes never need the service role.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so policies can check admin status without granting
-- anyone read access to the admins table itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Media library
-- ---------------------------------------------------------------------------

create table public.media (
  id               uuid primary key default gen_random_uuid(),
  bucket           text not null check (bucket in ('images', 'videos', 'certificates', 'icons', 'documents')),
  path             text not null,
  public_url       text not null,
  filename         text not null,
  mime_type        text not null,
  size_bytes       bigint not null check (size_bytes >= 0),
  width            integer,
  height           integer,
  duration_seconds numeric(10, 2),
  alt_ar           text not null default '',
  alt_en           text not null default '',
  category         text not null default 'general',
  uploaded_by      uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (bucket, path)
);

create index media_bucket_idx on public.media (bucket);
create index media_created_idx on public.media (created_at desc);

-- ---------------------------------------------------------------------------
-- Singletons: site settings and contact information
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id                   smallint primary key default 1 check (id = 1),
  site_name_ar         text not null default '',
  site_name_en         text not null default '',
  tagline_ar           text not null default '',
  tagline_en           text not null default '',
  site_url             text not null default '',
  seo_title_ar         text not null default '',
  seo_title_en         text not null default '',
  seo_description_ar   text not null default '',
  seo_description_en   text not null default '',
  default_og_image_id  uuid references public.media (id) on delete restrict,
  favicon_id           uuid references public.media (id) on delete restrict,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table public.contact_info (
  id                  smallint primary key default 1 check (id = 1),
  phone               text not null default '',
  whatsapp_number     text not null default '' check (whatsapp_number ~ '^[0-9]*$'),
  whatsapp_message_ar text not null default '',
  whatsapp_message_en text not null default '',
  email               text not null default '',
  address_ar          text not null default '',
  address_en          text not null default '',
  hours_ar            text not null default '',
  hours_en            text not null default '',
  booking_url         text not null default '',
  map_embed_url       text not null default '',
  latitude            numeric(9, 6),
  longitude           numeric(9, 6),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Navigation and social links
-- ---------------------------------------------------------------------------

create table public.nav_items (
  id         uuid primary key default gen_random_uuid(),
  nav_key    text not null unique,
  path       text not null,
  label_ar   text not null default '',
  label_en   text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null,
  label         text not null default '',
  url           text not null,
  icon          text,
  icon_media_id uuid references public.media (id) on delete restrict,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Page content: heroes, section blocks, SEO
-- ---------------------------------------------------------------------------

create table public.heroes (
  page_key           text primary key check (page_key in ('home', 'about', 'services', 'videos', 'articles', 'contact')),
  image_id           uuid references public.media (id) on delete restrict,
  eyebrow_ar         text not null default '',
  eyebrow_en         text not null default '',
  title_ar           text not null default '',
  title_en           text not null default '',
  subtitle_ar        text not null default '',
  subtitle_en        text not null default '',
  primary_label_ar   text not null default '',
  primary_label_en   text not null default '',
  primary_href       text not null default '',
  secondary_label_ar text not null default '',
  secondary_label_en text not null default '',
  secondary_href     text not null default '',
  is_visible         boolean not null default true,
  show_contact_panel boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- A generic content block. Each section_key uses the subset of fields it
-- needs (the admin UI only shows those); unused columns stay empty.
create table public.sections (
  section_key      text primary key,
  page_key         text not null,
  eyebrow_ar       text not null default '',
  eyebrow_en       text not null default '',
  title_ar         text not null default '',
  title_en         text not null default '',
  subtitle_ar      text not null default '',
  subtitle_en      text not null default '',
  body_ar          text not null default '',
  body_en          text not null default '',
  caption_ar       text not null default '',
  caption_en       text not null default '',
  items_ar         text[] not null default '{}',
  items_en         text[] not null default '{}',
  button_label_ar  text not null default '',
  button_label_en  text not null default '',
  button_href      text not null default '',
  button2_label_ar text not null default '',
  button2_label_en text not null default '',
  button2_href     text not null default '',
  image_id         uuid references public.media (id) on delete restrict,
  video_id         uuid references public.media (id) on delete restrict,
  poster_id        uuid references public.media (id) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index sections_page_idx on public.sections (page_key);

create table public.seo_pages (
  page_key          text primary key check (page_key in ('home', 'about', 'services', 'videos', 'articles', 'contact')),
  title_ar          text not null default '',
  title_en          text not null default '',
  description_ar    text not null default '',
  description_en    text not null default '',
  canonical_url     text not null default '',
  og_title_ar       text not null default '',
  og_title_en       text not null default '',
  og_description_ar text not null default '',
  og_description_en text not null default '',
  og_image_id       uuid references public.media (id) on delete restrict,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------

create table public.stats (
  id            uuid primary key default gen_random_uuid(),
  value         bigint not null default 0,
  prefix        text not null default '',
  suffix        text not null default '',
  label_ar      text not null default '',
  label_en      text not null default '',
  icon          text,
  icon_media_id uuid references public.media (id) on delete restrict,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.services (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar       text not null default '',
  title_en       text not null default '',
  summary_ar     text not null default '',
  summary_en     text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  benefits_ar    text[] not null default '{}',
  benefits_en    text[] not null default '{}',
  image_id       uuid references public.media (id) on delete restrict,
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.service_images (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  media_id   uuid not null references public.media (id) on delete restrict,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, media_id)
);

create index service_images_service_idx on public.service_images (service_id);

create table public.treatments (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar       text not null default '',
  title_en       text not null default '',
  summary_ar     text not null default '',
  summary_en     text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  benefits_ar    text[] not null default '{}',
  benefits_en    text[] not null default '{}',
  sessions_ar    text not null default '',
  sessions_en    text not null default '',
  image_id       uuid references public.media (id) on delete restrict,
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Technologies and specialties share a shape: card + detail modal.
create table public.technologies (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  summary_ar     text not null default '',
  summary_en     text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  highlights_ar  text[] not null default '{}',
  highlights_en  text[] not null default '{}',
  image_id       uuid references public.media (id) on delete restrict,
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.specialties (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  summary_ar     text not null default '',
  summary_en     text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  highlights_ar  text[] not null default '{}',
  highlights_en  text[] not null default '{}',
  image_id       uuid references public.media (id) on delete restrict,
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.timeline_items (
  id             uuid primary key default gen_random_uuid(),
  period         text not null default '',
  title_ar       text not null default '',
  title_en       text not null default '',
  subtitle_ar    text not null default '',
  subtitle_en    text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.achievements (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  year           text not null default '',
  image_id       uuid references public.media (id) on delete restrict,
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  year           text not null default '',
  image_id       uuid references public.media (id) on delete restrict,
  pdf_id         uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Home: patient journey steps and "Why Dr. Ahmed Soliman" reasons.
create table public.journey_steps (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.reasons (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  icon           text,
  icon_media_id  uuid references public.media (id) on delete restrict,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.videos (
  id             uuid primary key default gen_random_uuid(),
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  category_ar    text not null default '',
  category_en    text not null default '',
  video_id       uuid references public.media (id) on delete restrict,
  poster_id      uuid references public.media (id) on delete restrict,
  youtube_id     text not null default '',
  duration       text not null default '',
  is_featured    boolean not null default false,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar     text not null default '',
  title_en     text not null default '',
  excerpt_ar   text not null default '',
  excerpt_en   text not null default '',
  -- Structured body: [{ "type": "p"|"h2"|"quote", "text": "…" } | { "type": "list", "items": ["…"] }]
  body_ar      jsonb not null default '[]'::jsonb check (jsonb_typeof(body_ar) = 'array'),
  body_en      jsonb not null default '[]'::jsonb check (jsonb_typeof(body_en) = 'array'),
  author_ar    text not null default '',
  author_en    text not null default '',
  category_ar  text not null default '',
  category_en  text not null default '',
  image_id     uuid references public.media (id) on delete restrict,
  published_on date not null default current_date,
  read_minutes integer not null default 3 check (read_minutes > 0),
  status       text not null default 'draft' check (status in ('draft', 'published')),
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  name_ar      text not null default '',
  name_en      text not null default '',
  treatment_ar text not null default '',
  treatment_en text not null default '',
  text_ar      text not null default '',
  text_en      text not null default '',
  rating       smallint not null default 5 check (rating between 1 and 5),
  avatar_id    uuid references public.media (id) on delete restrict,
  review_date  date,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question_ar text not null default '',
  question_en text not null default '',
  answer_ar   text not null default '',
  answer_en   text not null default '',
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes on foreign keys (media lookups for "where is this file used")
-- ---------------------------------------------------------------------------

do $$
declare
  fk record;
begin
  for fk in
    select c.conrelid::regclass as tbl, cl.relname as tbl_name, a.attname as col
    from pg_constraint c
    join pg_class cl on cl.oid = c.conrelid
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.contype = 'f'
      and c.confrelid = 'public.media'::regclass
      and c.connamespace = 'public'::regnamespace
  loop
    execute format('create index if not exists %I on %s (%I)', fk.tbl_name || '_' || fk.col || '_idx', fk.tbl, fk.col);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- updated_at triggers + Row Level Security
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  -- table => public read condition
  public_tables constant jsonb := jsonb_build_object(
    'media',          'true',
    'site_settings',  'true',
    'contact_info',   'true',
    'heroes',         'true',
    'sections',       'true',
    'seo_pages',      'true',
    'nav_items',      'is_active',
    'social_links',   'is_active',
    'stats',          'is_active',
    'services',       'is_active',
    'treatments',     'is_active',
    'technologies',   'is_active',
    'specialties',    'is_active',
    'timeline_items', 'is_active',
    'achievements',   'is_active',
    'certificates',   'is_active',
    'journey_steps',  'is_active',
    'reasons',        'is_active',
    'videos',         'is_active',
    'reviews',        'is_active',
    'faqs',           'is_active',
    'articles',       'status = ''published''',
    'service_images', 'exists (select 1 from public.services s where s.id = service_id and s.is_active)'
  );
begin
  for t in select jsonb_object_keys(public_tables)
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "Public can read published rows" on public.%I for select to anon, authenticated using (%s)', t, public_tables ->> t);
    execute format('create policy "Admins can read everything" on public.%I for select to authenticated using ((select public.is_admin()))', t);
    execute format('create policy "Admins can insert" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admins can update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins can delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- The admins table: only admins can see who the admins are. Adding an admin
-- is done with the service role (scripts/create-admin.ts) or the SQL editor.
alter table public.admins enable row level security;
grant select on public.admins to authenticated;
create policy "Admins can read admins" on public.admins for select to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage buckets (public read; only admins can write)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('images',       'images',       true, 10485760,  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']),
  ('icons',        'icons',        true, 1048576,   array['image/svg+xml', 'image/png', 'image/webp']),
  ('videos',       'videos',       true, 209715200, array['video/mp4', 'video/webm', 'video/quicktime']),
  ('certificates', 'certificates', true, 15728640,  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('documents',    'documents',    true, 15728640,  array['application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "CMS admins can read files" on storage.objects for select to authenticated
  using (bucket_id in ('images', 'icons', 'videos', 'certificates', 'documents') and (select public.is_admin()));
create policy "CMS admins can upload files" on storage.objects for insert to authenticated
  with check (bucket_id in ('images', 'icons', 'videos', 'certificates', 'documents') and (select public.is_admin()));
create policy "CMS admins can update files" on storage.objects for update to authenticated
  using (bucket_id in ('images', 'icons', 'videos', 'certificates', 'documents') and (select public.is_admin()))
  with check (bucket_id in ('images', 'icons', 'videos', 'certificates', 'documents') and (select public.is_admin()));
create policy "CMS admins can delete files" on storage.objects for delete to authenticated
  using (bucket_id in ('images', 'icons', 'videos', 'certificates', 'documents') and (select public.is_admin()));
