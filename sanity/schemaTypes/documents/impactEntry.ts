import { defineArrayMember, defineField, defineType } from "sanity";
import {
  impactCategories,
  impactEntryTypes,
} from "../../../lib/impact/types";
import { validateDoiUrl } from "../../../lib/impact/doi";
import { MailchimpHtmlExportInput } from "../../components/mailchimpHtmlExportInput";

const categoryOptions = impactCategories.map((category) => ({
  title: category,
  value: category,
}));

export const impactEntry = defineType({
  name: "impactEntry",
  title: "Impact Entry",
  type: "document",
  groups: [
    { name: "english", title: "English", default: true },
    { name: "french", title: "French" },
    { name: "mailchimp", title: "Mailchimp" },
    { name: "shared", title: "Shared" },
    { name: "legacy", title: "Legacy" },
  ],
  initialValue: {
    entryType: "Article",
    english: { _type: "impactEntryLocale" },
    french: { _type: "impactEntryLocale" },
  },
  fields: [
    defineField({
      name: "english",
      title: "English content",
      type: "impactEntryLocale",
      group: "english",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "french",
      title: "French content",
      type: "impactEntryLocale",
      group: "french",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mailchimpExport",
      title: "Bilingual Mailchimp HTML",
      type: "string",
      group: "mailchimp",
      components: { input: MailchimpHtmlExportInput },
    }),
    defineField({
      name: "entryType",
      title: "Entry type",
      type: "string",
      group: "shared",
      options: {
        list: impactEntryTypes.map((type) => ({ title: type, value: type })),
        layout: "radio",
      },
      initialValue: "Article",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Primary category",
      type: "string",
      group: "shared",
      options: {
        list: categoryOptions,
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCategories",
      title: "Secondary categories",
      type: "array",
      group: "shared",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: categoryOptions },
        }),
      ],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "shared",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Latest update",
      type: "datetime",
      group: "shared",
    }),
    defineField({
      name: "doiUrl",
      title: "DOI URL",
      type: "url",
      group: "shared",
      description:
        "Paste the publication's full DOI link, for example https://doi.org/10.1234/example.",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .custom((value) => validateDoiUrl(value)),
    }),
    defineField({
      name: "program",
      title: "Program",
      type: "reference",
      group: "shared",
      to: [{ type: "program" }],
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "shared",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "topic" }],
        }),
      ],
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      group: "shared",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
        }),
      ],
    }),
    defineField({
      name: "organizations",
      title: "Organizations",
      type: "array",
      group: "shared",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }],
        }),
      ],
    }),
    defineField({
      name: "relatedEntries",
      title: "Related entries",
      type: "array",
      group: "shared",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "impactEntry" }],
        }),
      ],
    }),
    defineField({
      name: "translationKey",
      title: "Legacy translation key",
      type: "string",
      group: "legacy",
      readOnly: true,
      hidden: ({ value }) => !value,
      description: "Retained as migration provenance for older entries.",
    }),
    defineField({
      name: "legacyNodeId",
      title: "Legacy Drupal node ID",
      type: "number",
      group: "legacy",
    }),
    defineField({
      name: "legacyBundle",
      title: "Legacy Drupal bundle",
      type: "string",
      group: "legacy",
    }),
  ],
  preview: {
    select: {
      englishTitle: "english.title",
      frenchTitle: "french.title",
      legacyTitle: "title",
      entryType: "entryType",
      englishMedia: "english.heroImage",
      frenchMedia: "french.heroImage",
      legacyMedia: "heroImage",
    },
    prepare(selection) {
      const title =
        selection.englishTitle ?? selection.frenchTitle ?? selection.legacyTitle;
      const languages = [
        selection.englishTitle ? "EN" : "",
        selection.frenchTitle ? "FR" : "",
      ].filter(Boolean);

      return {
        title: title ?? "Untitled impact entry",
        subtitle: [languages.join(" + "), selection.entryType]
          .filter(Boolean)
          .join(" / "),
        media:
          selection.englishMedia ??
          selection.frenchMedia ??
          selection.legacyMedia,
      };
    },
  },
});
