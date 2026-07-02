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
  type ImpactRelatedEntry,
  toImpactFeedItem,
} from "@/lib/impact/types";
import { getSanityClient } from "./client";
import { hasSanityConfig, hasSanityToken } from "./env";
import {
  impactEntriesQuery,
  impactEntryBySlugQuery,
  impactSlugsQuery,
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
  legacyPath?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
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

function normalizeCategory(value: string | null | undefined): ImpactCategory {
  return categorySet.has(value ?? "") ? (value as ImpactCategory) : "Research";
}

function normalizeEntryType(value: string | null | undefined): ImpactEntryType {
  return entryTypeSet.has(value ?? "") ? (value as ImpactEntryType) : "Article";
}

function normalizeSecondaryCategories(
  values: string[] | null | undefined,
  primary: ImpactCategory,
) {
  return (values ?? [])
    .filter((value): value is ImpactCategory => categorySet.has(value))
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

function normalizeTeam(team: SanityImpactEntry["team"]) {
  return (team ?? []).flatMap((person) => {
    if (!person.name) {
      return [];
    }

    return [person.role ? `${person.name}, ${person.role}` : person.name];
  });
}

function normalizeTags(entry: SanityImpactEntry) {
  const topicTags = (entry.topics ?? []).flatMap((topic) =>
    topic.title ? [topic.title] : [],
  );
  const tags = [...(entry.tags ?? []), ...topicTags];

  return [...new Set(tags)].filter(Boolean);
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
    location: entry.location ?? "Tetiaroa",
    heroImage: entry.heroImage ?? defaultHeroImage,
    heroImageAlt: entry.heroImageAlt ?? entry.title,
    metric: entry.metric ?? entry.entryType ?? "Impact entry",
    tags: normalizeTags(entry),
    body: entry.body ?? [],
    gallery: normalizeGallery(entry.gallery),
    projectDates: entry.projectDates ?? undefined,
    team: normalizeTeam(entry.team),
    affiliation: entry.affiliation ?? undefined,
    relatedEntries: normalizeRelatedEntries(entry.relatedEntries),
    legacyNodeId: entry.legacyNodeId ?? undefined,
    legacyPath: entry.legacyPath ?? undefined,
    seoTitle: entry.seoTitle ?? undefined,
    seoDescription: entry.seoDescription ?? undefined,
  };
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
  const entries = await fetchSanityData<SanityImpactEntry[]>(
    impactEntriesQuery,
    {},
    ["impact"],
  ).catch((error) => {
    console.warn("Unable to fetch Sanity impact entries.", error);
    return null;
  });

  if (!entries) {
    return fallbackImpactEntries;
  }

  return entries.flatMap((entry) => {
    const normalized = normalizeSanityEntry(entry);
    return normalized ? [normalized] : [];
  });
}

export async function getImpactFeedItems(): Promise<ImpactFeedItem[]> {
  const entries = await getImpactEntries();
  return entries.map(toImpactFeedItem);
}

export async function getImpactEntryBySlug(slug: string) {
  const entry = await fetchSanityData<SanityImpactEntry | null>(
    impactEntryBySlugQuery,
    { slug },
    ["impact", `impact:${slug}`],
  ).catch((error) => {
    console.warn(`Unable to fetch Sanity impact entry "${slug}".`, error);
    return null;
  });

  const normalized = entry ? normalizeSanityEntry(entry) : null;

  return normalized ?? getFallbackImpactEntryBySlug(slug);
}

export async function getImpactSlugs() {
  const slugs = await fetchSanityData<Array<{ slug?: string | null }>>(
    impactSlugsQuery,
    {},
    ["impact"],
  ).catch((error) => {
    console.warn("Unable to fetch Sanity impact slugs.", error);
    return null;
  });

  if (!slugs) {
    return fallbackImpactEntries.map((entry) => entry.slug);
  }

  return [
    ...new Set([
      ...slugs.flatMap((entry) => (entry.slug ? [entry.slug] : [])),
      ...fallbackImpactEntries.map((entry) => entry.slug),
    ]),
  ];
}

