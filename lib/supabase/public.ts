import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Anonymous client for the public website. It carries no cookies, so pages
 * stay statically rendered, and RLS only lets it read active/published rows.
 */
export const publicSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;
