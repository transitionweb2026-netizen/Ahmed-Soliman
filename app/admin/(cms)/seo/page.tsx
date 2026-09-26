import type { Metadata } from "next";
import Link from "next/link";
import { loadRecord } from "@/lib/cms/admin-data";
import { seoFields } from "@/lib/cms/schema";
import { pageKeys } from "@/lib/cms/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";

export const metadata: Metadata = { title: "SEO" };

const pageLabels: Record<(typeof pageKeys)[number], string> = {
  home: "Home",
  about: "About",
  services: "Services",
  videos: "Videos",
  articles: "Articles",
  contact: "Contact Us",
};

export default async function SeoPage() {
  const records = await Promise.all(pageKeys.map((page) => loadRecord("seo_pages", "page_key", page, seoFields(page))));

  return (
    <>
      <PageHeader
        title="SEO"
        description="Search and social-sharing text for each page, in both languages. Empty fields fall back to the defaults in Site Settings."
        actions={
          <Link href="/admin/settings" className="adm-btn adm-btn-secondary">
            Global defaults & favicon →
          </Link>
        }
      />
      <div className="grid gap-4">
        {pageKeys.map((page, i) => (
          <details key={page} open={i === 0} className="adm-card group overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-semibold">{pageLabels[page]}</span>
              <span aria-hidden="true" className="text-[#7d9292] transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="border-t border-[#edf2f2] px-5 pb-2 pt-5">
              <RecordForm bare target={{ type: "record", record: { kind: "seo", page } }} fields={seoFields(page)} initialValues={records[i].values} initialMedia={records[i].media} />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
