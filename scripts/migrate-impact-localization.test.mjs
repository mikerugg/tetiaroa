import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocalizedContent,
  createMigrationPlan,
} from "./migrate-impact-localization.mjs";

function entry(id, language, translationKey, overrides = {}) {
  return {
    _id: id,
    _type: "impactEntry",
    language,
    translationKey,
    title: `${language}-${translationKey}`,
    slug: { _type: "slug", current: `${language}-${translationKey}` },
    summary: `${language} summary`,
    entryType: "Article",
    category: "Research",
    publishedAt: "2026-07-15T00:00:00.000Z",
    relatedEntries: [],
    ...overrides,
  };
}

test("buildLocalizedContent keeps localized media and HTML references", () => {
  const source = entry("en-one", "en", "one", {
    heroImage: { asset: { _type: "reference", _ref: "image-one" }, alt: "Alt" },
    htmlPackage: { _type: "htmlPackage", html: "<html></html>" },
  });

  const localized = buildLocalizedContent(source);
  assert.equal(localized._type, "impactEntryLocale");
  assert.equal(localized.title, "en-one");
  assert.equal(localized.heroImage.asset._ref, "image-one");
  assert.equal(localized.htmlPackage.html, "<html></html>");
  assert.equal(localized.entryType, undefined);
});

test("paired entries retain the English id and English shared fields", () => {
  const english = entry("entry-en", "en", "pair", {
    category: "Research",
  });
  const french = entry("entry-fr", "fr", "pair", {
    category: "Education",
  });
  const plan = createMigrationPlan([english, french]);

  assert.deepEqual(plan.counts, {
    sourcePublished: 2,
    canonicalPublished: 1,
    paired: 1,
    englishOnly: 0,
    frenchOnly: 0,
    drafts: 0,
  });
  assert.equal(plan.publishedPatches[0].id, "entry-en");
  assert.equal(plan.publishedPatches[0].fields.category, "Research");
  assert.equal(plan.publishedPatches[0].fields.english.title, "en-pair");
  assert.equal(plan.publishedPatches[0].fields.french.title, "fr-pair");
  assert.deepEqual(plan.redundantPublishedIds, ["entry-fr"]);
  assert.deepEqual(plan.conflicts.map((conflict) => conflict.field), ["category"]);
});

test("single-language entries keep their existing id and leave the other locale empty", () => {
  const englishPlan = createMigrationPlan([entry("entry-en", "en", "english-only")]);
  const frenchPlan = createMigrationPlan([entry("entry-fr", "fr", "french-only")]);

  assert.equal(englishPlan.publishedPatches[0].id, "entry-en");
  assert.ok(englishPlan.publishedPatches[0].fields.english);
  assert.equal(englishPlan.publishedPatches[0].fields.french, undefined);
  assert.equal(frenchPlan.publishedPatches[0].id, "entry-fr");
  assert.ok(frenchPlan.publishedPatches[0].fields.french);
  assert.equal(frenchPlan.publishedPatches[0].fields.english, undefined);
});

test("draft changes survive while the other published locale is retained", () => {
  const english = entry("entry-en", "en", "pair");
  const french = entry("entry-fr", "fr", "pair");
  const englishDraft = entry("drafts.entry-en", "en", "pair", {
    title: "Unpublished English title",
  });
  const plan = createMigrationPlan([english, french], [englishDraft]);

  assert.equal(plan.draftWrites.length, 1);
  assert.equal(plan.draftWrites[0].id, "drafts.entry-en");
  assert.equal(plan.draftWrites[0].fields.english.title, "Unpublished English title");
  assert.equal(plan.draftWrites[0].fields.french.title, "fr-pair");
});

test("related references are remapped to the canonical English id", () => {
  const firstEnglish = entry("first-en", "en", "first");
  const firstFrench = entry("first-fr", "fr", "first");
  const secondEnglish = entry("second-en", "en", "second", {
    relatedEntries: [{ _key: "related", _type: "reference", _ref: "first-fr" }],
  });
  const secondFrench = entry("second-fr", "fr", "second");
  const plan = createMigrationPlan([
    firstEnglish,
    firstFrench,
    secondEnglish,
    secondFrench,
  ]);
  const second = plan.publishedPatches.find((patch) => patch.id === "second-en");

  assert.equal(second.fields.relatedEntries[0]._ref, "first-en");
});
