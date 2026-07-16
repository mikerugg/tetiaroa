import assert from "node:assert/strict";
import test from "node:test";
import { buildHomepageHighlights } from "./homepage-highlight.ts";

function localized(title, slug, overrides = {}) {
  return {
    title,
    slug,
    summary: `${title} summary`,
    heroImage: `https://cdn.sanity.io/${slug}.jpg`,
    heroImageAlt: `${title} image`,
    ...overrides,
  };
}

test("keeps Sanity ordering and builds English highlight links", () => {
  const entries = [
    { _id: "newest", english: localized("Newest", "newest") },
    { _id: "older", english: localized("Older", "older") },
  ];

  const highlights = buildHomepageHighlights(entries, "en");

  assert.deepEqual(
    highlights.map(({ id, href }) => ({ id, href })),
    [
      { id: "newest", href: "/impact/newest" },
      { id: "older", href: "/impact/older" },
    ],
  );
});

test("uses the complete French entry on the French homepage", () => {
  const [highlight] = buildHomepageHighlights(
    [
      {
        _id: "bilingual",
        english: localized("English", "english"),
        french: localized("Français", "francais"),
      },
    ],
    "fr",
  );

  assert.equal(highlight.title, "Français");
  assert.equal(highlight.href, "/fr/impact/francais");
  assert.equal(highlight.imageAlt, "Français image");
});

test("falls back to the complete English entry instead of mixing locales", () => {
  const english = localized("English", "english");
  const [highlight] = buildHomepageHighlights(
    [
      {
        _id: "incomplete-french",
        english,
        french: localized("Français", "francais", { heroImage: null }),
      },
    ],
    "fr",
  );

  assert.equal(highlight.title, english.title);
  assert.equal(highlight.summary, english.summary);
  assert.equal(highlight.image, english.heroImage);
  assert.equal(highlight.href, "/impact/english");
});

test("skips entries without a complete eligible locale", () => {
  const highlights = buildHomepageHighlights(
    [
      {
        _id: "missing-image",
        english: localized("Incomplete", "incomplete", { heroImage: null }),
      },
    ],
    "en",
  );

  assert.deepEqual(highlights, []);
});
