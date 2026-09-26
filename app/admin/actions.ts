"use server";

import { redirect } from "next/navigation";
import { mediaIdsIn, requireAdmin, revalidateSite, toRow, type FieldErrors, type Values } from "@/lib/cms/admin";
import {
  contactFields,
  getCollection,
  getPageEditor,
  heroFields,
  mediaKinds,
  mediaReferences,
  seoFields,
  siteSettingsFields,
  collections,
  type Field,
  type MediaKind,
} from "@/lib/cms/schema";
import { pageKeys, type PageKey } from "@/lib/cms/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string; fieldErrors?: FieldErrors };

async function run<T>(work: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    if (error instanceof FieldError) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: error.fields };
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

class FieldError extends Error {
  constructor(public fields: FieldErrors) {
    super("Validation failed");
  }
}

function friendly(message: string): string {
  if (/duplicate key.*slug/i.test(message)) return "That slug / anchor is already used by another item.";
  if (/duplicate key.*nav_key/i.test(message)) return "That key is already used by another menu item.";
  if (/violates foreign key constraint.*media/i.test(message)) return "This file is still used somewhere, so it can't be removed.";
  if (/row-level security/i.test(message)) return "You don't have permission to do that.";
  return message;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function signIn(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase is not configured. Add the keys to .env.local." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account does not have CMS access." };
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Collections ────────────────────────────────────────────────────────────

function collectionOrThrow(key: string) {
  const config = getCollection(key);
  if (!config) throw new Error(`Unknown collection: ${key}`);
  return config;
}

export async function saveCollectionItem(key: string, id: string | null, values: Values): Promise<ActionResult<{ id: string }>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = collectionOrThrow(key);
    const { row, errors } = toRow(config.fields, values);
    if (Object.keys(errors).length) throw new FieldError(errors);

    if (config.statusField === "status") {
      row.status = values.status === "published" ? "published" : "draft";
    } else if (typeof values.is_active === "boolean") {
      row.is_active = values.is_active;
    }

    let savedId = id;
    if (id) {
      const { error } = await supabase.from(config.table).update(row).eq("id", id);
      if (error) throw new Error(friendly(error.message));
    } else {
      // New items go to the end of the list.
      const { data: last } = await supabase.from(config.table).select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      row.sort_order = ((last?.sort_order as number | undefined) ?? -1) + 1;
      const { data, error } = await supabase.from(config.table).insert(row).select("id").single();
      if (error) throw new Error(friendly(error.message));
      savedId = data.id as string;
    }

    // Service gallery (extra images) lives in its own table.
    const gallery = config.fields.find((f) => f.type === "gallery");
    if (gallery && Array.isArray(values.gallery) && savedId) {
      const mediaIds = (values.gallery as unknown[]).filter((m): m is string => typeof m === "string");
      const { error: delError } = await supabase.from("service_images").delete().eq("service_id", savedId);
      if (delError) throw new Error(friendly(delError.message));
      if (mediaIds.length) {
        const { error: insError } = await supabase
          .from("service_images")
          .insert(mediaIds.map((media_id, sort_order) => ({ service_id: savedId, media_id, sort_order })));
        if (insError) throw new Error(friendly(insError.message));
      }
    }

    revalidateSite();
    return { id: savedId as string };
  });
}

export async function setCollectionItemStatus(key: string, id: string, active: boolean): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = collectionOrThrow(key);
    const patch = config.statusField === "status" ? { status: active ? "published" : "draft" } : { is_active: active };
    const { error } = await supabase.from(config.table).update(patch).eq("id", id);
    if (error) throw new Error(friendly(error.message));
    revalidateSite();
  });
}

export async function reorderCollection(key: string, orderedIds: string[]): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = collectionOrThrow(key);
    const results = await Promise.all(orderedIds.map((id, index) => supabase.from(config.table).update({ sort_order: index }).eq("id", id)));
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(friendly(failed.error.message));
    revalidateSite();
  });
}

export async function deleteCollectionItem(key: string, id: string, deleteUnusedMedia: boolean): Promise<ActionResult<{ deletedFiles: number }>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = collectionOrThrow(key);
    const { data: item, error: readError } = await supabase.from(config.table).select("*").eq("id", id).single();
    if (readError) throw new Error(friendly(readError.message));

    const candidates = new Set(mediaIdsIn(config.fields, item));
    if (config.table === "services") {
      const { data: gallery } = await supabase.from("service_images").select("media_id").eq("service_id", id);
      for (const g of gallery ?? []) candidates.add(g.media_id as string);
    }

    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) throw new Error(friendly(error.message));

    let deletedFiles = 0;
    if (deleteUnusedMedia) {
      for (const mediaId of candidates) {
        if ((await findUsages(supabase, mediaId)).length === 0) {
          await removeMediaFile(supabase, mediaId);
          deletedFiles++;
        }
      }
    }
    revalidateSite();
    return { deletedFiles };
  });
}

/** Files attached to an item (shown in the delete confirmation). */
export async function getItemMedia(key: string, id: string): Promise<ActionResult<Array<{ id: string; filename: string; sharedWith: number }>>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = collectionOrThrow(key);
    const { data: item } = await supabase.from(config.table).select("*").eq("id", id).single();
    if (!item) return [];
    const ids = new Set(mediaIdsIn(config.fields, item));
    if (config.table === "services") {
      const { data: gallery } = await supabase.from("service_images").select("media_id").eq("service_id", id);
      for (const g of gallery ?? []) ids.add(g.media_id as string);
    }
    if (!ids.size) return [];
    const { data: files } = await supabase.from("media").select("id, filename").in("id", [...ids]);
    return Promise.all(
      (files ?? []).map(async (f) => ({
        id: f.id as string,
        filename: f.filename as string,
        // Other places using the same file besides this item.
        sharedWith: (await findUsages(supabase, f.id as string)).filter((u) => !(u.table === config.table && u.key === id) && !(u.table === "service_images" && u.key === id)).length,
      })),
    );
  });
}

// ── Single records: heroes, sections, settings, contact, SEO ───────────────

export type RecordTarget =
  | { kind: "hero"; page: PageKey }
  | { kind: "section"; key: string }
  | { kind: "settings" }
  | { kind: "contact" }
  | { kind: "seo"; page: PageKey };

function recordConfig(target: RecordTarget): { table: string; keyColumn: string; keyValue: string | number; fields: Field[]; extra?: Values } {
  switch (target.kind) {
    case "hero":
      if (!pageKeys.includes(target.page)) throw new Error("Unknown page");
      return { table: "heroes", keyColumn: "page_key", keyValue: target.page, fields: heroFields(target.page) };
    case "seo":
      if (!pageKeys.includes(target.page)) throw new Error("Unknown page");
      return { table: "seo_pages", keyColumn: "page_key", keyValue: target.page, fields: seoFields(target.page) };
    case "settings":
      return { table: "site_settings", keyColumn: "id", keyValue: 1, fields: siteSettingsFields };
    case "contact":
      return { table: "contact_info", keyColumn: "id", keyValue: 1, fields: contactFields };
    case "section": {
      const page = getPageEditor(target.key.split(".")[0]);
      const section = page?.sections.find((s) => s.key === target.key);
      if (!section) throw new Error("Unknown section");
      return { table: "sections", keyColumn: "section_key", keyValue: target.key, fields: section.fields, extra: { page_key: target.key.split(".")[0] } };
    }
  }
}

export async function saveRecord(target: RecordTarget, values: Values): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const config = recordConfig(target);
    const { row, errors } = toRow(config.fields, values);
    if (Object.keys(errors).length) throw new FieldError(errors);
    if (target.kind === "contact" && typeof row.whatsapp_number === "string") {
      row.whatsapp_number = row.whatsapp_number.replace(/\D/g, "");
    }
    const { error } = await supabase
      .from(config.table)
      .upsert({ ...config.extra, ...row, [config.keyColumn]: config.keyValue }, { onConflict: config.keyColumn });
    if (error) throw new Error(friendly(error.message));
    revalidateSite();
  });
}

// ── Media library ──────────────────────────────────────────────────────────

export type MediaItem = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  alt_ar: string;
  alt_en: string;
  category: string;
  created_at: string;
};

const MEDIA_COLUMNS = "id, bucket, path, public_url, filename, mime_type, size_bytes, width, height, duration_seconds, alt_ar, alt_en, category, created_at";

export async function registerMedia(input: {
  kind: MediaKind;
  path: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  category: string;
}): Promise<ActionResult<MediaItem>> {
  return run(async () => {
    const { supabase, user } = await requireAdmin();
    const rules = mediaKinds[input.kind];
    if (!rules) throw new Error("Unknown file type");
    if (!rules.mime.includes(input.mimeType)) throw new Error("This file type is not allowed here.");
    if (input.size > rules.maxBytes) throw new Error("This file is too large.");
    if (!/^[a-z0-9/_.-]+$/i.test(input.path) || input.path.includes("..")) throw new Error("Invalid file path.");

    const publicUrl = supabase.storage.from(rules.bucket).getPublicUrl(input.path).data.publicUrl;
    const { data, error } = await supabase
      .from("media")
      .insert({
        bucket: rules.bucket,
        path: input.path,
        public_url: publicUrl,
        filename: input.filename.slice(0, 200),
        mime_type: input.mimeType,
        size_bytes: input.size,
        width: input.width ?? null,
        height: input.height ?? null,
        duration_seconds: input.duration ?? null,
        category: input.category.split("/")[0] || "general",
        uploaded_by: user.id,
      })
      .select(MEDIA_COLUMNS)
      .single();
    if (error) throw new Error(friendly(error.message));
    return data as MediaItem;
  });
}

export async function listMedia(options: { kind?: MediaKind | "all"; bucket?: string; search?: string; limit?: number }): Promise<ActionResult<MediaItem[]>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    let query = supabase.from("media").select(MEDIA_COLUMNS).order("created_at", { ascending: false }).limit(options.limit ?? 200);
    if (options.kind && options.kind !== "all") {
      const rules = mediaKinds[options.kind];
      query = query.eq("bucket", rules.bucket).in("mime_type", rules.mime);
    }
    if (options.bucket) query = query.eq("bucket", options.bucket);
    if (options.search) query = query.ilike("filename", `%${options.search.replace(/[%_]/g, "")}%`);
    const { data, error } = await query;
    if (error) throw new Error(friendly(error.message));
    return (data ?? []) as MediaItem[];
  });
}

export async function updateMediaAlt(id: string, alt: { ar: string; en: string }): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("media").update({ alt_ar: alt.ar.trim(), alt_en: alt.en.trim() }).eq("id", id);
    if (error) throw new Error(friendly(error.message));
    revalidateSite();
  });
}

export type MediaUsage = { table: string; column: string; key: string; area: string; title: string; href: string };

type Client = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function findUsages(supabase: Client, mediaId: string): Promise<MediaUsage[]> {
  const results = await Promise.all(
    mediaReferences.map(async (ref) => {
      const columns = [ref.keyColumn, ref.titleColumn].filter(Boolean).join(", ");
      const { data } = await supabase.from(ref.table).select(columns).eq(ref.column, mediaId);
      return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((row) => {
        const key = String(row[ref.keyColumn]);
        return {
          table: ref.table,
          column: ref.column,
          key,
          area: ref.area,
          title: (ref.titleColumn && String(row[ref.titleColumn] ?? "")) || key,
          href: ref.href(key),
        };
      });
    }),
  );
  return results.flat();
}

export async function getMediaUsage(id: string): Promise<ActionResult<MediaUsage[]>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    return findUsages(supabase, id);
  });
}

/** Where every file is used, in one pass (for the media library grid). */
export async function getAllMediaUsage(): Promise<ActionResult<Record<string, number>>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const counts: Record<string, number> = {};
    await Promise.all(
      mediaReferences.map(async (ref) => {
        const { data } = await supabase.from(ref.table).select(ref.column).not(ref.column, "is", null);
        for (const row of (data ?? []) as unknown as Array<Record<string, string>>) {
          counts[row[ref.column]] = (counts[row[ref.column]] ?? 0) + 1;
        }
      }),
    );
    return counts;
  });
}

async function removeMediaFile(supabase: Client, id: string) {
  const { data: file, error } = await supabase.from("media").select("bucket, path").eq("id", id).single();
  if (error) throw new Error(friendly(error.message));
  const { error: rowError } = await supabase.from("media").delete().eq("id", id);
  if (rowError) throw new Error(friendly(rowError.message));
  const { error: storageError } = await supabase.storage.from(file.bucket as string).remove([file.path as string]);
  if (storageError) throw new Error(`The file record was removed, but Storage reported: ${storageError.message}`);
}

/**
 * Delete a file. If it is still used, nothing happens unless `detach` is true,
 * in which case every reference is cleared first (the content keeps working,
 * just without that file).
 */
export async function deleteMedia(id: string, detach: boolean): Promise<ActionResult<{ usages: MediaUsage[]; deleted: boolean }>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const usages = await findUsages(supabase, id);
    if (usages.length && !detach) return { usages, deleted: false };

    for (const usage of usages) {
      const { error } =
        usage.table === "service_images"
          ? await supabase.from("service_images").delete().eq("media_id", id)
          : await supabase.from(usage.table).update({ [usage.column]: null }).eq(usage.column, id);
      if (error) throw new Error(friendly(error.message));
    }
    await removeMediaFile(supabase, id);
    revalidateSite();
    return { usages, deleted: true };
  });
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function getCounts(): Promise<ActionResult<Record<string, number>>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const tables = [...collections.map((c) => c.table), "media"];
    const entries = await Promise.all(
      tables.map(async (table) => {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
        return [table, count ?? 0] as const;
      }),
    );
    return Object.fromEntries(entries);
  });
}
