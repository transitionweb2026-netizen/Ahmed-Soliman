import type { Metadata } from "next";
import { loadRecord } from "@/lib/cms/admin-data";
import { contactFields } from "@/lib/cms/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";

export const metadata: Metadata = { title: "Contact Information" };

export default async function ContactInfoPage() {
  const { values, media } = await loadRecord("contact_info", "id", 1, contactFields);
  return (
    <>
      <PageHeader
        title="Contact Information"
        description="Updates everywhere at once: the hero contact bar, navbar and mobile menu, footer, CTA WhatsApp button, Contact page and booking form."
      />
      <RecordForm target={{ type: "record", record: { kind: "contact" } }} fields={contactFields} initialValues={values} initialMedia={media} />
    </>
  );
}
