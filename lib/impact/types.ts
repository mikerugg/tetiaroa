import type { PortableTextBlock } from "@portabletext/react";

export const impactCategories = [
  "Education",
  "TARP",
  "Research",
  "Technology",
  "Global Impact",
  "Conservation",
  "Biosecurity",
  "Wildlife",
  "Culture",
] as const;

export const impactEntryTypes = ["Project", "Article", "News", "Report"] as const;

export type ImpactCategory = (typeof impactCategories)[number];
export type ImpactEntryType = (typeof impactEntryTypes)[number];

export type ImpactBodyBlock =
  | PortableTextBlock
  | ({ _type: string; _key?: string } & Record<string, unknown>);

export type ImpactGalleryImage = {
  image: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type ImpactRelatedEntry = {
  title: string;
  slug: string;
  entryType: ImpactEntryType;
};

export type ImpactContentEntry = {
  id: string;
  title: string;
  slug: string;
  entryType: ImpactEntryType;
  summary: string;
  category: ImpactCategory;
  secondaryCategories: ImpactCategory[];
  publishedAt: string;
  latestUpdate: string;
  status: string;
  location: string;
  heroImage: string;
  heroImageAlt: string;
  metric: string;
  tags: string[];
  body: ImpactBodyBlock[];
  gallery?: ImpactGalleryImage[];
  projectDates?: string;
  team?: string[];
  affiliation?: string;
  relatedEntries?: ImpactRelatedEntry[];
  legacyNodeId?: number;
  legacyPath?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type ImpactFeedItem = {
  id: string;
  title: string;
  slug: string;
  entryType: ImpactEntryType;
  summary: string;
  category: ImpactCategory;
  secondaryCategories: ImpactCategory[];
  latestUpdate: string;
  status: string;
  location: string;
  image: string;
  alt: string;
  metric: string;
  tags: string[];
  href: string;
  actionLabel: string;
};

export function toImpactFeedItem(entry: ImpactContentEntry): ImpactFeedItem {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    entryType: entry.entryType,
    summary: entry.summary,
    category: entry.category,
    secondaryCategories: entry.secondaryCategories,
    latestUpdate: entry.latestUpdate,
    status: entry.status,
    location: entry.location,
    image: entry.heroImage,
    alt: entry.heroImageAlt,
    metric: entry.metric,
    tags: entry.tags,
    href: `/impact/${entry.slug}`,
    actionLabel: entry.entryType === "Project" ? "Open project" : "Read entry",
  };
}

