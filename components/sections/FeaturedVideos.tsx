import type { Dictionary } from "@/lib/dictionary";
import { isExternalHref, resolveHref, tr, type Locale } from "@/lib/i18n";
import type { SectionContent } from "@/lib/cms/types";
import { delay } from "@/lib/motion";
import type { Video } from "@/content/types";
import { Aurora } from "@/components/ui/Aurora";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoCard } from "@/components/video/VideoCard";

type FeaturedVideosProps = {
  locale: Locale;
  videos: Video[];
  /** CMS block "home.featured" (headings + button). */
  content: SectionContent;
  videoLabels: Dictionary["video"];
};

/** Home section 9 — three vertical videos; a swipeable row on phones. */
export function FeaturedVideos({ locale, videos, content, videoLabels }: FeaturedVideosProps) {
  if (!videos.length) return null;
  const buttonLabel = tr(content.button.label, locale);
  return (
    <section aria-labelledby="featured-title" className="section-y relative isolate overflow-hidden">
      <Aurora className="start-1/2 top-1/3 -translate-x-1/2 rtl:translate-x-1/2" variant="deep" />
      <div className="container-lux">
        <SectionHeader
          id="featured-title"
          eyebrow={tr(content.eyebrow, locale)}
          title={tr(content.title, locale)}
          subtitle={tr(content.subtitle, locale)}
        />

        <ul className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-2 sm:mx-auto sm:grid sm:max-w-5xl sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:gap-8">
          {videos.map((video, i) => (
            <li key={video.id} className="w-[72%] shrink-0 snap-center sm:w-auto">
              <VideoCard
                video={video}
                title={tr(video.title, locale)}
                description={video.description ? tr(video.description, locale) : undefined}
                labels={videoLabels}
                style={delay(i * 120)}
              />
            </li>
          ))}
        </ul>

        {buttonLabel && (
          <div className="mt-10 flex justify-center" data-reveal="">
            <GlassButton href={resolveHref(locale, content.button.href)} external={isExternalHref(content.button.href)} size="lg" icon="play" arrow>
              {buttonLabel}
            </GlassButton>
          </div>
        )}
      </div>
    </section>
  );
}
