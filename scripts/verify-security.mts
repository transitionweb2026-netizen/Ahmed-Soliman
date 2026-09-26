/**
 * Verifies Row Level Security on the live project: creates a temporary
 * signed-in NON-admin user, checks it can't write content, upload files or
 * see admin data, checks anonymous access, then deletes the user.
 *
 *   npm run db:verify-security
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "./lib/env.mts";

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const email = `rls-test-${Date.now()}@example.com`, password = `Test-${crypto.randomUUID()}`;
const { data: created, error: ce } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
if (ce) throw ce;
const results: Array<[string, boolean, string?]> = [];
try {
  const user = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error: se } = await user.auth.signInWithPassword({ email, password });
  if (se) throw se;
  const anon = createClient(url, anonKey, { auth: { persistSession: false } });

  const ins = await user.from("faqs").insert({ question_en: "hack" });
  results.push(["Non-admin cannot insert content", !!ins.error, ins.error?.message]);
  const upd = await user.from("site_settings").update({ site_name_en: "hacked" }).eq("id", 1).select();
  results.push(["Non-admin cannot update settings", !upd.error && (upd.data?.length ?? 0) === 0 || !!upd.error, `${upd.data?.length ?? 0} rows`]);
  const del = await user.from("faqs").delete().not("id", "is", null).select();
  results.push(["Non-admin cannot delete content", (del.data?.length ?? 0) === 0, `${del.data?.length ?? 0} rows`]);
  const admins = await user.from("admins").select("*");
  results.push(["Non-admin cannot list admins", (admins.data?.length ?? 0) === 0]);
  const self = await user.from("admins").insert({ user_id: created.user.id });
  results.push(["Non-admin cannot make itself admin", !!self.error, self.error?.message]);
  const up = await user.storage.from("images").upload(`rls-test/${Date.now()}.png`, new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" }));
  results.push(["Non-admin cannot upload files", !!up.error, up.error?.message]);
  const hidden = await user.from("faqs").select("id").eq("is_active", false);
  const hiddenAnon = await anon.from("articles").select("id").eq("status", "draft");
  results.push(["Hidden/draft rows are invisible to non-admins", (hidden.data?.length ?? 0) === 0 && (hiddenAnon.data?.length ?? 0) === 0]);
  const pub = await anon.from("services").select("id");
  results.push(["Public can read active content", (pub.data?.length ?? 0) > 0, `${pub.data?.length} services`]);
  const med = await anon.storage.from("images").list();
  results.push(["Anonymous cannot list storage buckets", (med.data?.length ?? 0) === 0]);
} finally {
  await admin.auth.admin.deleteUser(created.user.id);
}
for (const [name, ok, detail] of results) console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
console.log("Temporary user deleted.");
if (results.some(([, ok]) => !ok)) process.exit(1);
