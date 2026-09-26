/** Prints a quick health check of the CMS schema: tables, RLS, policies, buckets. */
import { connectDb, loadEnv } from "./lib/env.mts";

loadEnv();
const db = await connectDb();
try {
  const tables = await db.query(`select c.relname as table, c.relrowsecurity as rls,
      (select count(*) from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) as policies
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' order by 1`);
  console.table(tables.rows);
  const buckets = await db.query("select id, public, file_size_limit, array_length(allowed_mime_types, 1) as mime_types from storage.buckets order by id");
  console.table(buckets.rows);
  const storagePolicies = await db.query("select policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' order by 1");
  console.table(storagePolicies.rows);
} finally {
  await db.end();
}
