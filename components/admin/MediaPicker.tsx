"use client";

import { useEffect, useState } from "react";
import { listMedia, type MediaItem } from "@/app/admin/actions";
import type { MediaKind } from "@/lib/cms/schema";
import { formatBytes } from "@/lib/cms/upload";
import { Dialog } from "./Dialog";
import { MediaPreview } from "./MediaPreview";

type MediaPickerProps = {
  open: boolean;
  kind: MediaKind;
  onClose: () => void;
  onPick: (media: MediaItem) => void;
};

/** Choose an existing file from the Media Library (filtered to what the slot accepts). */
export function MediaPicker({ open, kind, onClose, onPick }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await listMedia({ kind, search, limit: 120 });
      if (cancelled) return;
      if (result.ok) {
        setItems(result.data ?? []);
        setError(null);
      } else setError(result.error);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, kind, search]);

  return (
    <Dialog open={open} onClose={onClose} title="Choose from the Media Library" size="lg">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by file name…"
        className="adm-input mb-4"
        aria-label="Search files"
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!items && !error && <p className="py-8 text-center text-sm text-[#6b8080]">Loading…</p>}
      {items && items.length === 0 && <p className="py-8 text-center text-sm text-[#6b8080]">No matching files yet — upload one instead.</p>}
      {items && items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(item);
                  onClose();
                }}
                className="group w-full rounded-xl p-1.5 text-start ring-1 ring-[#e3ebea] transition hover:ring-2 hover:ring-brand"
              >
                <MediaPreview media={item} className="aspect-[4/3] h-auto w-full" />
                <span className="mt-1.5 block truncate px-0.5 text-xs font-medium">{item.filename}</span>
                <span className="block px-0.5 text-[0.7rem] text-[#7d9292]">{formatBytes(item.size_bytes)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
