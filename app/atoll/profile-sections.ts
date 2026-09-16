import type { GuideBodyBlock } from "../../lib/atoll/types";

export type GuideBodySection = {
  id: string;
  title: string;
  heading: GuideBodyBlock;
  blocks: GuideBodyBlock[];
};

/** Keep every original block while using the authored top-level headings as disclosures. */
export function groupGuideBody(body: readonly GuideBodyBlock[]) {
  const introduction: GuideBodyBlock[] = [];
  const sections: GuideBodySection[] = [];

  for (const block of body) {
    const title = block._type === "block" && (block.style === "h1" || block.style === "h2") && Array.isArray(block.children)
      ? block.children.map((child: { text?: unknown }) => typeof child.text === "string" ? child.text : "").join("").trim()
      : "";

    if (title) {
      sections.push({ id: `section-${sections.length + 1}`, title, heading: block, blocks: [] });
    } else {
      const current = sections.at(-1);
      if (current) current.blocks.push(block);
      else introduction.push(block);
    }
  }

  return { introduction, sections };
}
