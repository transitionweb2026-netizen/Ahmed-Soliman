import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { articles } from "@/content/articles";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";

export async function generateMetadata({ params }: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/articles",
    title: dict.articlesPage.title,
    description: dict.articlesPage.subtitle,
    image: media.laptop,
  });
}

export default async function ArticlesPage({ params }: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const labels = { ...dict.articlesPage, close: dict.common.close };
  const author = tr(site.name, locale);
  const [lead, ...rest] = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Hero
        locale={locale}
        labels={dict.hero}
        size="page"
        eyebrow={dict.articlesPage.eyebrow}
        line1={dict.articlesPage.title}
        line2={dict.articlesPage.subtitle}
        image={media.laptop}
        breadcrumb={{ label: dict.common.breadcrumb, homeLabel: dict.common.home, current: dict.articlesPage.title }}
      />

      <section aria-label={dict.articlesPage.title} className="section-y relative isolate">
        <Aurora className="-end-60 top-0" />
        <Aurora className="-start-60 bottom-1/4" variant="deep" />
        <div className="container-lux flex flex-col gap-8">
          <ArticleCard article={lead} locale={locale} labels={labels} author={author} featured />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {rest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} locale={locale} labels={labels} author={author} index={i % 3} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: dict.common.home, path: localePath(locale) },
          { name: dict.articlesPage.title, path: localePath(locale, "/articles") },
        ])}
      />
    </>
  );
}
