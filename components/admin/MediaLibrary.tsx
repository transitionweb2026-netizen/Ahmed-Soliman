"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition, type DragEvent } from "react";
import {
  deleteMedia,
  getAllMediaUsage,
  getMediaUsage,
  listMedia,
  updateMediaAlt,
  type MediaItem,
  type MediaUsage,
} from "@/app/admin/actions";
import type { MediaKind } from "@/lib/cms/schema";
import { formatBytes, uploadMedia } from "@/lib/cms/upload";
import { Dialog } from "./Dialog";
import { MediaPreview } from "./MediaPreview";
import { useToast } from "./Toast";

const filters: Array<{ value: string; label: string }> = [
  { value: "", label: "All files" },
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "icons", label: "Icons" },
  { value: "certificates", label: "Certificates & PDFs" },
];

const uploadKinds: Array<{ kind: MediaKind; label: string }> = [
  { kind: "image", label: "Images" },
  { kind: "video", label: "Videos" },
  { kind: "icon", label: "Icons" },
  { kind: "certificate", label: "Certificates / PDFs" },
];

type Upload = { name: string; progress: number; error?: string };

export function MediaLibrary() {
  const toast = useToast();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [bucket, setBucket] = useState("");
  const [search, setSearch] = useState("");
  const [uploadKind, setUploadKind] = useState<MediaKind>("image");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const [list, counts] = await Promise.all([listMedia({ bucket: bucket || undefined, search, limit: 500 }), getAllMediaUsage()]);
    if (list.ok) setItems(list.data ?? []);
    else toast("error", list.error);
    if (counts.ok) setUsage(counts.data ?? {});
  }, [bucket, search, toast]);

  useEffect(() => {
    const t = setTimeout(refresh, 200);
    return () => clearTimeout(t);
  }, [refresh]);

  async function uploadFiles(files: FileList | File[]) {
    const list = [...files];
    // The bucket follows the file type; library uploads go to <bucket>/library/….
    const folder = "library";
    setUploads(list.map((f) => ({ name: f.name, progress: 0 })));
    let done = 0;
    await Promise.all(
      list.map(async (file, i) => {
        try {
          await uploadMedia(file, uploadKind, folder, (p) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, progress: p } : x)))).promise;
          done++;
        } catch (e) {
          setUploads((u) => u.map((x, j) => (j === i ? { ...x, error: e instanceof Error ? e.message : "Upload failed" } : x)));
        }
      }),
    );
    if (done) toast("success", `${done} file${done > 1 ? "s" : ""} uploaded.`);
    setUploads((u) => u.filter((x) => x.error));
    void refresh();
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="grid gap-5">
      {/* Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`adm-card flex flex-col items-center gap-3 border-2 border-dashed p-6 text-center ${dragging ? "border-brand bg-brand-soft" : "border-transparent"}`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-[#3a5454]">Upload</span>
          <select value={uploadKind} onChange={(e) => setUploadKind(e.target.value as MediaKind)} className="adm-input w-auto py-1.5" aria-label="File type to upload">
            {uploadKinds.map((k) => (
              <option key={k.kind} value={k.kind}>
                {k.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => inputRef.current?.click()} className="adm-btn adm-btn-primary">
            Browse files
          </button>
          <span className="text-[#6b8080]">or drag & drop them here</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploads.length > 0 && (
          <ul className="grid w-full max-w-lg gap-2 text-start text-sm">
            {uploads.map((u, i) => (
              <li key={i}>
                <div className="flex justify-between gap-3">
                  <span className="truncate">{u.name}</span>
                  <span className={u.error ? "text-red-700" : "tabular-nums"}>{u.error ? "Failed" : `${u.progress}%`}</span>
                </div>
                {u.error ? (
                  <p className="text-xs text-red-700">{u.error}</p>
                ) : (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e6eeee]">
                    <div className="h-full bg-brand transition-[width]" style={{ width: `${u.progress}%` }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button key={f.value} type="button" onClick={() => setBucket(f.value)} className={`adm-btn ${bucket === f.value ? "adm-btn-primary" : "adm-btn-secondary"}`}>
            {f.label}
          </button>
        ))}
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by file name…" className="adm-input ms-auto max-w-xs" aria-label="Search files" />
      </div>

      {/* Grid */}
      {!items ? (
        <p className="py-10 text-center text-sm text-[#6b8080]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#6b8080]">No files found.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => setSelected(item)} className="adm-card group block w-full p-2 text-start transition hover:ring-2 hover:ring-brand/50">
                <MediaPreview media={item} className="aspect-[4/3] h-auto w-full" />
                <span className="mt-2 block truncate text-xs font-semibold">{item.filename}</span>
                <span className="flex items-center justify-between text-[0.7rem] text-[#6b8080]">
                  <span>{formatBytes(item.size_bytes)}</span>
                  {usage[item.id] ? (
                    <span className="adm-badge bg-emerald-50 text-emerald-700">Used ×{usage[item.id]}</span>
                  ) : (
                    <span className="adm-badge bg-[#f1f3f3] text-[#6b8080]">Unused</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <MediaDetails
          item={selected}
          onClose={() => setSelected(null)}
          onChanged={() => {
            setSelected(null);
            void refresh();
          }}
        />
      )}
    </div>
  );
}

function MediaDetails({ item, onClose, onChanged }: { item: MediaItem; onClose: () => void; onChanged: () => void }) {
  const toast = useToast();
  const [usages, setUsages] = useState<MediaUsage[] | null>(null);
  const [alt, setAlt] = useState({ ar: item.alt_ar, en: item.alt_en });
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getMediaUsage(item.id).then((r) => setUsages(r.ok ? (r.data ?? []) : []));
  }, [item.id]);

  function saveAlt() {
    startTransition(async () => {
      const r = await updateMediaAlt(item.id, alt);
      toast(r.ok ? "success" : "error", r.ok ? "Description saved." : r.error);
    });
  }

  function remove(detach: boolean) {
    startTransition(async () => {
      const r = await deleteMedia(item.id, detach);
      if (!r.ok) return toast("error", r.error);
      if (!r.data?.deleted) {
        setUsages(r.data?.usages ?? []);
        setConfirming(true);
        return;
      }
      toast("success", "File deleted.");
      onChanged();
    });
  }

  const inUse = (usages?.length ?? 0) > 0;

  return (
    <Dialog
      open
      onClose={onClose}
      title={item.filename}
      size="lg"
      footer={
        confirming && inUse ? (
          <>
            <button type="button" onClick={() => setConfirming(false)} className="adm-btn adm-btn-secondary">
              Keep file
            </button>
            <button type="button" onClick={() => remove(true)} disabled={pending} className="adm-btn adm-btn-danger-solid">
              Remove from {usages!.length} place{usages!.length > 1 ? "s" : ""} and delete
            </button>
          </>
        ) : (
          <button type="button" onClick={() => (inUse ? setConfirming(true) : remove(false))} disabled={pending || usages === null} className="adm-btn adm-btn-danger">
            Delete file
          </button>
        )
      }
    >
      <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
        <div>
          {item.mime_type.startsWith("video/") ? (
            <video src={item.public_url} controls className="w-full rounded-lg bg-black" />
          ) : (
            <MediaPreview media={item} className="aspect-[4/3] h-auto w-full object-contain" />
          )}
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
            <dt className="text-[#6b8080]">Type</dt>
            <dd>{item.mime_type}</dd>
            <dt className="text-[#6b8080]">Size</dt>
            <dd>{formatBytes(item.size_bytes)}</dd>
            {item.width && item.height ? (
              <>
                <dt className="text-[#6b8080]">Dimensions</dt>
                <dd>
                  {item.width} × {item.height}
                </dd>
              </>
            ) : null}
            {item.duration_seconds ? (
              <>
                <dt className="text-[#6b8080]">Duration</dt>
                <dd>{Math.round(item.duration_seconds)} s</dd>
              </>
            ) : null}
            <dt className="text-[#6b8080]">Uploaded</dt>
            <dd>{new Date(item.created_at).toLocaleString()}</dd>
            <dt className="text-[#6b8080]">Storage path</dt>
            <dd className="break-all font-mono">
              {item.bucket}/{item.path}
            </dd>
          </dl>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(item.public_url).then(() => toast("success", "Link copied."))}
            className="adm-btn adm-btn-secondary mt-3"
          >
            Copy public link
          </button>
        </div>

        <div className="grid content-start gap-5">
          {(item.mime_type.startsWith("image/") || item.bucket === "certificates") && (
            <div className="grid gap-2">
              <p className="adm-label">Description (alt text for accessibility & SEO)</p>
              <input value={alt.ar} dir="rtl" lang="ar" onChange={(e) => setAlt({ ...alt, ar: e.target.value })} placeholder="الوصف بالعربية" className="adm-input" aria-label="Arabic description" />
              <input value={alt.en} onChange={(e) => setAlt({ ...alt, en: e.target.value })} placeholder="English description" className="adm-input" aria-label="English description" />
              <button type="button" onClick={saveAlt} disabled={pending} className="adm-btn adm-btn-primary justify-self-start">
                Save description
              </button>
            </div>
          )}

          <div>
            <p className="adm-label mb-2">Used by</p>
            {usages === null ? (
              <p className="text-sm text-[#6b8080]">Checking…</p>
            ) : usages.length === 0 ? (
              <p className="text-sm text-[#6b8080]">Not used anywhere — safe to delete.</p>
            ) : (
              <ul className="grid gap-1.5 text-sm">
                {usages.map((u, i) => (
                  <li key={i}>
                    <Link href={u.href} className="font-medium text-brand-dark hover:underline">
                      {u.area}: {u.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {confirming && inUse && (
              <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                This file is still in use. Deleting it will remove it from the places above (they'll show no image until you choose a new one).
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
