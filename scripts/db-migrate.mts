/**
 * Applies supabase/migrations/*.sql that have not run yet, in order, each in
 * its own transaction. History is kept in supabase_migrations.schema_migrations
 * (the same table the Supabase CLI uses, so `supabase db push` stays in sync).
 *
 *   npm run db:migrate
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb, loadEnv } from "./lib/env.mts";

loadEnv();
const dir = join(process.cwd(), "supabase", "migrations");
const client = await connectDb();

try {
  await client.query(`
    create schema if not exists supabase_migrations;
    create table if not exists supabase_migrations.schema_migrations (
      version text primary key,
      statements text[],
      name text
    );
  `);
  const applied = new Set(
    (await client.query<{ version: string }>("select version from supabase_migrations.schema_migrations")).rows.map((r) => r.version),
  );

  const files = readdirSync(dir).filter((f) => /^\d+_.+\.sql$/.test(f)).sort();
  let ran = 0;
  for (const file of files) {
    const [version, ...rest] = file.replace(/\.sql$/, "").split("_");
    if (applied.has(version)) continue;
    const sql = readFileSync(join(dir, file), "utf8");
    process.stdout.write(`Applying ${file} … `);
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into supabase_migrations.schema_migrations (version, statements, name) values ($1, $2, $3)", [
        version,
        [sql],
        rest.join("_"),
      ]);
      await client.query("commit");
      console.log("done");
      ran++;
    } catch (error) {
      await client.query("rollback");
      console.log("FAILED");
      throw error;
    }
  }
  console.log(ran ? `Applied ${ran} migration(s).` : "Database is up to date.");
} finally {
  await client.end();
}
