-- Optional phone-only hero image. When empty, phones use image_id like
-- larger screens. Additive: existing rows and columns are unchanged.
alter table public.heroes
  add column if not exists image_mobile_id uuid references public.media (id) on delete restrict;
