"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Video } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { PlayButton } from "./PlayButton";
import { VideoFrame } from "./VideoFrame";

type VideoCardProps = {
  video: Video;
  title: string;
  labels: { play: string; close: string; unavailable: string };
  style?: CSSProperties;
};

/** Vertical (9:16) glass video card that opens a lightbox player. */
export function VideoCard({ video, title, labels, style }: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div data-reveal="" style={style} className="h-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${labels.play}: ${title}`}
        className="group glass glass-interactive block h-full w-full rounded-[2rem] p-2 text-start"
        data-tilt
      >
        <span className="relative block aspect-[9/16] overflow-hidden rounded-[1.6rem]">
          <Image
            src={video.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 33vw, 75vw"
            className="object-cover transition-transform duration-[1.4s] ease-(--ease-lux) group-hover:scale-[1.06]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/20 to-ink-950/30" />
          <span
            dir="ltr"
            className="glass absolute end-3 top-3 rounded-full px-3 py-1 text-xs tabular-nums text-brand-pale"
          >
            {video.duration}
          </span>
          <span className="absolute inset-0 grid place-items-center opacity-90 transition-opacity group-hover:opacity-100">
            <PlayButton size="md" />
          </span>
          <span className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
            <span aria-hidden="true" className="h-px w-10 bg-brand-light" />
            <span className="font-display text-[0.95rem] leading-snug text-white sm:text-xl">{title}</span>
          </span>
        </span>
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          onClose={() => setOpen(false)}
          onClick={(event) => event.target === dialogRef.current && dialogRef.current?.close()}
          aria-label={title}
          className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-ink-950/80 backdrop:backdrop-blur-lg"
        >
          <div className="relative animate-[dialog-in_0.5s_var(--ease-lux)_both]">
            <div className="glass rounded-[2rem] p-2">
              <div className="relative aspect-[9/16] h-[min(80dvh,46rem)] overflow-hidden rounded-[1.6rem] bg-black">
                <VideoFrame video={video} title={title} unavailableLabel={labels.unavailable} sizes="420px" />
              </div>
            </div>
            <p className="mt-4 text-center font-display text-lg text-white">{title}</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={labels.close}
              className="btn btn-glass absolute -end-2 -top-2 h-11 min-h-0 w-11 rounded-full p-0 sm:-end-14 sm:top-0"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
