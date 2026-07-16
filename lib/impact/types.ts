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
  "People",
  "Partners",
  "Reports",
  "Nature Guide",
  "News",
] as const;

export const impactEntryTypes = [
  "Project",
  "Article",
  "News",
  "Report",
  "Profile",
  "Partner",
  "Newsletter",
  "Guide",
  "Video",
  "Project Update",
] as const;

export const impactLanguages = ["en", "fr"] as const;

export type ImpactCategory = (typeof impactCategories)[number];
export type ImpactEntryType = (typeof impactEntryTypes)[number];
export type ImpactLanguage = (typeof impactLanguages)[number];

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

export type ImpactHtmlPackage = {
  html: string;
  originalFilename?: string;
  importedAt?: string;
  imageCount: number;
  warnings: string[];
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
  language: ImpactLanguage;
  translationKey?: string;
  alternateSlug?: string;
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
  htmlPackage?: ImpactHtmlPackage;
  gallery?: ImpactGalleryImage[];
  projectDates?: string;
  team?: string[];
  affiliation?: string;
  relatedEntries?: ImpactRelatedEntry[];
  legacyNodeId?: number;
  legacyVid?: number;
  legacyBundle?: string;
  legacyPath?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type ImpactFeedItem = {
  id: string;
  title: string;
  slug: string;
  language: ImpactLanguage;
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

function getImpactHref(entry: ImpactContentEntry) {
  return entry.language === "fr"
    ? `/fr/impact/${entry.slug}`
    : `/impact/${entry.slug}`;
}

function getImpactActionLabel(entry: ImpactContentEntry) {
  if (entry.language === "fr") {
    return entry.entryType === "Project" ? "Ouvrir le projet" : "Lire";
  }

  return entry.entryType === "Project" ? "Open project" : "Read entry";
}

export function toImpactFeedItem(entry: ImpactContentEntry): ImpactFeedItem {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    language: entry.language,
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
    href: getImpactHref(entry),
    actionLabel: getImpactActionLabel(entry),
  };
}
