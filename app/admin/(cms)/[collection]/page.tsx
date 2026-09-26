import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCollectionList } from "@/lib/cms/admin-data";
import { getCollection } from "@/lib/cms/schema";
import { CollectionList } from "@/components/admin/CollectionList";
import { PageHeader } from "@/components/admin/PageHeader";

export async function generateMetadata({ params }: PageProps<"/admin/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  return { title: getCollection(collection)?.label ?? "Not found" };
}

export default async function CollectionPage({ params }: PageProps<"/admin/[collection]">) {
  const { collection } = await params;
  const config = getCollection(collection);
  if (!config) notFound();
  const rows = await loadCollectionList(config);
  const statusLabels = config.statusField === "status" ? { on: "Published", off: "Draft" } : { on: "Active", off: "Hidden" };

  return (
    <>
      <PageHeader
        title={config.label}
        description={`${config.description} Drag rows (or use the arrows) to change the display order.`}
        actions={
          <Link href={`/admin/${config.key}/new`} className="adm-btn adm-btn-primary">
            + Add {config.singular.toLowerCase()}
          </Link>
        }
      />
      <p className="mb-3 text-xs text-[#6b8080]">
        Appears on: <strong>{config.usedOn}</strong> · {rows.length} item{rows.length === 1 ? "" : "s"}
      </p>
      <CollectionList collectionKey={config.key} singular={config.singular} statusLabels={statusLabels} rows={rows} />
    </>
  );
}
