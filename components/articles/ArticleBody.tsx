import type { ArticleBlock } from "@/content/types";
import type { Locale } from "@/lib/i18n";

const ENDS_SENTENCE = /[.!?؟…:؛]$/;

/** A list's items as one sentence-like run of text (no bullets). */
function listAsProse(items: string[], locale: Locale): string {
  const comma = locale === "ar" ? "،" : ",";
  const clean = items.map((item) => item.trim()).filter(Boolean);
  return clean.map((item, i) => (ENDS_SENTENCE.test(item) ? item : `${item}${i === clean.length - 1 ? "." : comma}`)).join(" ");
}

/**
 * Renders an article body (one language) as flowing paragraphs only, with
 * the `.prose-article` reading styles: no section headings, bullet points or
 * quote boxes. Subheadings are left out, each list becomes one paragraph of
 * running text (joined to the paragraph before it when that one ends with a
 * colon), and quotes read as ordinary paragraphs.
 */
export function ArticleBody({ blocks, locale }: { blocks: ArticleBlock[]; locale: Locale }) {
  const paragraphs: string[] = [];
  for (const block of blocks) {
    if (block.type === "h2") continue;
    const text = block.type === "list" ? listAsProse(block.items, locale) : block.text.trim();
    if (!text) continue;
    const last = paragraphs.length - 1;
    if (block.type === "list" && last >= 0 && /[:：]$/.test(paragraphs[last])) paragraphs[last] = `${paragraphs[last]} ${text}`;
    else paragraphs.push(text);
  }
  return (
    <div className="prose-article">
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}
