import { defineArrayMember, defineField, defineType } from "sanity";
import { guideCategories, guideHabitats } from "../../../lib/atoll/types";
import { categoryLabels, habitatLabels, subgroupLabels } from "../../../lib/atoll/config";

const categoryOptions = guideCategories.map((value) => ({ value, title: categoryLabels.en[value] }));
const localizedGroups = [{ name: "english", title: "English", default: true }, { name: "french", title: "Français" }, { name: "shared", title: "Shared" }, { name: "source", title: "Migration record" }];
const imageFields = [
  defineField({ name: "alt", title: "Image description", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "caption", title: "Caption", type: "text", rows: 2 }),
  defineField({ name: "credit", title: "Photographer / credit", type: "string" }),
  defineField({ name: "license", title: "License / rights note", type: "string" }),
];
const gallery = defineField({ name: "gallery", title: "Photographs", description: "The first photograph is used on the card and at the top of the profile.", type: "array", of: [defineArrayMember({ type: "object", name: "guidePhotograph", fields: [defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }), ...imageFields], preview: { select: { title: "caption", subtitle: "credit", media: "image" } } })] });
const resources = defineField({ name: "resources", title: "Sources, recordings and downloads", type: "array", of: [defineArrayMember({ type: "object", name: "guideResource", fields: [
  defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "kind", type: "string", options: { list: ["source", "document", "audio", "video"] }, initialValue: "source" }),
  defineField({ name: "url", title: "External URL", type: "url", validation: (rule) => rule.uri({ allowRelative: true, scheme: ["https", "http"] }) }),
  defineField({ name: "pageUrl", title: "Video watch page", type: "url", description: "Public provider page, available alongside the embedded player." }),
  defineField({ name: "file", title: "Uploaded document or recording", type: "file" }),
  defineField({ name: "credit", type: "string" }),
], validation: (rule) => rule.custom((value) => value?.url || value?.file ? true : "Add a URL or an uploaded file."), preview: { select: { title: "title", subtitle: "kind" } } })] });
const relatedStories = defineField({ name: "relatedStories", title: "Related Impact stories", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "impactEntry" }] })] });

export const guideProfileLocale = defineType({
  name: "guideProfileLocale", title: "Profile translation", type: "object", fields: [
    defineField({ name: "title", title: "Common name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Introduction", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "localNames", title: "Local names", type: "text", rows: 2, description: "Keep regional qualifiers and spelling. Do not label every Polynesian name as Tahitian." }),
    defineField({ name: "otherNames", title: "Other common names", type: "text", rows: 2 }),
    defineField({ name: "occurrence", title: "Occurrence context", type: "text", rows: 3, description: "Distinguish a record at Tetiaroa from a distribution in French Polynesia or the wider Pacific." }),
    defineField({ name: "body", title: "Profile", type: "blockContent" }),
    defineField({ name: "plantFacts", title: "Plant facts", type: "object", fields: [
      defineField({ name: "family", type: "string" }), defineField({ name: "biogeographicalStatus", type: "string" }), defineField({ name: "lifeForm", type: "string" }), defineField({ name: "abundance", title: "Abundance on Tetiaroa", type: "string" }), defineField({ name: "ecosystem", title: "Ecosystem on Tetiaroa", type: "string" }),
    ] }), gallery, resources,
  ],
});

export const speciesGuide = defineType({
  name: "speciesGuide", title: "Species profile", type: "document", groups: localizedGroups,
  fields: [
    defineField({ name: "english", type: "guideProfileLocale", group: "english", validation: (rule) => rule.required() }),
    defineField({ name: "french", type: "guideProfileLocale", group: "french", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Profile URL", type: "slug", group: "shared", description: "Existing profiles retain their legacy spelling and capitalization. Changing this requires a redirect.", options: { source: "english.title" }, validation: (rule) => rule.required() }),
    defineField({ name: "scientificName", type: "string", group: "shared" }),
    defineField({ name: "category", type: "string", group: "shared", options: { list: categoryOptions }, validation: (rule) => rule.required() }),
    defineField({ name: "subgroup", type: "string", group: "shared", options: { list: Object.entries(subgroupLabels.en).map(([value, title]) => ({ value, title })) } }),
    defineField({ name: "habitats", title: "Supported habitat tags", type: "array", group: "shared", description: "Only select habitats supported by the source. A habitat tag is not a sighting record.", of: [defineArrayMember({ type: "string" })], options: { list: guideHabitats.map((value) => ({ value, title: habitatLabels.en[value] })) } }),
    { ...relatedStories, group: "shared" },
    defineField({ name: "reviewedAt", title: "Last content review", type: "datetime", group: "shared" }),
    defineField({ name: "sourceNodeId", type: "number", group: "source", readOnly: true }),
    defineField({ name: "sourceSnapshot", title: "Source snapshot", type: "text", group: "source", readOnly: true }),
    defineField({ name: "migrationFieldHashes", title: "Migration field fingerprints", type: "text", group: "source", readOnly: true }),
    defineField({ name: "sourceCoverage", title: "Source coverage", type: "array", of: [defineArrayMember({ type: "string" })], group: "source", readOnly: true }),
    defineField({ name: "editorialNotes", type: "array", of: [defineArrayMember({ type: "text" })], group: "source", readOnly: true }),
    defineField({ name: "legacyPaths", type: "array", of: [defineArrayMember({ type: "string" })], group: "source", readOnly: true }),
    defineField({ name: "legacyAliases", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "path", type: "string" }), defineField({ name: "locale", type: "string", options: { list: ["en", "fr"] } })] })], group: "source", readOnly: true }),
    defineField({ name: "legacyImpactIds", type: "array", of: [defineArrayMember({ type: "string" })], group: "source", readOnly: true }),
  ], preview: { select: { title: "english.title", subtitle: "scientificName", media: "english.gallery.0.image" } },
});

export const atollCategory = defineType({
  name: "atollCategory", title: "Guide category", type: "document", fields: [
    defineField({ name: "category", type: "string", options: { list: categoryOptions }, validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, fields: imageFields }),
    ...(["english", "french"] as const).map((name) => defineField({ name, type: "object", fields: [
      defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "introduction", type: "text", rows: 4 }),
      defineField({ name: "subgroups", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "id", type: "string" }), defineField({ name: "title", type: "string" })] })] }), resources,
    ] })), relatedStories,
  ], preview: { select: { title: "english.title", subtitle: "category", media: "image" } },
});

export const atollHub = defineType({
  name: "atollHub", title: "Atoll homepage", type: "document", fields: [
    defineField({ name: "image", title: "Hero photograph", type: "image", options: { hotspot: true }, fields: imageFields }),
    ...(["english", "french"] as const).map((name) => defineField({ name, type: "object", fields: [
      defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "introduction", type: "text", rows: 4 }),
      defineField({ name: "habitats", type: "array", of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "id", type: "string", options: { list: guideHabitats.map((value) => ({ value, title: habitatLabels.en[value] })) } }),
        defineField({ name: "title", type: "string" }), defineField({ name: "introduction", type: "text", rows: 3 }),
        defineField({ name: "image", type: "image", options: { hotspot: true }, fields: imageFields }),
        defineField({ name: "featuredEntries", title: "Habitat examples", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "speciesGuide" }] })] }),
      ] })] }),
      defineField({ name: "experiences", title: "Atoll destinations", description: "Images and short captions for Species (/island/guide), Geology and SWAC. French links use /fr/island. The homepage always presents these three destinations in that order.", type: "array", of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "description", title: "Short caption", description: "One brief sentence, readable beside the image on a phone.", type: "text", rows: 2 }),
        defineField({ name: "href", title: "Link", type: "url", validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ["https", "http"] }) }),
        defineField({ name: "linkLabel", title: "Link label", type: "string" }),
        defineField({ name: "image", type: "image", options: { hotspot: true }, fields: imageFields }),
      ] })] }),
    ] })),
    defineField({ name: "featuredEntries", title: "Featured profiles", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "speciesGuide" }] })] }), relatedStories,
  ], preview: { select: { title: "english.title", media: "image" } },
});
