import { cache } from "react";
import { draftMode } from "next/headers";
import { categoryDefaults, getAtollPath, hubDefaults } from "@/lib/atoll/config";
import { guideBodyProjection } from "@/lib/atoll/projections";
import { guideCategories, type AtollHub, type GuideCard, type GuideCategory, type GuideCategoryId, type GuideHabitatId, type GuideImage, type GuideLocale, type GuideProfile, type GuideRelatedStory, type GuideResource, type GuideSitemapEntry } from "@/lib/atoll/types";
import { getSanityClient } from "./client";
import { hasSanityConfig, hasSanityToken } from "./env";

const imageProjection = `..., "url": image.asset->url, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height`;
const standaloneImageProjection = `{..., "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}`;
const resourceProjection = `..., "url": coalesce(file.asset->url, url)`;
const storyProjection = `{
  "englishTitle": coalesce(english.title, select(coalesce(language, "en") != "fr" => title)),
  "frenchTitle": coalesce(french.title, select(language == "fr" => title)),
  "englishSlug": coalesce(english.slug.current, select(coalesce(language, "en") != "fr" => slug.current)),
  "frenchSlug": coalesce(french.slug.current, select(language == "fr" => slug.current)),
  "englishSummary": coalesce(english.summary, summary), "frenchSummary": coalesce(french.summary, summary),
  "image": coalesce(english.heroImage.asset->url, french.heroImage.asset->url, heroImage.asset->url, english.gallery[0].image.asset->url, gallery[0].image.asset->url)
}`;
const cardLocaleProjection = `title, summary, localNames, otherNames, "gallery": gallery[0..0]{${imageProjection}}`;
const cardProjection = `_id, "slug": slug.current, category, subgroup, habitats, scientificName, english{${cardLocaleProjection}}, french{${cardLocaleProjection}}`;

type GuideTranslation = Partial<Pick<GuideProfile, "title" | "summary" | "body" | "localNames" | "otherNames" | "occurrence" | "plantFacts">> & { gallery?: GuideImage[]; resources?: GuideResource[] };
type RawStory = { englishTitle?: string; frenchTitle?: string; englishSlug?: string; frenchSlug?: string; englishSummary?: string; frenchSummary?: string; image?: string };
type RawGuide = {
  _id: string; slug: string; category: GuideCategoryId; subgroup?: string; habitats?: GuideHabitatId[]; scientificName?: string;
  english?: GuideTranslation; french?: GuideTranslation; relatedStories?: (RawStory | null)[]; _updatedAt?: string;
};

async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const draft = (await draftMode()).isEnabled && hasSanityToken();
  return getSanityClient({ draft }).fetch<T>(groq, params, draft
    ? { cache: "no-store" }
    : { next: { revalidate: 3600, tags: ["atoll"] } });
}
function translation(record: RawGuide | null | undefined, locale: GuideLocale) {
  return locale === "fr" ? record?.french : record?.english;
}
function cleanImages(images: GuideImage[] | undefined): GuideImage[] {
  return (images ?? []).filter((image) => Boolean(image?.url)).map((image) => ({ ...image, alt: image.alt || "" }));
}
function stories(records: (RawStory | null)[] | undefined, locale: GuideLocale): GuideRelatedStory[] {
  return (records ?? []).flatMap((record) => {
    if (!record) return [];
    const title = locale === "fr" ? record.frenchTitle : record.englishTitle;
    const slug = locale === "fr" ? record.frenchSlug : record.englishSlug;
    if (!title || !slug) return [];
    return [{ title, href: `${locale === "fr" ? "/fr" : ""}/impact/${slug}`, summary: locale === "fr" ? record.frenchSummary : record.englishSummary, image: record.image ? { url: record.image, alt: title } : undefined }];
  });
}
function card(record: RawGuide | null | undefined, locale: GuideLocale): GuideCard | null {
  if (!record) return null;
  const content = translation(record, locale);
  if (!content?.title || !record.slug || !guideCategories.includes(record.category)) return null;
  const otherLocale = locale === "en" ? "fr" : "en";
  return {
    id: record._id, locale, slug: record.slug, category: record.category, subgroup: record.subgroup,
    habitats: record.habitats ?? [], title: content.title, scientificName: record.scientificName ?? "",
    localNames: content.localNames, summary: content.summary ?? "", image: cleanImages(content.gallery)[0],
    searchNames: [record.scientificName, record.english?.title, record.french?.title, record.english?.localNames, record.french?.localNames, record.english?.otherNames, record.french?.otherNames].filter((name): name is string => Boolean(name)),
    href: getAtollPath(locale, `${record.category}/${record.slug}`),
    alternateHref: translation(record, otherLocale)?.title ? getAtollPath(otherLocale, `${record.category}/${record.slug}`) : undefined,
  };
}

export const getGuideCards = cache(async (locale: GuideLocale): Promise<GuideCard[]> => {
  if (!hasSanityConfig()) return [];
  const records = await query<RawGuide[]>(`*[_type == "speciesGuide"]{${cardProjection}}`);
  return records.map((record) => card(record, locale)).filter((record): record is GuideCard => record !== null).sort((a, b) => a.title.localeCompare(b.title, locale));
});

export const getGuideProfile = cache(async (locale: GuideLocale, category: string, slug: string): Promise<GuideProfile | null> => {
  if (!hasSanityConfig() || !guideCategories.includes(category as GuideCategoryId)) return null;
  const record = await query<RawGuide | null>(`*[_type == "speciesGuide" && category == $category && slug.current == $slug][0]{
    ${cardProjection}, _updatedAt,
    english{..., "body": body${guideBodyProjection}, "gallery": gallery[]{${imageProjection}}, "resources": resources[]{${resourceProjection}}},
    french{..., "body": body${guideBodyProjection}, "gallery": gallery[]{${imageProjection}}, "resources": resources[]{${resourceProjection}}},
    "relatedStories": relatedStories[]->${storyProjection}
  }`, { category, slug });
  if (!record) return null;
  const summary = card(record, locale);
  const content = translation(record, locale);
  if (!summary || !content) return null;
  return { ...summary, body: content.body ?? [], otherNames: content.otherNames, occurrence: content.occurrence,
    plantFacts: content.plantFacts, gallery: cleanImages(content.gallery), resources: (content.resources ?? []).filter((resource) => resource?.title && resource.url),
    relatedStories: stories(record.relatedStories, locale), updatedAt: record._updatedAt };
});

export const getGuideCategories = cache(async (locale: GuideLocale): Promise<GuideCategory[]> => {
  const cards = await getGuideCards(locale);
  type RawCategory = { category: GuideCategoryId; english?: Partial<GuideCategory>; french?: Partial<GuideCategory>; image?: GuideImage; relatedStories?: RawStory[] };
  const records = hasSanityConfig() ? await query<RawCategory[]>(`*[_type == "atollCategory"]{
    category, english{..., "resources": resources[]{${resourceProjection}}}, french{..., "resources": resources[]{${resourceProjection}}},
    "image": image${standaloneImageProjection}, "relatedStories": relatedStories[]->${storyProjection}
  }`) : [];
  return categoryDefaults[locale].map((fallback) => {
    const raw = records.find((record) => record.category === fallback.id);
    const localized = locale === "fr" ? raw?.french : raw?.english;
    const members = cards.filter((entry) => entry.category === fallback.id);
    return { ...fallback, ...localized, id: fallback.id, count: members.length,
      image: raw?.image?.url ? raw.image : members[0]?.image,
      resources: (localized?.resources ?? []).filter((resource) => resource?.url), relatedStories: stories(raw?.relatedStories, locale) };
  });
});

export const getAtollHub = cache(async (locale: GuideLocale): Promise<AtollHub> => {
  type RawHubContent = Omit<Partial<AtollHub>, "habitats"> & { habitats?: (Omit<AtollHub["habitats"][number], "featuredEntries"> & { featuredEntries?: RawGuide[] })[] };
  type RawHub = { english?: RawHubContent; french?: RawHubContent; image?: GuideImage; featuredEntries?: RawGuide[]; relatedStories?: RawStory[] };
  const raw = hasSanityConfig() ? await query<RawHub | null>(`*[_type == "atollHub" && _id == "atoll-hub"][0]{
    english{..., "experiences": experiences[]{..., "image": image${standaloneImageProjection}}, "habitats": habitats[]{..., "image": image${standaloneImageProjection}, "featuredEntries": featuredEntries[]->{${cardProjection}}}},
    french{..., "experiences": experiences[]{..., "image": image${standaloneImageProjection}}, "habitats": habitats[]{..., "image": image${standaloneImageProjection}, "featuredEntries": featuredEntries[]->{${cardProjection}}}},
    "image": image${standaloneImageProjection}, "featuredEntries": featuredEntries[]->{${cardProjection}}, "relatedStories": relatedStories[]->${storyProjection}
  }`) : null;
  const fallback = hubDefaults[locale];
  const localized = locale === "fr" ? raw?.french : raw?.english;
  const cards = await getGuideCards(locale);
  return { ...fallback, ...localized,
    image: raw?.image?.url ? raw.image : fallback.image,
    habitats: localized?.habitats ? localized.habitats.map((habitat) => ({ ...habitat, image: habitat.image?.url ? habitat.image : cards.find((entry) => entry.habitats.includes(habitat.id))?.image,
      featuredEntries: (habitat.featuredEntries ?? []).map((record) => card(record, locale)).filter((entry): entry is GuideCard => entry !== null),
    })) : fallback.habitats,
    featuredEntries: (raw?.featuredEntries ?? []).map((record) => card(record, locale)).filter((entry): entry is GuideCard => entry !== null),
    relatedStories: stories(raw?.relatedStories, locale) };
});

export const getGuideLegacyRedirect = cache(async (pathname: string): Promise<string | null> => {
  if (!hasSanityConfig()) return null;
  // Resolve only published replacements; a draft must never take over a public URL.
  const record = await getSanityClient().fetch<{ category: string; slug: string; locale?: GuideLocale; english?: { title?: string }; french?: { title?: string } } | null>(
    `*[_type == "speciesGuide" && ($path in legacyPaths || $path in legacyAliases[].path)][0]{category, "slug": slug.current, "locale": legacyAliases[path == $path][0].locale, english{title}, french{title}}`,
    { path: pathname }, { next: { revalidate: 3600, tags: ["atoll"] } },
  );
  if (!record?.slug) {
    const locale = pathname.startsWith("/fr/") ? "fr" : "en";
    const field = locale === "fr" ? "french" : "english";
    const relativePath = locale === "fr" ? pathname.slice(3) : pathname;
    const impactSlug = relativePath.startsWith("/impact/") ? relativePath.slice(8) : "";
    const replacement = await getSanityClient().fetch<{ _id: string; _type: string; category?: string; slug?: string; english?: { title?: string }; french?: { title?: string } } | null>(
      `*[_type == "impactEntry" && defined(guideReplacement->_id) && (
        ($slug != "" && (${field}.slug.current == $slug || (coalesce(language, "en") == $locale && slug.current == $slug))) ||
        ${field}.legacyPath in [$relativePath, $path] || (coalesce(language, "en") == $locale && legacyPath in [$relativePath, $path])
      )][0].guideReplacement->{_id, _type, category, "slug": slug.current, english{title}, french{title}}`,
      { slug: impactSlug, locale, relativePath, path: pathname }, { next: { revalidate: 3600, tags: ["atoll", "impact"] } },
    );
    if (!replacement || !(locale === "fr" ? replacement.french?.title : replacement.english?.title)) return null;
    if (replacement._type === "atollHub") {
      if (replacement._id !== "atoll-hub") return null;
    } else if (!["speciesGuide", "atollCategory"].includes(replacement._type) || !guideCategories.includes(replacement.category as GuideCategoryId) || (replacement._type === "speciesGuide" && !replacement.slug)) {
      return null;
    }
    const suffix = replacement._type === "atollHub" ? "" : replacement._type === "atollCategory" ? replacement.category : `${replacement.category}/${replacement.slug}`;
    const destination = getAtollPath(locale, suffix);
    return destination === pathname ? null : destination;
  }
  if (!guideCategories.includes(record.category as GuideCategoryId)) return null;
  const locale = record.locale ?? (pathname.startsWith("/fr/") ? "fr" : "en");
  if (!(locale === "fr" ? record.french?.title : record.english?.title)) return null;
  const destination = getAtollPath(locale, `${record.category}/${record.slug}`);
  return destination === pathname ? null : destination;
});

export const getGuideSitemapEntries = cache(async (): Promise<GuideSitemapEntry[]> => {
  if (!hasSanityConfig()) return [];
  const records = await getSanityClient().fetch<RawGuide[]>(`*[_type == "speciesGuide"]{_id, "slug": slug.current, category, english{title}, french{title}, _updatedAt}`, {}, { next: { revalidate: 3600, tags: ["atoll"] } });
  return records.flatMap((record) => (["en", "fr"] as const).flatMap((locale) => {
    const entry = card(record, locale);
    if (!entry) return [];
    return [{ path: entry.href, alternatePath: entry.alternateHref, locale, updatedAt: record._updatedAt }];
  }));
});
