import { draftMode } from "next/headers";
import {
  fallbackImpactEntries,
  getFallbackImpactEntryBySlug,
} from "@/lib/impact/fallback";
import {
  impactCategories,
  impactEntryTypes,
  type ImpactBodyBlock,
  type ImpactCategory,
  type ImpactContentEntry,
  type ImpactEntryType,
  type ImpactFeedItem,
  type ImpactGalleryImage,
  type ImpactHtmlPackage,
  type ImpactLanguage,
  type ImpactRelatedEntry,
  toImpactFeedItem,
} from "@/lib/impact/types";
import { getSanityClient } from "./client";
import { hasSanityConfig, hasSanityToken } from "./env";
import {
  impactEntriesQuery,
  impactEntryBySlugQuery,
  impactEntryByLegacyPathQuery,
  impactSitemapEntriesQuery,
} from "./queries";

type SanityReferenceLabel = {
  title?: string | null;
  slug?: string | null;
};

type SanityPerson = {
  name?: string | null;
  role?: string | null;
};

type SanityImpactEntry = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  language?: string | null;
  translationKey?: string | null;
  alternateSlug?: string | null;
  entryType?: string | null;
  summary?: string | null;
  category?: string | null;
  secondaryCategories?: string[] | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  status?: string | null;
  location?: string | null;
  metric?: string | null;
  projectDates?: string | null;
  affiliation?: string | null;
  tags?: string[] | null;
  body?: ImpactBodyBlock[] | null;
  htmlPackage?: (Partial<ImpactHtmlPackage> & { removed?: boolean }) | null;
  gallery?: Array<Partial<ImpactGalleryImage>> | null;
  program?: SanityReferenceLabel | null;
  topics?: SanityReferenceLabel[] | null;
  team?: SanityPerson[] | null;
  organizations?: Array<{ name?: string | null; url?: string | null }> | null;
  relatedEntries?: Array<{
    title?: string | null;
    slug?: string | null;
    entryType?: string | null;
  }> | null;
  legacyNodeId?: number | null;
  legacyVid?: number | null;
  legacyBundle?: string | null;
  legacyPath?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type SanityLegacyPathMatch = {
  slug?: string | null;
  language?: string | null;
};

type SanityImpactSitemapEntry = {
  slug?: string | null;
  language?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  _updatedAt?: string | null;
};

export type ImpactSitemapEntry = {
  slug: string;
  language: ImpactLanguage;
  lastModified: string;
};

const defaultHeroImage =
  "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1400&q=85&auto=format&fit=crop";

const categorySet = new Set<string>(impactCategories);
const entryTypeSet = new Set<string>(impactEntryTypes);

async function isDraftModeEnabled() {
  try {
    const draft = await draftMode();
    return draft.isEnabled && hasSanityToken();
  } catch {
    return false;
  }
}

function normalizeDate(value: string | null | undefined, fallback: string) {
  return (value ?? fallback).slice(0, 10);
}

function normalizeCategoryValue(
  value: string | null | undefined,
): ImpactCategory | null {
  if (value === "Documents") {
    return "Reports";
  }

  return categorySet.has(value ?? "") ? (value as ImpactCategory) : null;
}

function normalizeCategory(value: string | null | undefined): ImpactCategory {
  return normalizeCategoryValue(value) ?? "Research";
}

function normalizeEntryType(value: string | null | undefined): ImpactEntryType {
  if (value === "Document") {
    return "Report";
  }

  return entryTypeSet.has(value ?? "") ? (value as ImpactEntryType) : "Article";
}

function normalizeLanguage(value: string | null | undefined): ImpactLanguage {
  return value === "fr" ? "fr" : "en";
}

function normalizeSecondaryCategories(
  values: string[] | null | undefined,
  primary: ImpactCategory,
) {
  return (values ?? [])
    .map(normalizeCategoryValue)
    .filter((value): value is ImpactCategory => Boolean(value))
    .filter((value) => value !== primary);
}

function normalizeRelatedEntries(
  relatedEntries: SanityImpactEntry["relatedEntries"],
): ImpactRelatedEntry[] {
  return (relatedEntries ?? []).flatMap((entry) => {
    if (!entry.title || !entry.slug) {
      return [];
    }

    return [
      {
        title: entry.title,
        slug: entry.slug,
        entryType: normalizeEntryType(entry.entryType),
      },
    ];
  });
}

function normalizeGallery(gallery: SanityImpactEntry["gallery"]) {
  return (gallery ?? []).flatMap((item) => {
    if (!item.image) {
      return [];
    }

    return [
      {
        image: item.image,
        alt: item.alt ?? "",
        caption: item.caption,
      },
    ];
  });
}

function normalizeHtmlPackage(
  htmlPackage: SanityImpactEntry["htmlPackage"],
): ImpactHtmlPackage | undefined {
  if (!htmlPackage?.html || htmlPackage.removed) {
    return undefined;
  }

  return {
    html: htmlPackage.html,
    originalFilename: htmlPackage.originalFilename,
    importedAt: htmlPackage.importedAt,
    imageCount: htmlPackage.imageCount ?? 0,
    warnings: htmlPackage.warnings ?? [],
  };
}

function normalizeTeam(team: SanityImpactEntry["team"]) {
  return (team ?? []).flatMap((person) => {
    if (!person.name) {
      return [];
    }

    return [person.role ? `${person.name}, ${person.role}` : person.name];
  });
}

function normalizeTagComparison(value: string) {
  return value
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const structuralTagKeys = new Set(
  [...impactEntryTypes, "Document", "Documents", "Reports"].map((tag) =>
    normalizeTagComparison(tag),
  ),
);

function normalizeTags(entry: SanityImpactEntry) {
  const topicTags = (entry.topics ?? []).flatMap((topic) =>
    topic.title ? [topic.title] : [],
  );
  const tags = [...(entry.tags ?? []), ...topicTags].map((tag) => {
    if (entry.entryType === "Profile") {
      switch (tag.toLowerCase()) {
        case "board-member":
        case "board member":
        case "board":
          return "Board Member";
        case "staff":
        case "management":
          return "Staff";
        default:
          return tag;
      }
    }

    return tag;
  });
  const isStaffProfile =
    entry.entryType === "Profile" &&
    tags.some((tag) => tag.toLowerCase() === "staff");
  const affiliationKey = normalizeTagComparison(entry.affiliation ?? "");
  const visibleTags = tags.filter((tag) => {
    const tagKey = normalizeTagComparison(tag);

    if (structuralTagKeys.has(tagKey)) {
      return false;
    }

    if (!isStaffProfile || !affiliationKey) {
      return true;
    }

    return tagKey !== affiliationKey;
  });

  return [...new Set(visibleTags)].filter(Boolean);
}

function normalizeMetric(
  metric: string | null | undefined,
  entryType: string | null | undefined,
) {
  switch (metric) {
    case "Legacy research project":
      return "Research project";
    case "Legacy project update":
      return "Project update";
    case "Legacy document":
      return "Report";
    case "Legacy newsletter":
      return "Newsletter";
    case "Legacy profile":
      return "Profile";
    case "Legacy partner":
      return "Partner";
    case "Legacy archive":
      return "From the Archive";
    default:
      return metric ?? entryType ?? "Impact entry";
  }
}

function normalizeSanityEntry(entry: SanityImpactEntry): ImpactContentEntry | null {
  if (!entry.title || !entry.slug) {
    return null;
  }

  const category = normalizeCategory(entry.category);
  const publishedAt = normalizeDate(entry.publishedAt, "1970-01-01");
  const latestUpdate = normalizeDate(entry.updatedAt, publishedAt);

  return {
    id: entry._id,
    title: entry.title,
    slug: entry.slug,
    language: normalizeLanguage(entry.language),
    translationKey: entry.translationKey ?? undefined,
    alternateSlug: entry.alternateSlug ?? undefined,
    entryType: normalizeEntryType(entry.entryType),
    summary: entry.summary ?? "",
    category,
    secondaryCategories: normalizeSecondaryCategories(
      entry.secondaryCategories,
      category,
    ),
    publishedAt,
    latestUpdate,
    status: entry.status ?? "Published",
    location: entry.location ?? "Teti'aroa",
    heroImage: entry.heroImage ?? defaultHeroImage,
    heroImageAlt: entry.heroImageAlt ?? entry.title,
    metric: normalizeMetric(entry.metric, entry.entryType),
    tags: normalizeTags(entry),
    body: entry.body ?? [],
    htmlPackage: normalizeHtmlPackage(entry.htmlPackage),
    gallery: normalizeGallery(entry.gallery),
    projectDates: entry.projectDates ?? undefined,
    team: normalizeTeam(entry.team),
    affiliation: entry.affiliation ?? undefined,
    relatedEntries: normalizeRelatedEntries(entry.relatedEntries),
    legacyNodeId: entry.legacyNodeId ?? undefined,
    legacyVid: entry.legacyVid ?? undefined,
    legacyBundle: entry.legacyBundle ?? undefined,
    legacyPath: entry.legacyPath ?? undefined,
    seoTitle: entry.seoTitle ?? undefined,
    seoDescription: entry.seoDescription ?? undefined,
  };
}

function normalizeSitemapEntry(
  entry: SanityImpactSitemapEntry,
): ImpactSitemapEntry | null {
  if (!entry.slug) {
    return null;
  }

  const lastModified = normalizeDate(
    entry.updatedAt ?? entry._updatedAt ?? entry.publishedAt,
    "1970-01-01",
  );

  return {
    slug: entry.slug,
    language: normalizeLanguage(entry.language),
    lastModified,
  };
}

function getFallbackSitemapEntries(language: ImpactLanguage) {
  return language === "en"
    ? fallbackImpactEntries.map((entry) => ({
        slug: entry.slug,
        language: entry.language,
        lastModified: entry.latestUpdate,
      }))
    : [];
}

async function fetchSanityData<T>(
  query: string,
  params: Record<string, string> = {},
  tags: string[] = ["impact"],
) {
  if (!hasSanityConfig()) {
    return null;
  }

  const draft = await isDraftModeEnabled();
  const client = getSanityClient({ draft });

  return client.fetch<T>(query, params, {
    ...(draft ? { cache: "no-store" as const } : { next: { tags } }),
  });
}

export async function getImpactEntries(): Promise<ImpactContentEntry[]> {
  return getImpactEntriesByLanguage("en");
}

export async function getImpactEntriesByLanguage(
  language: ImpactLanguage = "en",
): Promise<ImpactContentEntry[]> {
  const entries = await fetchSanityData<SanityImpactEntry[]>(
    impactEntriesQuery,
    { language },
    ["impact"],
  ).catch((error) => {
    console.warn("Unable to fetch Sanity impact entries.", error);
    return null;
  });

  if (!entries) {
    return language === "en" ? fallbackImpactEntries : [];
  }

  return entries.flatMap((entry) => {
    const normalized = normalizeSanityEntry(entry);
    return normalized ? [normalized] : [];
  });
}

export async function getImpactFeedItems(): Promise<ImpactFeedItem[]> {
  return getImpactFeedItemsByLanguage("en");
}

export async function getImpactFeedItemsByLanguage(
  language: ImpactLanguage = "en",
): Promise<ImpactFeedItem[]> {
  const entries = await getImpactEntriesByLanguage(language);
  return entries.map(toImpactFeedItem);
}

export async function getImpactEntryBySlug(
  slug: string,
  language: ImpactLanguage = "en",
) {
  const entry = await fetchSanityData<SanityImpactEntry | null>(
    impactEntryBySlugQuery,
    { slug, language },
    ["impact", `impact:${slug}`],
  ).catch((error) => {
    console.warn(`Unable to fetch Sanity impact entry "${slug}".`, error);
    return null;
  });

  const normalized = entry ? normalizeSanityEntry(entry) : null;

  return normalized ?? (language === "en" ? getFallbackImpactEntryBySlug(slug) : null);
}

export async function getImpactSitemapEntries(
  language: ImpactLanguage = "en",
): Promise<ImpactSitemapEntry[]> {
  const fallbackEntries = getFallbackSitemapEntries(language);
  const entries = await fetchSanityData<SanityImpactSitemapEntry[]>(
    impactSitemapEntriesQuery,
    { language },
    ["impact"],
  ).catch((error) => {
    console.warn("Unable to fetch Sanity impact sitemap entries.", error);
    return null;
  });

  if (!entries) {
    return fallbackEntries;
  }

  const sitemapEntries = entries.flatMap((entry) => {
    const normalized = normalizeSitemapEntry(entry);
    return normalized ? [normalized] : [];
  });
  const entryMap = new Map(
    sitemapEntries.map((entry) => [`${entry.language}:${entry.slug}`, entry]),
  );

  for (const fallbackEntry of fallbackEntries) {
    const key = `${fallbackEntry.language}:${fallbackEntry.slug}`;

    if (!entryMap.has(key)) {
      entryMap.set(key, fallbackEntry);
    }
  }

  return [...entryMap.values()];
}

export async function getImpactEntryByLegacyPath(legacyPath: string) {
  const normalizedPath = legacyPath.startsWith("/") ? legacyPath : `/${legacyPath}`;
  const match = await fetchSanityData<SanityLegacyPathMatch | null>(
    impactEntryByLegacyPathQuery,
    { legacyPath: normalizedPath },
    ["impact", `legacy:${normalizedPath}`],
  ).catch((error) => {
    console.warn(`Unable to fetch Sanity legacy path "${normalizedPath}".`, error);
    return null;
  });

  if (match?.slug) {
    const language = normalizeLanguage(match.language);

    return {
      slug: match.slug,
      language,
      href: language === "fr" ? `/fr/impact/${match.slug}` : `/impact/${match.slug}`,
    };
  }

  const fallback = fallbackImpactEntries.find(
    (entry) => entry.legacyPath === normalizedPath,
  );

  return fallback
    ? {
        slug: fallback.slug,
        language: fallback.language,
        href:
          fallback.language === "fr"
            ? `/fr/impact/${fallback.slug}`
            : `/impact/${fallback.slug}`,
      }
    : null;
}
