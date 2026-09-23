import type { Dictionary } from "@/lib/dictionary";
import { tr, type Locale } from "@/lib/i18n";
import type { Video } from "@/content/types";
import { Aurora } from "@/components/ui/Aurora";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoPlayer } from "@/components/video/VideoPlayer";

type VideoSectionProps = {
  locale: Locale;
  video: Video;
  labels: Dictionary["video"];
};

/** Home section 4 — a large cinematic video inside a Liquid Glass frame. */
export function VideoSection({ locale, video, labels }: VideoSectionProps) {
  return (
    <section aria-labelledby="video-title" className="section-y relative isolate">
      <Aurora className="start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2" />
      <div className="container-lux">
        <SectionHeader id="video-title" eyebrow={labels.eyebrow} title={labels.title} subtitle={labels.subtitle} />
        <div data-reveal="scale" className="relative mx-auto mt-14 max-w-6xl">
          {/* Brand rim light behind the frame */}
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br from-brand/30 via-transparent to-brand-deep/60 blur-2xl" />
          <div className="glass glass-interactive rounded-[2.4rem] p-2 sm:p-3">
            <VideoPlayer
              video={video}
              title={tr(video.title, locale)}
              playLabel={labels.play}
              unavailableLabel={labels.unavailable}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
