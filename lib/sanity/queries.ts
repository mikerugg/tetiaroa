import { defineQuery } from "next-sanity";

const localizedBodyProjection = `[]{
  ...,
  _type == "image" => {
    ...,
    "url": asset->url,
    "alt": coalesce(alt, asset->altText, ""),
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  _type == "documentLink" => {
    ...,
    "url": coalesce(file.asset->url, url)
  }
}`;

const impactEntryProjection = `
  _id,
  "title": select(
    $language == "fr" => coalesce(french.title, title),
    coalesce(english.title, title)
  ),
  "slug": select(
    $language == "fr" => coalesce(french.slug.current, slug.current),
    coalesce(english.slug.current, slug.current)
  ),
  "language": $language,
  translationKey,
  "alternateSlug": select(
    $language == "fr" => coalesce(
      english.slug.current,
      *[
        _type == "impactEntry" &&
        translationKey == ^.translationKey &&
        coalesce(language, "en") == "en"
      ][0].slug.current
    ),
    coalesce(
      french.slug.current,
      *[
        _type == "impactEntry" &&
        translationKey == ^.translationKey &&
        language == "fr"
      ][0].slug.current
    )
  ),
  entryType,
  "doiUrl": coalesce(iplacesSource.doiUrl, doiUrl),
  "iplacesUrl": iplacesSource.url,
  "iplacesTitle": iplacesSource.title,
  "summary": select(
    $language == "fr" => coalesce(french.summary, summary),
    coalesce(english.summary, summary)
  ),
  category,
  "secondaryCategories": coalesce(secondaryCategories, []),
  "heroImage": select(
    $language == "fr" => coalesce(french.heroImage.asset->url, heroImage.asset->url),
    coalesce(english.heroImage.asset->url, heroImage.asset->url)
  ),
  "heroImageAlt": select(
    $language == "fr" => coalesce(
      french.heroImage.alt,
      french.heroImage.asset->altText,
      heroImage.alt,
      heroImage.asset->altText,
      french.title,
      title
    ),
    coalesce(
      english.heroImage.alt,
      english.heroImage.asset->altText,
      heroImage.alt,
      heroImage.asset->altText,
      english.title,
      title
    )
  ),
  publishedAt,
  updatedAt,
  "status": select(
    $language == "fr" => coalesce(french.status, status),
    coalesce(english.status, status)
  ),
  "location": select(
    $language == "fr" => coalesce(french.location, location),
    coalesce(english.location, location)
  ),
  "metric": select(
    $language == "fr" => coalesce(french.metric, metric),
    coalesce(english.metric, metric)
  ),
  "projectDates": select(
    $language == "fr" => coalesce(french.projectDates, projectDates),
    coalesce(english.projectDates, projectDates)
  ),
  "affiliation": select(
    $language == "fr" => coalesce(french.affiliation, affiliation),
    coalesce(english.affiliation, affiliation)
  ),
  "tags": select(
    $language == "fr" => coalesce(french.tags, tags, []),
    coalesce(english.tags, tags, [])
  ),
  "body": select(
    $language == "fr" => coalesce(french.body, body)${localizedBodyProjection},
    coalesce(english.body, body)${localizedBodyProjection}
  ),
  "htmlPackage": select(
    $language == "fr" => coalesce(french.htmlPackage, htmlPackage),
    coalesce(english.htmlPackage, htmlPackage)
  ),
  "gallery": select(
    $language == "fr" => coalesce(french.gallery, gallery),
    coalesce(english.gallery, gallery)
  )[]{
    "image": image.asset->url,
    "alt": coalesce(alt, image.asset->altText, ""),
    caption
  },
  "program": program->{title, "slug": slug.current},
  "topics": topics[]->{title, "slug": slug.current},
  "team": team[]->{name, role},
  "authors": iplacesSource.authors[]{name, orcid},
  "affiliations": iplacesSource.affiliations[]{name, ror},
  "organizations": organizations[]->{name, url},
  "relatedEntries": relatedEntries[]->{
    "title": select(
      $language == "fr" => coalesce(french.title, title),
      coalesce(english.title, title)
    ),
    "slug": select(
      $language == "fr" => coalesce(french.slug.current, slug.current),
      coalesce(english.slug.current, slug.current)
    ),
    entryType
  },
  legacyNodeId,
  "legacyVid": select(
    $language == "fr" => coalesce(french.legacyVid, legacyVid),
    coalesce(english.legacyVid, legacyVid)
  ),
  legacyBundle,
  "legacyPath": select(
    $language == "fr" => coalesce(french.legacyPath, legacyPath),
    coalesce(english.legacyPath, legacyPath)
  ),
  "seoTitle": select(
    $language == "fr" => coalesce(french.seoTitle, seoTitle),
    coalesce(english.seoTitle, seoTitle)
  ),
  "seoDescription": select(
    $language == "fr" => coalesce(french.seoDescription, seoDescription),
    coalesce(english.seoDescription, seoDescription)
  )
`;

const localizedEntryFilter = `
  (
    $language == "fr" &&
    (
      defined(french.slug.current) ||
      (!defined(french.slug.current) && language == "fr" && defined(slug.current))
    )
  ) ||
  (
    $language == "en" &&
    (
      defined(english.slug.current) ||
      (!defined(english.slug.current) && coalesce(language, "en") == "en" && defined(slug.current))
    )
  )
`;

export const impactEntriesQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    (${localizedEntryFilter})
  ]
  | order(
      coalesce(updatedAt, publishedAt) desc,
      select(
        $language == "fr" => coalesce(french.title, title),
        coalesce(english.title, title)
      ) asc
    ) {
    ${impactEntryProjection}
  }
`);

export const homepageHighlightsQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    "highlight" in topics[]->slug.current &&
    (
      defined(english.slug.current) ||
      defined(french.slug.current) ||
      defined(slug.current)
    )
  ]
  | order(
      coalesce(updatedAt, publishedAt) desc,
      coalesce(english.title, french.title, title) asc
    ) {
    _id,
    "english": {
      "title": coalesce(
        english.title,
        select(coalesce(language, "en") == "en" => title)
      ),
      "slug": coalesce(
        english.slug.current,
        select(coalesce(language, "en") == "en" => slug.current)
      ),
      "summary": coalesce(
        english.summary,
        select(coalesce(language, "en") == "en" => summary)
      ),
      "heroImage": coalesce(
        english.heroImage.asset->url,
        select(coalesce(language, "en") == "en" => heroImage.asset->url)
      ),
      "heroImageAlt": coalesce(
        english.heroImage.alt,
        english.heroImage.asset->altText,
        select(coalesce(language, "en") == "en" => heroImage.alt),
        select(coalesce(language, "en") == "en" => heroImage.asset->altText),
        english.title,
        select(coalesce(language, "en") == "en" => title)
      )
    },
    "french": {
      "title": coalesce(
        french.title,
        select(language == "fr" => title)
      ),
      "slug": coalesce(
        french.slug.current,
        select(language == "fr" => slug.current)
      ),
      "summary": coalesce(
        french.summary,
        select(language == "fr" => summary)
      ),
      "heroImage": coalesce(
        french.heroImage.asset->url,
        select(language == "fr" => heroImage.asset->url)
      ),
      "heroImageAlt": coalesce(
        french.heroImage.alt,
        french.heroImage.asset->altText,
        select(language == "fr" => heroImage.alt),
        select(language == "fr" => heroImage.asset->altText),
        french.title,
        select(language == "fr" => title)
      )
    }
  }
`);

export const impactEntryBySlugQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    (${localizedEntryFilter}) &&
    select(
      $language == "fr" => coalesce(french.slug.current, slug.current),
      coalesce(english.slug.current, slug.current)
    ) == $slug
  ][0] {
    ${impactEntryProjection}
  }
`);

export const impactEntryPreviewByIdQuery = defineQuery(`
  *[_type == "impactEntry" && _id == $id][0] {
    ${impactEntryProjection}
  }
`);

export const impactSitemapEntriesQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    (${localizedEntryFilter})
  ] {
    "slug": select(
      $language == "fr" => coalesce(french.slug.current, slug.current),
      coalesce(english.slug.current, slug.current)
    ),
    "language": $language,
    publishedAt,
    updatedAt,
    _updatedAt
  }
`);

export const impactEntryByLegacyPathQuery = defineQuery(`
  *[
    _type == "impactEntry" &&
    $legacyPath in [english.legacyPath, french.legacyPath, legacyPath]
  ][0] {
    "language": select(
      french.legacyPath == $legacyPath => "fr",
      english.legacyPath == $legacyPath => "en",
      coalesce(language, "en")
    ),
    "slug": select(
      french.legacyPath == $legacyPath => french.slug.current,
      english.legacyPath == $legacyPath => english.slug.current,
      slug.current
    )
  }
`);
