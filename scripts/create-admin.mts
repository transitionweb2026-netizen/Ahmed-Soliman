/**
 * Creates (or promotes) a CMS admin.
 *
 *   npm run admin:create -- <email> <password>
 *
 * Creates the Supabase Auth user with a confirmed email if it does not exist,
 * then adds it to public.admins. Running it again for an existing user only
 * ensures the admin row (and resets the password if one is given).
 * Uses the service-role key, so it must only ever run on a trusted machine.
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./lib/env.mts";

loadEnv();
const [email, password] = process.argv.slice(2);
if (!email) {
  console.error("Usage: npm run admin:create -- <email> [password]");
  process.exit(1);
}

const supabase = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUser(address: string) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === address.toLowerCase());
    if (match || data.users.length < 200) return match;
  }
}

let user = await findUser(email);
if (user) {
  console.log(`User exists: ${user.email}`);
  if (password) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
    if (error) throw error;
    console.log("Password updated.");
  }
} else {
  if (!password || password.length < 8) {
    console.error("A password of at least 8 characters is required to create a new user.");
    process.exit(1);
  }
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  user = data.user;
  console.log(`Created user: ${user.email}`);
}

const { error } = await supabase.from("admins").upsert({ user_id: user.id }, { onConflict: "user_id" });
if (error) throw error;
console.log(`${user.email} is now a CMS admin. Sign in at /admin/login.`);
