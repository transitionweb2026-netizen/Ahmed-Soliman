import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getArticles, getHero, getSiteData } from "@/lib/cms/data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CmsHero } from "@/components/sections/CmsHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Aurora } from "@/components/ui/Aurora";

export async function generateMetadata({ params }: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hero = await getHero("articles");
  return pageMetadata(locale, "articles", hero.image);
}

export default async function ArticlesPage({ params }: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [site, hero, articles] = await Promise.all([getSiteData(), getHero("articles"), getArticles()]);
  const labels = { ...dict.articlesPage, close: dict.common.close };
  const author = tr(site.settings.name, locale);
  const title = tr(hero.title, locale);
  // Published articles in the CMS display order; the first is the featured lead story.
  const [lead, ...rest] = articles;

  return (
    <>
      <CmsHero locale={locale} page="articles" size="page" breadcrumb />

      {lead && (
        <section aria-label={title} className="section-y relative isolate">
          <Aurora className="-end-60 top-0" />
          <Aurora className="-start-60 bottom-1/4" variant="deep" />
          <div className="container-lux flex flex-col gap-8">
            <ArticleCard article={lead} locale={locale} labels={labels} author={author} featured />
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {rest.map((article, i) => (
                  <ArticleCard key={article.slug} article={article} locale={locale} labels={labels} author={author} index={i % 3} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema(site.settings.url, [
          { name: dict.common.home, path: localePath(locale) },
          { name: title, path: localePath(locale, "/articles") },
        ])}
      />
    </>
  );
}
