import type { ImpactLanguage } from "./types";

export type HomepageHighlightLocaleSource = {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
};

export type HomepageHighlightSource = {
  _id: string;
  english?: HomepageHighlightLocaleSource | null;
  french?: HomepageHighlightLocaleSource | null;
};

export type HomepageHighlight = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  href: string;
};

function normalizeHomepageHighlightLocale(
  value: HomepageHighlightLocaleSource | null | undefined,
) {
  const title = value?.title?.trim();
  const slug = value?.slug?.trim();
  const summary = value?.summary?.trim();
  const image = value?.heroImage?.trim();

  if (!title || !slug || !summary || !image) {
    return null;
  }

  return {
    title,
    slug,
    summary,
    image,
    imageAlt: value?.heroImageAlt?.trim() || title,
  };
}

export function buildHomepageHighlights(
  entries: HomepageHighlightSource[],
  language: ImpactLanguage,
): HomepageHighlight[] {
  return entries.flatMap((entry) => {
    const french = normalizeHomepageHighlightLocale(entry.french);
    const english = normalizeHomepageHighlightLocale(entry.english);
    const localized = language === "fr" ? (french ?? english) : english;

    if (!localized) {
      return [];
    }

    const usesFrench = language === "fr" && localized === french;

    return [
      {
        id: entry._id,
        title: localized.title,
        summary: localized.summary,
        image: localized.image,
        imageAlt: localized.imageAlt,
        href: usesFrench
          ? `/fr/impact/${localized.slug}`
          : `/impact/${localized.slug}`,
      },
    ];
  });
}
