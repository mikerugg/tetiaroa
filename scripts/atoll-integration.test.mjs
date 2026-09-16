import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { impactEntriesQuery, impactSitemapEntriesQuery, homepageHighlightsQuery } from "../lib/sanity/queries.ts";
import { guideBodyProjection } from "../lib/atoll/projections.ts";

const require = createRequire(import.meta.url);
const { parse, evaluate } = createRequire(require.resolve("sanity"))("groq-js");
const translation = (title) => ({ title, slug: { current: title }, summary: title });
const source = (id, replacement) => ({
  _id: id, _type: "impactEntry", english: translation(id), french: translation(id),
  guideReplacement: { _ref: replacement }, topics: [{ _ref: "highlight" }],
});
const query = async (groq, dataset, language = "en") => (await evaluate(parse(groq), { dataset, params: { language } })).get();

test("Impact listings and sitemap retain a language until its guide replacement is reachable", async () => {
  const dataset = [
    { _id: "highlight", slug: { current: "highlight" } },
    source("english-only-source", "english-only"),
    { _id: "english-only", _type: "speciesGuide", category: "birds", slug: { current: "bird" }, english: translation("Bird") },
    source("draft-only-source", "unpublished"),
    { _id: "drafts.unpublished", _type: "speciesGuide", category: "birds", slug: { current: "draft" }, english: translation("Draft") },
    source("missing-slug-source", "missing-slug"),
    { _id: "missing-slug", _type: "speciesGuide", category: "birds", english: translation("No slug") },
    source("invalid-category-source", "invalid-category"),
    { _id: "invalid-category", _type: "speciesGuide", category: "unknown", slug: { current: "unknown" }, english: translation("Unknown") },
    source("category-source", "category"),
    { _id: "category", _type: "atollCategory", category: "plants", english: translation("Plants"), french: translation("Plantes") },
    source("hub-source", "atoll-hub"),
    { _id: "atoll-hub", _type: "atollHub", english: translation("Atoll"), french: translation("Atoll") },
    source("unused-hub-source", "unused-hub"),
    { _id: "unused-hub", _type: "atollHub", english: translation("Unused"), french: translation("Unused") },
  ];
  for (const groq of [impactEntriesQuery, impactSitemapEntriesQuery, homepageHighlightsQuery]) {
    for (const language of ["en", "fr"]) {
      const result = await query(groq, dataset, language);
      const ids = result.map((entry) => entry._id ?? entry.slug).sort();
      assert.deepEqual(ids, ["draft-only-source", "invalid-category-source", "missing-slug-source", "unused-hub-source", ...(language === "fr" ? ["english-only-source"] : [])].sort());
    }
  }
});

test("public and Studio body projection resolve all uploaded media and retain credits", async () => {
  const dataset = [
    { _id: "file-recording", url: "https://cdn.sanity.io/files/example/recording.mp3" },
    { _id: "image-photo", url: "https://cdn.sanity.io/images/example/photo.jpg", altText: "Asset description", metadata: { dimensions: { width: 900, height: 600 } } },
    { _id: "profile", body: [
      ...["audio", "audioEmbed", "audioPlayer", "documentLink", "fileLink"].map((_type) => ({ _type, title: "Recording", file: { asset: { _ref: "file-recording" } }, credit: "Recorded by the source author" })),
      { _type: "image", asset: { _ref: "image-photo" }, caption: "Original caption", credit: "Original photographer", license: "CC BY" },
    ] },
  ];
  const body = await query(`*[_id == "profile"][0].body${guideBodyProjection}`, dataset);
  for (const item of body.slice(0, 5)) {
    assert.equal(item.url, dataset[0].url);
    assert.equal(item.credit, "Recorded by the source author");
  }
  assert.deepEqual({ ...body[5], asset: undefined }, {
    _type: "image", asset: undefined, url: dataset[1].url, alt: "Asset description", width: 900, height: 600,
    caption: "Original caption", credit: "Original photographer", license: "CC BY",
  });
});
