import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { delay } from "@/lib/motion";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getHero, getSiteData, getVideos } from "@/lib/cms/data";
import { CmsHero } from "@/components/sections/CmsHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";
import { VideoCard } from "@/components/video/VideoCard";

export async function generateMetadata({ params }: PageProps<"/[locale]/videos">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hero = await getHero("videos");
  return pageMetadata(locale, "videos", hero.image);
}

export default async function VideosPage({ params }: PageProps<"/[locale]/videos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [site, hero, videos] = await Promise.all([getSiteData(), getHero("videos"), getVideos()]);
  const title = tr(hero.title, locale);

  return (
    <>
      <CmsHero locale={locale} page="videos" size="page" breadcrumb />

      {videos.length > 0 && (
        <section aria-label={title} className="section-y relative isolate">
          <Aurora className="-start-60 top-0" />
          <Aurora className="-end-60 bottom-0" variant="deep" />
          <div className="container-lux">
            {/* Every active video, in display order (the Home page shows the "Featured on Home" ones). */}
            <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-8">
              {videos.map((video, i) => (
                <li key={video.id}>
                  <VideoCard
                    video={video}
                    title={tr(video.title, locale)}
                    description={video.description ? tr(video.description, locale) : undefined}
                    labels={dict.video}
                    style={delay((i % 3) * 110)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema(site.settings.url, [
          { name: dict.common.home, path: localePath(locale) },
          { name: title, path: localePath(locale, "/videos") },
        ])}
      />
    </>
  );
}
