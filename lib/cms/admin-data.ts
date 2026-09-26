import "server-only";
import type { MediaItem } from "@/app/admin/actions";
import { mediaIdsIn, requireAdmin, selectColumns, type Values } from "./admin";
import { titleColumnOf, type CollectionConfig, type Field } from "./schema";

const MEDIA_COLUMNS = "id, bucket, path, public_url, filename, mime_type, size_bytes, width, height, duration_seconds, alt_ar, alt_en, category, created_at";

type Client = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function mediaByIds(supabase: Client, ids: string[]): Promise<Record<string, MediaItem>> {
  if (!ids.length) return {};
  const { data, error } = await supabase.from("media").select(MEDIA_COLUMNS).in("id", [...new Set(ids)]);
  if (error) throw new Error(error.message);
  return Object.fromEntries((data as MediaItem[]).map((m) => [m.id, m]));
}

/** A single record (hero, section, settings…) as form values + its media. */
export async function loadRecord(table: string, keyColumn: string, keyValue: string | number, fields: Field[]) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from(table).select(selectColumns(fields)).eq(keyColumn, keyValue).maybeSingle();
  if (error) throw new Error(`Could not load ${table}: ${error.message}`);
  const values = (data ?? {}) as unknown as Values;
  return { values, media: await mediaByIds(supabase, mediaIdsIn(fields, values)) };
}

/** Several sections at once (a page editor). */
export async function loadSections(keys: string[], fieldsByKey: Record<string, Field[]>) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("sections").select("*").in("section_key", keys);
  if (error) throw new Error(`Could not load sections: ${error.message}`);
  const rows = Object.fromEntries((data ?? []).map((r) => [r.section_key as string, r as Values]));
  const ids = keys.flatMap((k) => (rows[k] ? mediaIdsIn(fieldsByKey[k], rows[k]) : []));
  return { rows, media: await mediaByIds(supabase, ids) };
}

export function newItemDefaults(config: CollectionConfig): Values {
  const values: Values = config.statusField === "status" ? { status: "draft" } : { is_active: true };
  for (const field of config.fields) {
    if (field.type === "date" && field.required) values[field.name] = new Date().toISOString().slice(0, 10);
    if (field.type === "number" && field.name === "read_minutes") values[field.name] = 3;
    if (field.type === "select" && field.name === "rating") values[field.name] = "5";
    if (field.type === "toggle") values[field.name] = false;
    if (field.type === "icon") values.icon = "sparkle";
  }
  return values;
}

/** One collection item as form values (+ gallery ids for services) and its media. */
export async function loadCollectionItem(config: CollectionConfig, id: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from(config.table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load the item: ${error.message}`);
  if (!data) return null;
  const values = data as Values;
  const ids = mediaIdsIn(config.fields, values);

  if (config.fields.some((f) => f.type === "gallery")) {
    const { data: gallery } = await supabase.from("service_images").select("media_id").eq("service_id", id).order("sort_order");
    values.gallery = (gallery ?? []).map((g) => g.media_id as string);
    ids.push(...(values.gallery as string[]));
  }
  if (typeof values.rating === "number") values.rating = String(values.rating);
  return { values, media: await mediaByIds(supabase, ids) };
}

export type ListRow = {
  id: string;
  titleAr: string;
  titleEn: string;
  active: boolean;
  thumb?: MediaItem;
  meta?: string;
};

/** Rows for a collection's list screen, in display order. */
export async function loadCollectionList(config: CollectionConfig): Promise<ListRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from(config.table).select("*").order("sort_order");
  if (error) throw new Error(`Could not load ${config.label}: ${error.message}`);
  const rows = (data ?? []) as Values[];
  const media = config.thumbField ? await mediaByIds(supabase, rows.map((r) => r[config.thumbField!]).filter((v): v is string => typeof v === "string")) : {};
  const en = titleColumnOf(config);
  const ar = en.endsWith("_en") ? `${en.slice(0, -3)}_ar` : en;

  return rows.map((r) => ({
    id: String(r.id),
    titleAr: String(r[ar] ?? ""),
    titleEn: String(r[en] ?? ""),
    active: config.statusField === "status" ? r.status === "published" : r.is_active !== false,
    thumb: config.thumbField && typeof r[config.thumbField] === "string" ? media[r[config.thumbField] as string] : undefined,
    meta:
      config.key === "videos" && r.is_featured
        ? "Featured on Home"
        : config.key === "stats"
          ? `${r.prefix ?? ""}${r.value}${r.suffix ?? ""}`
          : config.key === "articles"
            ? String(r.published_on ?? "")
            : config.key === "timeline"
              ? String(r.period ?? "")
              : config.key === "social" || config.key === "navigation"
                ? String(r.url ?? r.path ?? "")
                : undefined,
  }));
}
