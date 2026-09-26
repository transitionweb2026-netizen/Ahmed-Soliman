import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { isIconName } from "@/components/ui/Icon";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { columnsOf, type Field } from "./schema";

export type AdminContext = Awaited<ReturnType<typeof getAdminContext>>;

/**
 * The signed-in user and whether they are a CMS admin (a row in
 * public.admins). All admin reads and writes use this cookie-bound client, so
 * Row Level Security is the final gatekeeper.
 */
export const getAdminContext = cache(async () => {
  if (!isSupabaseConfigured) return { supabase: null, user: null, isAdmin: false } as const;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false } as const;
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return { supabase, user, isAdmin: Boolean(data) } as const;
});

/** For Server Actions: the admin's Supabase client, or an error to return. */
export async function requireAdmin() {
  const ctx = await getAdminContext();
  if (!ctx.supabase || !ctx.user) throw new Error("Your session has expired. Please sign in again.");
  if (!ctx.isAdmin) throw new Error("This account does not have CMS access.");
  return { supabase: ctx.supabase, user: ctx.user };
}

/** Rebuild every public page that could show CMS content. */
export function revalidateSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

// ── Form values → database row ─────────────────────────────────────────────

export type Values = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const list = (v: unknown) => (Array.isArray(v) ? v.map(text).filter(Boolean) : []);

type Block = { type: "list"; items: string[] } | { type: "p" | "h2" | "quote"; text: string };

function blocks(v: unknown): Block[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((b): Block[] => {
    if (b?.type === "list") {
      const items = list(b.items);
      return items.length ? [{ type: "list", items }] : [];
    }
    if (b?.type === "p" || b?.type === "h2" || b?.type === "quote") {
      const t = text(b.text);
      return t ? [{ type: b.type, text: t }] : [];
    }
    return [];
  });
}

/**
 * Converts submitted form values into a row, accepting only the columns the
 * schema declares for these fields and validating each one.
 */
export function toRow(fields: Field[], values: Values): { row: Values; errors: FieldErrors } {
  const row: Values = {};
  const errors: FieldErrors = {};

  for (const field of fields) {
    const v = (col: string) => values[col];
    switch (field.type) {
      case "text":
      case "textarea": {
        row[field.name] = text(v(field.name));
        if (field.required && !row[field.name]) errors[field.name] = "Required";
        break;
      }
      case "slug": {
        const value = text(v(field.name)).toLowerCase();
        row[field.name] = value;
        if (!value) errors[field.name] = "Required";
        else if (!SLUG.test(value)) errors[field.name] = "Use lowercase letters, numbers and dashes only";
        break;
      }
      case "url": {
        const value = text(v(field.name));
        row[field.name] = value;
        if (field.required && !value) errors[field.name] = "Required";
        else if (value && !/^https?:\/\//i.test(value)) errors[field.name] = "Must start with https://";
        break;
      }
      case "l10n": {
        const ar = text(v(`${field.name}_ar`));
        const en = text(v(`${field.name}_en`));
        row[`${field.name}_ar`] = ar;
        row[`${field.name}_en`] = en;
        if (field.required && !ar && !en) errors[field.name] = "Fill in at least one language";
        break;
      }
      case "l10nList": {
        row[`${field.name}_ar`] = list(v(`${field.name}_ar`));
        row[`${field.name}_en`] = list(v(`${field.name}_en`));
        break;
      }
      case "blocks": {
        row[`${field.name}_ar`] = blocks(v(`${field.name}_ar`));
        row[`${field.name}_en`] = blocks(v(`${field.name}_en`));
        break;
      }
      case "number": {
        const raw = v(field.name);
        const empty = raw === "" || raw == null;
        const n = empty ? null : Number(raw);
        if (n !== null && !Number.isFinite(n)) errors[field.name] = "Enter a number";
        else if (n === null && field.required) errors[field.name] = "Required";
        else if (n !== null && field.min !== undefined && n < field.min) errors[field.name] = `Minimum ${field.min}`;
        else if (n !== null && field.max !== undefined && n > field.max) errors[field.name] = `Maximum ${field.max}`;
        row[field.name] = n;
        break;
      }
      case "toggle":
        row[field.name] = v(field.name) === true;
        break;
      case "date": {
        const value = text(v(field.name));
        if (value && !DATE.test(value)) errors[field.name] = "Invalid date";
        else if (!value && field.required) errors[field.name] = "Required";
        row[field.name] = value || null;
        break;
      }
      case "select": {
        const value = text(v(field.name));
        const option = field.options.find((o) => o.value === value);
        if (!option) {
          if (field.required || value) errors[field.name] = "Choose an option";
          break;
        }
        // Numeric options (e.g. ratings) are stored as numbers.
        row[field.name] = /^\d+$/.test(option.value) ? Number(option.value) : option.value;
        break;
      }
      case "media": {
        const value = v(field.name);
        if (value && (typeof value !== "string" || !UUID.test(value))) errors[field.name] = "Invalid file";
        else if (!value && field.required) errors[field.name] = "Required";
        row[field.name] = value || null;
        break;
      }
      case "icon": {
        const name = v("icon");
        const mediaId = v("icon_media_id");
        row.icon = isIconName(name) ? name : null;
        row.icon_media_id = typeof mediaId === "string" && UUID.test(mediaId) ? mediaId : null;
        break;
      }
      case "gallery":
        break;
    }
  }
  return { row, errors };
}

/** Media ids referenced by a row (for delete safety). */
export function mediaIdsIn(fields: Field[], row: Values): string[] {
  const ids = fields.flatMap((f) => (f.type === "media" ? [row[f.name]] : f.type === "icon" ? [row.icon_media_id] : []));
  return ids.filter((id): id is string => typeof id === "string" && UUID.test(id));
}

/** All columns (used to select only what a form needs). */
export function selectColumns(fields: Field[]): string {
  return fields.flatMap(columnsOf).join(", ");
}
