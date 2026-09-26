import { existsSync } from "node:fs";
import pg from "pg";

/** Load .env.local (then .env) into process.env for command-line scripts. */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) process.loadEnvFile(file);
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local (see .env.example).`);
    process.exit(1);
  }
  return value;
}

export function projectRef(): string {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const match = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!match) throw new Error(`Cannot read the project ref from NEXT_PUBLIC_SUPABASE_URL (${url}).`);
  return match[1];
}

const POOLER_REGIONS = [
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1", "eu-central-2", "eu-south-1",
  "us-east-1", "us-east-2", "us-west-1", "us-west-2", "ca-central-1", "sa-east-1",
  "ap-south-1", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2", "me-central-1", "il-central-1",
];

/**
 * Connect to the project database. Uses SUPABASE_DB_URL when set; otherwise
 * tries the direct host and then the session pooler in each region with
 * SUPABASE_DB_PASSWORD.
 */
export async function connectDb(): Promise<pg.Client> {
  if (process.env.SUPABASE_DB_URL) {
    const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    return client;
  }

  const password = requireEnv("SUPABASE_DB_PASSWORD");
  const ref = projectRef();
  const candidates = [
    { host: `db.${ref}.supabase.co`, user: "postgres" },
    ...["aws-0", "aws-1"].flatMap((prefix) =>
      POOLER_REGIONS.map((region) => ({ host: `${prefix}-${region}.pooler.supabase.com`, user: `postgres.${ref}` })),
    ),
  ];

  for (const { host, user } of candidates) {
    const client = new pg.Client({
      host,
      port: 5432,
      user,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 6000,
    });
    try {
      await client.connect();
      console.log(`Connected to ${host}`);
      return client;
    } catch {
      await client.end().catch(() => {});
    }
  }
  throw new Error("Could not reach the database. Set SUPABASE_DB_URL to the Session pooler connection string.");
}
