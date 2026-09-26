// NEXT_PUBLIC_* must be referenced literally so Next.js can inline them in the browser bundle.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until the project's Supabase URL and public key are provided. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
