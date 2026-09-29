"use client";

import Image from "next/image";
import { useState } from "react";
import type { Video } from "@/content/types";
import { PlayButton } from "./PlayButton";
import { VideoFrame } from "./VideoFrame";

type VideoPlayerProps = {
  video: Video;
  title: string;
  playLabel: string;
  unavailableLabel: string;
};

/**
 * Large 16:9 player. Only the poster is loaded up front; the video itself is
 * requested when the visitor presses play.
 */
export function VideoPlayer({ video, title, playLabel, unavailableLabel }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const sizes = "(min-width: 1280px) 1200px, 95vw";

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.9rem] bg-ink-950 sm:aspect-video">
      {playing ? (
        <VideoFrame video={video} title={title} unavailableLabel={unavailableLabel} sizes={sizes} />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 grid place-items-center"
        >
          {video.poster && (
            <Image
              src={video.poster}
              alt=""
              fill
              sizes={sizes}
              quality={85}
              className="object-cover transition-transform duration-[1.6s] ease-(--ease-lux) group-hover:scale-[1.04]"
            />
          )}
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/25 to-ink-950/40" />
          <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_50%,rgb(72_164_164/0.25),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <PlayButton />
          <span className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
            <span className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-start">
              <span className="font-display text-lg text-white sm:text-2xl">{title}</span>
              {video.duration && (
                <span dir="ltr" className="num-sans shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs tabular-nums text-brand-pale shadow-[inset_0_0_0_1px_rgb(72_164_164/0.4)]">
                  {video.duration}
                </span>
              )}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
