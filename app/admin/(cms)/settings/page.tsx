import type { Metadata } from "next";
import { loadRecord } from "@/lib/cms/admin-data";
import { siteSettingsFields } from "@/lib/cms/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SettingsPage() {
  const { values, media } = await loadRecord("site_settings", "id", 1, siteSettingsFields);
  return (
    <>
      <PageHeader title="Site Settings" description="The site name, default SEO, share image and favicon used across the website." />
      <RecordForm target={{ type: "record", record: { kind: "settings" } }} fields={siteSettingsFields} initialValues={values} initialMedia={media} />
    </>
  );
}
