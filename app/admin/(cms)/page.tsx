import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin";
import { collections } from "@/lib/cms/schema";
import { formatBytes } from "@/lib/cms/format";
import type { MediaItem } from "../actions";
import { MediaPreview } from "@/components/admin/MediaPreview";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Dashboard" };

const highlighted = ["services", "treatments", "videos", "articles", "reviews", "certificates", "technologies", "specialties", "faqs"];

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();

  const counts = await Promise.all(
    highlighted.map(async (key) => {
      const config = collections.find((c) => c.key === key)!;
      const [{ count: total }, { count: visible }] = await Promise.all([
        supabase.from(config.table).select("*", { count: "exact", head: true }),
        config.statusField === "status"
          ? supabase.from(config.table).select("*", { count: "exact", head: true }).eq("status", "published")
          : supabase.from(config.table).select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return { config, total: total ?? 0, visible: visible ?? 0 };
    }),
  );
  const [{ data: files }, { data: recent }] = await Promise.all([
    supabase.from("media").select("size_bytes, bucket"),
    supabase
      .from("media")
      .select("id, bucket, path, public_url, filename, mime_type, size_bytes, width, height, duration_seconds, alt_ar, alt_en, category, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  const totalBytes = (files ?? []).reduce((sum, f) => sum + Number(f.size_bytes), 0);

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of the website's content. Everything saved here goes live on the website immediately." />

      <section aria-label="Content counts" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map(({ config, total, visible }) => (
          <Link key={config.key} href={`/admin/${config.key}`} className="adm-card p-4 transition hover:ring-2 hover:ring-brand/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8080]">{config.label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#0f2424]">{total}</p>
            <p className="text-xs text-[#6b8080]">
              {visible} {config.statusField === "status" ? "published" : "visible"}
            </p>
          </Link>
        ))}
        <Link href="/admin/media" className="adm-card bg-linear-to-br from-brand-soft to-white p-4 transition hover:ring-2 hover:ring-brand/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8080]">Media files</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-[#0f2424]">{files?.length ?? 0}</p>
          <p className="text-xs text-[#6b8080]">{formatBytes(totalBytes)} in Storage</p>
        </Link>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="adm-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Recent uploads</h2>
            <Link href="/admin/media" className="text-sm font-semibold text-brand-dark hover:underline">
              Media Library →
            </Link>
          </div>
          {recent && recent.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(recent as MediaItem[]).map((m) => (
                <li key={m.id}>
                  <MediaPreview media={m} className="aspect-[4/3] h-auto w-full" />
                  <p className="mt-1 truncate text-xs font-medium">{m.filename}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6b8080]">No uploads yet.</p>
          )}
        </section>

        <section className="adm-card p-5">
          <h2 className="mb-3 font-bold">Quick edits</h2>
          <ul className="grid gap-1 text-sm">
            {[
              ["/admin/pages/home", "Home hero & sections"],
              ["/admin/stats", "Statistics"],
              ["/admin/videos/new", "Upload a new video"],
              ["/admin/articles/new", "Write a new article"],
              ["/admin/contact-info", "Phone, WhatsApp & address"],
              ["/admin/social", "Social media links"],
              ["/admin/pages/global", "Global CTA card"],
              ["/admin/seo", "SEO"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="flex items-center justify-between rounded-lg px-3 py-2 font-medium text-[#274141] hover:bg-[#eef3f3]">
                  {label} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
