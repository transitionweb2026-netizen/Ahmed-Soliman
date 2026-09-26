import type { ArticleBlock } from "@/content/types";

/** Renders an article body (one language) with the `.prose-lux` reading styles. */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-lux">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h3 key={i}>{block.text}</h3>;
          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return <blockquote key={i}>{block.text}</blockquote>;
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
