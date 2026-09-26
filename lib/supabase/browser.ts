import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Browser client (admin only) — used for direct-to-Storage uploads. */
export function getSupabaseBrowserClient() {
  client ??= createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
