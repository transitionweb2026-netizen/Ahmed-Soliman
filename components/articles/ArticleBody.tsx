import { tr, type Locale } from "@/lib/i18n";
import type { ArticleBlock } from "@/content/types";

/** Renders an article's structured body with the `.prose-lux` reading styles. */
export function ArticleBody({ blocks, locale }: { blocks: ArticleBlock[]; locale: Locale }) {
  return (
    <div className="prose-lux">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h3 key={i}>{tr(block.text, locale)}</h3>;
          case "list":
            return (
              <ul key={i}>
                {tr(block.items, locale).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return <blockquote key={i}>{tr(block.text, locale)}</blockquote>;
          default:
            return <p key={i}>{tr(block.text, locale)}</p>;
        }
      })}
    </div>
  );
}
