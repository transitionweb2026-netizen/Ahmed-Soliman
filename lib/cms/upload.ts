import * as tus from "tus-js-client";
import { registerMedia, type MediaItem } from "@/app/admin/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { formatBytes } from "./format";
import { mediaKinds, type MediaKind } from "./schema";

export { formatBytes };

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
};

export function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** The file's MIME type, falling back to its extension (some browsers leave it empty). */
export function mimeOf(file: File) {
  return file.type || MIME_BY_EXTENSION[extensionOf(file.name)] || "";
}

/** Returns an error message when the file is not acceptable for this kind of slot. */
export function validateFile(file: File, kind: MediaKind): string | null {
  const rules = mediaKinds[kind];
  const mime = mimeOf(file);
  if (!rules.mime.includes(mime) || !rules.extensions.includes(extensionOf(file.name))) {
    return `“${file.name}” is not an accepted file type. Allowed: ${rules.extensions.join(", ").toUpperCase()}.`;
  }
  if (file.size > rules.maxBytes) return `“${file.name}” is ${formatBytes(file.size)} — the limit is ${formatBytes(rules.maxBytes)}.`;
  return null;
}

async function probe(file: File, mime: string): Promise<{ width?: number; height?: number; duration?: number }> {
  const url = URL.createObjectURL(file);
  try {
    if (mime.startsWith("image/")) {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { width: img.naturalWidth || undefined, height: img.naturalHeight || undefined };
    }
    if (mime.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("unreadable"));
      });
      return { width: video.videoWidth || undefined, height: video.videoHeight || undefined, duration: Number.isFinite(video.duration) ? video.duration : undefined };
    }
  } catch {
    // Metadata is a nice-to-have; the upload still proceeds.
  } finally {
    URL.revokeObjectURL(url);
  }
  return {};
}

function storagePath(folder: string, filename: string) {
  const now = new Date();
  const ext = extensionOf(filename);
  const base =
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "file";
  const unique = crypto.randomUUID().slice(0, 8);
  const cleanFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "") || "general";
  return `${cleanFolder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${unique}-${base}.${ext}`;
}

export type UploadHandle = { promise: Promise<MediaItem>; abort: () => void };

/**
 * Upload a file straight from the browser to Supabase Storage (resumable TUS
 * upload with progress), then record it in the media library.
 */
export function uploadMedia(file: File, kind: MediaKind, folder: string, onProgress: (percent: number) => void): UploadHandle {
  let upload: tus.Upload | null = null;
  let aborted = false;

  const promise = (async () => {
    const problem = validateFile(file, kind);
    if (problem) throw new Error(problem);

    const { data } = await getSupabaseBrowserClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Your session has expired. Please sign in again.");

    const mime = mimeOf(file);
    const rules = mediaKinds[kind];
    const path = storagePath(folder, file.name);
    const meta = await probe(file, mime);

    await new Promise<void>((resolve, reject) => {
      upload = new tus.Upload(file, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 2000, 5000, 10000],
        headers: { authorization: `Bearer ${token}`, apikey: supabaseAnonKey, "x-upsert": "false" },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024, // Supabase requires exactly 6 MB chunks
        metadata: { bucketName: rules.bucket, objectName: path, contentType: mime, cacheControl: "31536000" },
        onProgress: (sent, total) => onProgress(total ? Math.round((sent / total) * 100) : 0),
        onError: (error) => {
          const body = (error as tus.DetailedError).originalResponse?.getBody?.() ?? "";
          reject(new Error(aborted ? "Upload cancelled." : /exceeded|too large|413/i.test(body + error.message) ? "The file is larger than the storage limit allows." : `Upload failed: ${error.message}`));
        },
        onSuccess: () => resolve(),
      });
      upload.findPreviousUploads().then((previous) => {
        if (previous.length) upload?.resumeFromPreviousUpload(previous[0]);
        upload?.start();
      });
    });

    const result = await registerMedia({
      kind,
      path,
      filename: file.name,
      mimeType: mime,
      size: file.size,
      width: meta.width ?? null,
      height: meta.height ?? null,
      duration: meta.duration ?? null,
      category: folder,
    });
    if (!result.ok) throw new Error(result.error);
    return result.data as MediaItem;
  })();

  return {
    promise,
    abort: () => {
      aborted = true;
      void (upload as tus.Upload | null)?.abort(true);
    },
  };
}
