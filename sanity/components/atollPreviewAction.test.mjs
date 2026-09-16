import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { atollCopy } from "../../app/atoll/atoll-copy.ts";
import { safeGuideHref } from "../../app/atoll/media-utils.ts";
import { getAtollPath } from "../../lib/atoll/config.ts";
import { guideCategories } from "../../lib/atoll/types.ts";
import { guideBodyProjection } from "../../lib/atoll/projections.ts";

const require = createRequire(import.meta.url);
const { parse, evaluate } = createRequire(require.resolve("sanity"))("groq-js");
// Transpile the actual Studio component without loading the authenticated Studio shell.
const source = await fs.readFile(new URL("./atollPreviewAction.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const exported = {};
const modules = {
  "@sanity/ui": {}, "lucide-react": {}, sanity: {},
  "@/app/atoll/guide-media": {
    GuidePhotograph: ({ image }) => createElement("figure", null, createElement("img", { src: image.url, alt: image.alt }), createElement("figcaption", null, image.credit)),
    GuideBody: () => null,
    GuideResourceView: ({ resource }) => createElement("a", { href: resource.url }, resource.title),
  },
  "@/app/atoll/media-utils": { safeGuideHref },
  "@/lib/atoll/config": { getAtollPath }, "@/lib/atoll/types": { guideCategories },
  "@/lib/sanity/env": { sanityApiVersion: "2026-07-02" },
  "@/app/atoll/atoll-copy": { atollCopy }, "@/lib/atoll/projections": { guideBodyProjection },
};
vm.runInNewContext(compiled, { exports: exported, require: (name) => {
  if (name === "react" || name === "react/jsx-runtime") return require(name);
  assert.ok(Object.hasOwn(modules, name), `Unexpected component dependency: ${name}`);
  return modules[name];
} });
const { atollPreviewQuery, AtollPreviewContent, getAtollPreviewHref } = exported;

const image = (id) => ({ _type: "image", asset: { _ref: id }, alt: `Description ${id}`, credit: `Credit ${id}` });
const gallery = (id) => [{ image: image(id), alt: `Species ${id}` }];
const asset = (id) => ({ _id: id, _type: "sanity.imageAsset", url: `https://cdn.sanity.io/${id}.jpg`, metadata: { dimensions: { width: 900, height: 600 } } });
const reference = (_ref) => ({ _type: "reference", _ref });
const species = { _id: "species-1", _type: "speciesGuide", category: "birds", slug: { current: "sooty-tern" }, scientificName: "Onychoprion fuscatus", english: { title: "Sooty tern", gallery: gallery("species-image") }, french: { title: "Sterne fuligineuse", gallery: gallery("species-image") } };
const related = [
  { _id: "story-en", language: "en", title: "Bird story", slug: { current: "bird-story" }, heroImage: image("story-image") },
  { _id: "story-fr", language: "fr", title: "Histoire des oiseaux", slug: { current: "histoire-oiseaux" }, gallery: [{ image: image("story-image") }] },
];
const localeContent = (locale) => ({
  title: locale === "fr" ? "Titre français inédit" : "Unpublished English title",
  introduction: locale === "fr" ? "Introduction française" : "English introduction",
  habitats: [{ id: "motu-shore", title: locale === "fr" ? "Motu et rivages" : "Motu and shore", introduction: "Habitat introduction", image: image("habitat-image"), featuredEntries: [reference(species._id)] }],
  experiences: [{ title: locale === "fr" ? "Géologie" : "Geology", description: "Experience description", href: getAtollPath(locale, "geology"), linkLabel: locale === "fr" ? "Voir la géologie" : "Explore geology", image: image("experience-image") }],
});
const dataset = [
  ...["hero-image", "habitat-image", "species-image", "experience-image", "story-image"].map(asset),
  species, ...related,
  { _id: "atoll-hub", _type: "atollHub", english: { title: "Published old title" } },
  { _id: "drafts.atoll-hub", _type: "atollHub", image: image("hero-image"), english: localeContent("en"), french: localeContent("fr"), featuredEntries: [reference(species._id)], relatedStories: related.map((story) => reference(story._id)) },
  { _id: "drafts.category", _type: "atollCategory", category: "birds", image: image("hero-image"), english: { title: "Birds", subgroups: [{ id: "seabirds", title: "Seabirds" }] }, french: { title: "Oiseaux", subgroups: [{ id: "seabirds", title: "Oiseaux marins" }], resources: [{ title: "Document français", kind: "document", file: { asset: { _ref: "document-file" } } }] }, relatedStories: related.map((story) => reference(story._id)) },
  { _id: "document-file", _type: "sanity.fileAsset", url: "https://cdn.sanity.io/identification.pdf" },
];
const query = async (id) => (await evaluate(parse(atollPreviewQuery), { dataset, params: { id } })).get();

test("draft hub preview resolves every image and reference and renders the selected language", async () => {
  const record = await query("drafts.atoll-hub");
  assert.equal(record.english.title, "Unpublished English title");
  assert.equal(record.image.credit, "Credit hero-image");
  assert.equal(record.french.habitats[0].image.width, 900);
  assert.equal(record.french.habitats[0].featuredEntries[0].french.image.url, "https://cdn.sanity.io/species-image.jpg");
  for (const locale of ["en", "fr"]) {
    const html = renderToStaticMarkup(createElement(AtollPreviewContent, { record, locale }));
    assert.ok(html.includes(`href="${getAtollPath(locale)}"`));
    for (const id of ["hero-image", "habitat-image", "species-image", "experience-image", "story-image"]) assert.ok(html.includes(`src="https://cdn.sanity.io/${id}.jpg"`), id);
    assert.ok(html.includes(`href="${getAtollPath(locale, "birds/sooty-tern")}"`));
    assert.ok(html.includes(`href="${getAtollPath(locale, "geology")}"`));
    assert.ok(html.includes(locale === "fr" ? "Titre français inédit" : "Unpublished English title"));
    assert.ok(html.includes(locale === "fr" ? 'href="/fr/impact/histoire-oiseaux"' : 'href="/impact/bird-story"'));
    assert.ok(!html.includes(locale === "fr" ? "Bird story" : "Histoire des oiseaux"));
  }
});

test("category preview includes shared image, translated groups, downloads and reading", async () => {
  const record = await query("drafts.category");
  const html = renderToStaticMarkup(createElement(AtollPreviewContent, { record, locale: "fr" }));
  for (const text of ["Oiseaux marins", "Document français", "Histoire des oiseaux", 'href="/fr/island/birds"', 'src="https://cdn.sanity.io/hero-image.jpg"', 'href="https://cdn.sanity.io/identification.pdf"']) assert.ok(html.includes(text), text);
  assert.equal(getAtollPreviewHref({ _type: "speciesGuide", category: "birds" }, "en"), undefined);
  assert.equal(getAtollPreviewHref({ _type: "speciesGuide", category: "unknown", slug: "bird" }, "en"), undefined);
});
