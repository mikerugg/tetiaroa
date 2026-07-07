import { defineQuery } from "next-sanity";

const impactEntryProjection = `
  _id,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  translationKey,
  entryType,
  summary,
  category,
  "secondaryCategories": coalesce(secondaryCategories, []),
  "heroImage": heroImage.asset->url,
  "heroImageAlt": coalesce(heroImage.alt, heroImage.asset->altText, title),
  publishedAt,
  updatedAt,
  status,
  location,
  metric,
  projectDates,
  affiliation,
  "tags": coalesce(tags, []),
  body[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "alt": coalesce(alt, asset->altText, "")
    },
    _type == "documentLink" => {
      ...,
      "url": coalesce(file.asset->url, url)
    }
  },
  gallery[]{
    "image": image.asset->url,
    "alt": coalesce(alt, image.asset->altText, ""),
    caption
  },
  "program": program->{title, "slug": slug.current},
  "topics": topics[]->{title, "slug": slug.current},
  "team": team[]->{name, role},
  "organizations": organizations[]->{name, url},
  "relatedEntries": relatedEntries[]->{title, "slug": slug.current, entryType},
  legacyNodeId,
  legacyVid,
  legacyBundle,
  legacyPath,
  seoTitle,
  seoDescription
`;

export const impactEntriesQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    defined(slug.current) &&
    coalesce(language, "en") == $language
  ]
  | order(coalesce(updatedAt, publishedAt) desc, title asc) {
    ${impactEntryProjection}
  }
`);

export const impactEntryBySlugQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    slug.current == $slug &&
    coalesce(language, "en") == $language
  ][0] {
    ${impactEntryProjection}
  }
`);

export const impactSlugsQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    defined(slug.current) &&
    coalesce(language, "en") == $language
  ] {
    "slug": slug.current
  }
`);

export const impactEntryByLegacyPathQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    legacyPath == $legacyPath &&
    defined(slug.current)
  ][0] {
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);
