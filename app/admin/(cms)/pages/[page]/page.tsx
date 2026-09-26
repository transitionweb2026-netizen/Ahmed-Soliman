import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadRecord, loadSections } from "@/lib/cms/admin-data";
import { getPageEditor, heroFields } from "@/lib/cms/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";

export async function generateMetadata({ params }: PageProps<"/admin/pages/[page]">): Promise<Metadata> {
  const { page } = await params;
  return { title: getPageEditor(page)?.label ?? "Not found" };
}

function Panel({ id, title, open, children }: { id: string; title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={open} className="adm-card group scroll-mt-20 overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-[#0f2424]">{title}</span>
        <span aria-hidden="true" className="text-[#7d9292] transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="border-t border-[#edf2f2] px-5 pb-2 pt-5">{children}</div>
    </details>
  );
}

export default async function PageEditorPage({ params }: PageProps<"/admin/pages/[page]">) {
  const { page } = await params;
  const editor = getPageEditor(page);
  if (!editor) notFound();

  const hero = editor.hero ? await loadRecord("heroes", "page_key", editor.hero, heroFields(editor.hero)) : null;
  const fieldsByKey = Object.fromEntries(editor.sections.map((s) => [s.key, s.fields]));
  const sections = editor.sections.length ? await loadSections(editor.sections.map((s) => s.key), fieldsByKey) : { rows: {}, media: {} };

  return (
    <>
      <PageHeader title={editor.label} description={editor.description} />
      <div className="grid gap-4">
        {editor.hero && hero && (
          <Panel id="hero" title="Hero" open>
            <RecordForm
              bare
              target={{ type: "record", record: { kind: "hero", page: editor.hero } }}
              fields={heroFields(editor.hero)}
              initialValues={{ is_visible: true, show_contact_panel: true, ...hero.values }}
              initialMedia={hero.media}
            />
          </Panel>
        )}
        {editor.sections.map((section) => (
          <Panel key={section.key} id={section.key} title={section.label} open={!editor.hero && editor.sections.length === 1}>
            {section.description && <p className="adm-help -mt-1 mb-4">{section.description}</p>}
            <RecordForm
              bare
              target={{ type: "record", record: { kind: "section", key: section.key } }}
              fields={section.fields}
              initialValues={sections.rows[section.key] ?? {}}
              initialMedia={sections.media}
            />
          </Panel>
        ))}
      </div>
    </>
  );
}
