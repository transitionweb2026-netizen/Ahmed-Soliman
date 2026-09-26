"use client";

import { useRef, useState, type DragEvent } from "react";
import type { MediaItem } from "@/app/admin/actions";
import { mediaKinds, type MediaKind } from "@/lib/cms/schema";
import { formatBytes, uploadMedia, validateFile, type UploadHandle } from "@/lib/cms/upload";
import { MediaPicker } from "./MediaPicker";
import { MediaPreview } from "./MediaPreview";

type MediaUploaderProps = {
  kind: MediaKind;
  /** Storage folder inside the bucket, e.g. "services" or "home/hero". */
  folder: string;
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  /** Label for the main button, e.g. "Upload video". */
  uploadLabel?: string;
  invalid?: boolean;
};

const uploadLabels: Record<MediaKind, string> = {
  image: "Upload Image",
  icon: "Upload Icon",
  video: "Upload Video",
  certificate: "Upload Certificate",
  pdf: "Upload PDF",
};

/**
 * The one upload control used everywhere in the CMS: drag & drop or browse,
 * type/size validation, live progress with cancel, preview, replace, remove,
 * or pick an existing file from the Media Library.
 */
export function MediaUploader({ kind, folder, value, onChange, uploadLabel, invalid }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<UploadHandle | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [picking, setPicking] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const rules = mediaKinds[kind];

  async function start(file: File) {
    setError(null);
    setJustUploaded(false);
    const problem = validateFile(file, kind);
    if (problem) {
      setError(problem);
      return;
    }
    setFileName(file.name);
    setProgress(0);
    const handle = uploadMedia(file, kind, folder, setProgress);
    handleRef.current = handle;
    try {
      const media = await handle.promise;
      onChange(media);
      setJustUploaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setProgress(null);
      handleRef.current = null;
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void start(file);
  }

  const uploading = progress !== null;
  const accept = rules.extensions.map((e) => `.${e}`).join(",");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void start(file);
        }}
      />

      {uploading ? (
        <div className="rounded-xl border border-[#d4dfde] bg-white p-4" aria-live="polite">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium">Uploading {fileName}</span>
            <span className="tabular-nums text-[#3a5454]">{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6eeee]" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${progress}%` }} />
          </div>
          <button type="button" onClick={() => handleRef.current?.abort()} className="adm-btn adm-btn-ghost mt-2 -ms-2">
            Cancel
          </button>
        </div>
      ) : value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center ${dragging ? "border-brand ring-2 ring-brand/30" : "border-[#d4dfde]"}`}
        >
          <MediaPreview media={value} className={kind === "video" ? "h-28 w-full sm:w-48" : "h-24 w-full sm:w-36"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{value.filename}</p>
            <p className="text-xs text-[#6b8080]">
              {formatBytes(value.size_bytes)}
              {value.width && value.height ? ` · ${value.width}×${value.height}` : ""}
              {value.duration_seconds ? ` · ${Math.round(value.duration_seconds)}s` : ""}
            </p>
            {justUploaded && <p className="mt-1 text-xs font-semibold text-emerald-700">✓ Uploaded — remember to save</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => inputRef.current?.click()} className="adm-btn adm-btn-secondary">
                Replace
              </button>
              <button type="button" onClick={() => setPicking(true)} className="adm-btn adm-btn-ghost">
                From library
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setJustUploaded(false);
                }}
                className="adm-btn adm-btn-ghost text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          aria-invalid={invalid || undefined}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragging ? "border-brand bg-brand-soft" : invalid ? "border-red-300 bg-red-50/40" : "border-[#cfdcdb] bg-[#fafcfc]"
          }`}
        >
          <p className="text-sm text-[#3a5454]">Drag & drop a file here, or</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="adm-btn adm-btn-primary">
              {uploadLabel ?? uploadLabels[kind]}
            </button>
            <button type="button" onClick={() => setPicking(true)} className="adm-btn adm-btn-secondary">
              Choose from library
            </button>
          </div>
          <p className="adm-help">{rules.label}</p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <MediaPicker open={picking} kind={kind} onClose={() => setPicking(false)} onPick={(m) => onChange(m)} />
    </div>
  );
}
