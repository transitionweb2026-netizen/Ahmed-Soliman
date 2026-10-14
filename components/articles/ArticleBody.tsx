import type { ArticleBlock } from "@/content/types";

/**
 * Renders an article body (one language) as plain text paragraphs, with the
 * `.prose-article` reading styles: no subheadings, bullet points or quote
 * boxes. Every block keeps its text — a subheading or quote becomes a
 * paragraph, and each list item becomes a paragraph of its own.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  const paragraphs = blocks
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .map((text) => text.trim())
    .filter(Boolean);
  return (
    <div className="prose-article">
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}
