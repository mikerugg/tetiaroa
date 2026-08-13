import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIPlacesImpactValues,
  htmlToPlainText,
  normalizeIPlacesRecord,
  parseIPlacesArticleUrl,
} from "./iplaces.ts";

const reference = {
  canonicalUrl: "https://iplacesalliance.org/gumpstation/articles/46/",
  groupName: "gumpstation",
  shortId: 46,
};

const apiRecord = {
  id: "e8d8c0cf-7b44-40d1-866f-a1ef62802bee",
  shortId: 46,
  publishedDate: "2026-08-04T23:44:40.411Z",
  meta: { source: "<html><body></body></html>" },
  submission: JSON.stringify({
    $doi: "10.60950/020462c8-1429-429a-a2bb-c418bfcdb6b6",
    $title: "ISP 2026 ESPM 109E iNaturalist Data",
    $abstract: "<p>Coastal observations &amp; biodiversity records.</p>",
    $authors: [
      {
        firstName: "Maya",
        lastName: "Breckenridge",
        orcid: "0009-0001-9026-1241",
        ror: [
          {
            label: "University of California, Berkeley",
            value: "https://ror.org/01an7q238",
          },
        ],
      },
    ],
    $dois: [{ doi: "https://doi.org/10.5281/zenodo.123" }],
    Funding: "Example Foundation",
    datePublished: "2026",
    geolocation: "Moorea, French Polynesia",
    license: "CC-BY-4.0",
    resourcetype: "Project",
    topics: ["Class", "Research"],
  }),
};

test("iPlaces article URLs are validated and canonicalized", () => {
  assert.deepEqual(
    parseIPlacesArticleUrl(
      "http://iplacesalliance.org/GumpStation/articles/46/index.html?utm_source=test",
    ),
    reference,
  );
  assert.throws(
    () => parseIPlacesArticleUrl("https://example.com/gumpstation/articles/46/"),
    /iplacesalliance\.org/,
  );
  assert.throws(
    () => parseIPlacesArticleUrl("https://iplacesalliance.org/gumpstation/people/46/"),
  );
});

test("live-shaped GraphQL records normalize submission metadata", () => {
  const record = normalizeIPlacesRecord(apiRecord, reference);

  assert.equal(record.title, "ISP 2026 ESPM 109E iNaturalist Data");
  assert.equal(
    record.doiUrl,
    "https://doi.org/10.60950/020462c8-1429-429a-a2bb-c418bfcdb6b6",
  );
  assert.equal(record.authors[0].name, "Maya Breckenridge");
  assert.equal(
    record.authors[0].affiliations[0].name,
    "University of California, Berkeley",
  );
  assert.equal(
    record.authors[0].affiliations[0].ror,
    "https://ror.org/01an7q238",
  );
  assert.deepEqual(record.funders, ["Example Foundation"]);
  assert.deepEqual(record.relatedIdentifiers, [
    "https://doi.org/10.5281/zenodo.123",
  ]);
  assert.equal("resourceType" in record, false);
  assert.equal("topics" in record, false);
});

test("HTML abstracts are reduced to clean feed copy", () => {
  assert.equal(
    htmlToPlainText("<p>A reef&nbsp;record with <em>context</em> &amp; care.</p>"),
    "A reef record with context & care.",
  );
});

test("Impact imports leave CMS classifications unchanged", () => {
  const record = normalizeIPlacesRecord(apiRecord, reference);
  const body = [
    {
      _key: "body-1",
      _type: "block",
      children: [],
      markDefs: [],
      style: "normal",
    },
  ];
  const values = buildIPlacesImpactValues(
    record,
    {
      english: {
        _type: "impactEntryLocale",
        affiliation: "Legacy duplicate affiliation",
        title: "How students read a living coastline",
        slug: {
          _type: "slug",
          current: "how-students-read-a-living-coastline",
        },
        seoTitle: "A field class with consequences",
        summary: "An editor-written summary.",
        tags: ["Class", "Editor-created tag", "Research"],
      },
      category: "News",
      entryType: "Article",
      iplacesSource: {
        topics: ["Class", "Research"],
        resourceType: "Project",
      },
      secondaryCategories: ["Culture"],
    },
    {
      body,
      importedAt: "2026-08-12T00:00:00.000Z",
    },
  );
  const english = values.english;

  assert.equal("entryType" in values, false);
  assert.equal("category" in values, false);
  assert.equal("secondaryCategories" in values, false);
  assert.equal(english.summary, "An editor-written summary.");
  assert.equal(english.title, "How students read a living coastline");
  assert.equal(
    english.slug.current,
    "how-students-read-a-living-coastline",
  );
  assert.equal(english.seoTitle, "A field class with consequences");
  assert.deepEqual(english.body, body);
  assert.equal("affiliation" in english, false);
  assert.deepEqual(english.tags, ["Editor-created tag"]);
  assert.equal(values.iplacesSource.groupName, "gumpstation");
  assert.equal(
    values.iplacesSource.title,
    "ISP 2026 ESPM 109E iNaturalist Data",
  );
  assert.equal(
    values.iplacesSource.doiUrl,
    "https://doi.org/10.60950/020462c8-1429-429a-a2bb-c418bfcdb6b6",
  );
  assert.equal(values.iplacesSource.authors[0].orcid, "0009-0001-9026-1241");
  assert.deepEqual(values.iplacesSource.affiliations[0], {
    _key: "affiliation-0",
    _type: "iplacesAffiliation",
    name: "University of California, Berkeley",
    ror: "https://ror.org/01an7q238",
  });
  assert.equal("resourceType" in values.iplacesSource, false);
  assert.equal("topics" in values.iplacesSource, false);
});

test("replace mode refreshes fields previously edited in Sanity", () => {
  const record = normalizeIPlacesRecord(apiRecord, reference);
  const values = buildIPlacesImpactValues(
    record,
    {
      category: "News",
      english: {
        _type: "impactEntryLocale",
        summary: "Old summary",
        title: "Old title",
        slug: { _type: "slug", current: "old-title" },
        seoTitle: "Old SEO title",
      },
    },
    { body: [], replaceExisting: true },
  );

  assert.equal("category" in values, false);
  assert.equal(values.english.title, "Old title");
  assert.equal(values.english.slug.current, "old-title");
  assert.equal(values.english.seoTitle, "Old SEO title");
  assert.equal(
    values.english.summary,
    "Coastal observations & biodiversity records.",
  );
});

test("body imports do not repeat the Impact Entry title", () => {
  const record = normalizeIPlacesRecord(apiRecord, reference);
  const values = buildIPlacesImpactValues(
    record,
    {},
    {
      body: [
        {
          _key: "title",
          _type: "block",
          children: [
            {
              _key: "title-text",
              _type: "span",
              marks: [],
              text: "ISP 2026 ESPM 109E iNaturalist Data",
            },
          ],
          markDefs: [],
          style: "h2",
        },
        {
          _key: "body",
          _type: "block",
          children: [],
          markDefs: [],
          style: "normal",
        },
      ],
    },
  );

  assert.deepEqual(
    values.english.body.map((block) => block._key),
    ["body"],
  );
  assert.equal("title" in values.english, false);
  assert.equal("slug" in values.english, false);
  assert.equal("seoTitle" in values.english, false);
  assert.equal(
    values.iplacesSource.title,
    "ISP 2026 ESPM 109E iNaturalist Data",
  );
});
