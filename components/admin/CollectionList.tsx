"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCollectionItem, getItemMedia, reorderCollection, setCollectionItemStatus } from "@/app/admin/actions";
import type { ListRow } from "@/lib/cms/admin-data";
import { Dialog } from "./Dialog";
import { MediaPreview } from "./MediaPreview";
import { useToast } from "./Toast";

type CollectionListProps = {
  collectionKey: string;
  singular: string;
  statusLabels: { on: string; off: string };
  rows: ListRow[];
};

type PendingDelete = { row: ListRow; files: Array<{ id: string; filename: string; sharedWith: number }> | null };

/** Ordered list with drag & drop / arrow reordering, visibility switch, edit and safe delete. */
export function CollectionList({ collectionKey, singular, statusLabels, rows: initialRows }: CollectionListProps) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(initialRows);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleteFiles, setDeleteFiles] = useState(true);
  const [busy, startTransition] = useTransition();

  function persistOrder(next: ListRow[], previous: ListRow[]) {
    setRows(next);
    startTransition(async () => {
      const result = await reorderCollection(collectionKey, next.map((r) => r.id));
      if (result.ok) toast("success", "Order saved.");
      else {
        setRows(previous);
        toast("error", result.error);
      }
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next, rows);
  }

  function toggle(row: ListRow) {
    const previous = rows;
    setRows(rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    startTransition(async () => {
      const result = await setCollectionItemStatus(collectionKey, row.id, !row.active);
      if (result.ok) toast("success", !row.active ? `Now visible on the website.` : `Hidden from the website.`);
      else {
        setRows(previous);
        toast("error", result.error);
      }
    });
  }

  async function askDelete(row: ListRow) {
    setPendingDelete({ row, files: null });
    const result = await getItemMedia(collectionKey, row.id);
    setPendingDelete({ row, files: result.ok ? (result.data ?? []) : [] });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const { row } = pendingDelete;
    startTransition(async () => {
      const result = await deleteCollectionItem(collectionKey, row.id, deleteFiles);
      if (!result.ok) {
        toast("error", result.error);
        return;
      }
      setRows((list) => list.filter((r) => r.id !== row.id));
      setPendingDelete(null);
      const files = result.data?.deletedFiles ?? 0;
      toast("success", `Deleted${files ? ` (and ${files} unused file${files > 1 ? "s" : ""})` : ""}.`);
      router.refresh();
    });
  }

  if (rows.length === 0) {
    return (
      <div className="adm-card grid place-items-center gap-3 p-10 text-center">
        <p className="text-sm text-[#5c7373]">Nothing here yet.</p>
        <Link href={`/admin/${collectionKey}/new`} className="adm-btn adm-btn-primary">
          + Add {singular.toLowerCase()}
        </Link>
      </div>
    );
  }

  return (
    <>
      <ol className="adm-card divide-y divide-[#edf2f2] overflow-hidden" aria-busy={busy}>
        {rows.map((row, i) => (
          <li
            key={row.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) move(dragIndex, i);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-3 px-3 py-2.5 sm:px-4 ${dragIndex === i ? "bg-brand-soft" : "bg-white"} ${row.active ? "" : "opacity-60"}`}
          >
            <span className="hidden cursor-grab select-none text-[#9fb2b2] sm:block" aria-hidden="true" title="Drag to reorder">
              ⋮⋮
            </span>
            <span className="w-6 text-center text-xs font-semibold tabular-nums text-[#7d9292]">{i + 1}</span>
            {row.thumb ? <MediaPreview media={row.thumb} className="h-12 w-16 shrink-0" /> : null}
            <Link href={`/admin/${collectionKey}/${row.id}`} className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#0f2424] hover:text-brand-dark">{row.titleEn || row.titleAr || "Untitled"}</span>
              <span className="block truncate text-xs text-[#6b8080]" dir="rtl" lang="ar">
                {row.titleAr}
              </span>
              {row.meta && <span className="adm-badge mt-1 bg-[#eef3f3] text-[#3a5454]">{row.meta}</span>}
            </Link>
            <button
              type="button"
              role="switch"
              aria-checked={row.active}
              aria-label={`${row.active ? statusLabels.on : statusLabels.off}: ${row.titleEn || row.titleAr}`}
              onClick={() => toggle(row)}
              className={`hidden shrink-0 sm:inline-flex adm-badge ${row.active ? "bg-emerald-50 text-emerald-700" : "bg-[#f1f3f3] text-[#6b8080]"}`}
            >
              {row.active ? statusLabels.on : statusLabels.off}
            </button>
            <div className="flex shrink-0 items-center">
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0 || busy} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === rows.length - 1 || busy} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move down">
                ↓
              </button>
              <Link href={`/admin/${collectionKey}/${row.id}`} className="adm-btn adm-btn-ghost hidden sm:inline-flex">
                Edit
              </Link>
              <button type="button" onClick={() => askDelete(row)} className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" aria-label={`Delete ${row.titleEn || row.titleAr}`}>
                🗑
              </button>
            </div>
          </li>
        ))}
      </ol>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={`Delete this ${singular.toLowerCase()}?`}
        footer={
          <>
            <button type="button" onClick={() => setPendingDelete(null)} className="adm-btn adm-btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={confirmDelete} disabled={busy || pendingDelete?.files === null} className="adm-btn adm-btn-danger-solid">
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
          </>
        }
      >
        {pendingDelete && (
          <div className="grid gap-3 text-sm">
            <p>
              <strong>{pendingDelete.row.titleEn || pendingDelete.row.titleAr}</strong> will be removed from the website. This can't be undone.
            </p>
            {pendingDelete.files === null ? (
              <p className="text-[#6b8080]">Checking attached files…</p>
            ) : pendingDelete.files.length > 0 ? (
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="font-semibold text-amber-900">Attached files</p>
                <ul className="mt-1.5 grid gap-1 text-amber-900">
                  {pendingDelete.files.map((f) => (
                    <li key={f.id} className="truncate">
                      • {f.filename}
                      {f.sharedWith > 0 && <span className="text-amber-700"> — also used in {f.sharedWith} other place(s), will be kept</span>}
                    </li>
                  ))}
                </ul>
                <label className="mt-3 flex items-center gap-2 text-amber-900">
                  <input type="checkbox" checked={deleteFiles} onChange={(e) => setDeleteFiles(e.target.checked)} />
                  Also delete files that nothing else uses
                </label>
              </div>
            ) : null}
          </div>
        )}
      </Dialog>
    </>
  );
}
