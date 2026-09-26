/* eslint-disable @next/next/no-img-element -- previews of freshly uploaded files; no optimisation needed in the CMS */
import type { MediaItem } from "@/app/admin/actions";

/** Thumbnail for any media file: image, icon (on a dark chip), video or PDF. */
export function MediaPreview({ media, className = "h-24 w-full" }: { media: MediaItem; className?: string }) {
  const { mime_type: mime, public_url: url, bucket } = media;

  if (bucket === "icons") {
    return (
      <div className={`grid place-items-center rounded-lg bg-[#104848] ${className}`}>
        <span
          className="block h-8 w-8 bg-[#8fd3d1]"
          style={{ mask: `url("${url}") center / contain no-repeat`, WebkitMask: `url("${url}") center / contain no-repeat` }}
        />
      </div>
    );
  }
  if (mime.startsWith("image/")) {
    return <img src={url} alt={media.alt_en || media.filename} className={`rounded-lg bg-[#eef3f3] object-cover ${className}`} loading="lazy" />;
  }
  if (mime.startsWith("video/")) {
    return <video src={url} muted preload="metadata" className={`rounded-lg bg-black object-cover ${className}`} />;
  }
  return (
    <div className={`grid place-items-center rounded-lg bg-[#fdf1f1] text-sm font-bold text-[#b91c1c] ${className}`}>PDF</div>
  );
}
