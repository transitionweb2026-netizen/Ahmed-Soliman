import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadCollectionItem, newItemDefaults } from "@/lib/cms/admin-data";
import { getCollection } from "@/lib/cms/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: PageProps<"/admin/[collection]/[id]">): Promise<Metadata> {
  const { collection, id } = await params;
  const config = getCollection(collection);
  return { title: config ? `${id === "new" ? "New" : "Edit"} ${config.singular.toLowerCase()}` : "Not found" };
}

export default async function EditItemPage({ params }: PageProps<"/admin/[collection]/[id]">) {
  const { collection, id } = await params;
  const config = getCollection(collection);
  if (!config) notFound();

  const isNew = id === "new";
  if (!isNew && !UUID.test(id)) notFound();
  const loaded = isNew ? { values: newItemDefaults(config), media: {} } : await loadCollectionItem(config, id);
  if (!loaded) notFound();

  const title = isNew ? `New ${config.singular.toLowerCase()}` : String(loaded.values[`${config.titleField}_en`] || loaded.values[`${config.titleField}_ar`] || loaded.values[config.titleField] || config.singular);

  return (
    <>
      <PageHeader title={title} description={`Appears on: ${config.usedOn}.`} back={{ href: `/admin/${config.key}`, label: config.label }} />
      <RecordForm
        key={id}
        target={{ type: "collection", key: config.key, id: isNew ? null : id }}
        fields={config.fields}
        initialValues={loaded.values}
        initialMedia={loaded.media}
        statusField={config.statusField}
      />
    </>
  );
}
