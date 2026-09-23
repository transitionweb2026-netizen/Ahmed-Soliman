"use client";

import Image from "next/image";
import { useState } from "react";
import type { Video } from "@/content/types";
import { Icon } from "@/components/ui/Icon";

type VideoFrameProps = {
  video: Video;
  title: string;
  unavailableLabel: string;
  sizes: string;
};

/** The actual media element: YouTube, a self-hosted file, or a graceful fallback. */
export function VideoFrame({ video, title, unavailableLabel, sizes }: VideoFrameProps) {
  const [failed, setFailed] = useState(false);

  if (video.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  if (video.src && !failed) {
    return (
      <video
        src={video.src}
        controls
        autoPlay
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full bg-black object-cover"
        aria-label={title}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <Image src={video.poster} alt="" fill sizes={sizes} className="object-cover opacity-40 blur-sm" />
      <div className="absolute inset-0 grid place-items-center p-6 text-center">
        <p className="glass flex items-center gap-3 rounded-2xl px-5 py-4 text-sm text-mist/90">
          <Icon name="clock" size={18} className="text-brand-light" />
          {unavailableLabel}
        </p>
      </div>
    </div>
  );
}
