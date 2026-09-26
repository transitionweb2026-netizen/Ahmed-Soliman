import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { media } from "@/content/media";
import { videos } from "@/content/videos";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { VideoCard } from "@/components/video/VideoCard";

export async function generateMetadata({ params }: PageProps<"/[locale]/videos">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/videos",
    title: dict.videosPage.title,
    description: dict.videosPage.subtitle,
    image: media.consultation,
  });
}

export default async function VideosPage({ params }: PageProps<"/[locale]/videos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero
        locale={locale}
        labels={dict.hero}
        size="page"
        eyebrow={dict.videosPage.eyebrow}
        line1={dict.videosPage.title}
        line2={dict.videosPage.subtitle}
        image={media.consultation}
        breadcrumb={{ label: dict.common.breadcrumb, homeLabel: dict.common.home, current: dict.videosPage.title }}
      />

      <section aria-label={dict.videosPage.title} className="section-y relative isolate">
        <Aurora className="-start-60 top-0" />
        <Aurora className="-end-60 bottom-0" variant="deep" />
        <div className="container-lux">
          {/* All nine videos — the first three are the home page's featured set. */}
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-8">
            {videos.map((video, i) => (
              <li key={video.id}>
                <VideoCard video={video} title={tr(video.title, locale)} labels={dict.video} style={delay((i % 3) * 110)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: dict.common.home, path: localePath(locale) },
          { name: dict.videosPage.title, path: localePath(locale, "/videos") },
        ])}
      />
    </>
  );
}
