import { defineArrayMember, defineField, defineType } from "sanity";
import {
  impactCategories,
  impactEntryTypes,
} from "../../../lib/impact/types";

const categoryOptions = impactCategories.map((category) => ({
  title: category,
  value: category,
}));

export const impactEntry = defineType({
  name: "impactEntry",
  title: "Impact Entry",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "classification", title: "Classification" },
    { name: "legacy", title: "Legacy" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "entryType",
      title: "Entry type",
      type: "string",
      group: "classification",
      options: {
        list: impactEntryTypes.map((type) => ({ title: type, value: type })),
        layout: "radio",
      },
      initialValue: "Article",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Latest update",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "classification",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "classification",
    }),
    defineField({
      name: "metric",
      title: "Feed metric",
      type: "string",
      group: "classification",
      description: "Short proof point shown on the impact feed card.",
    }),
    defineField({
      name: "category",
      title: "Primary category",
      type: "string",
      group: "classification",
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
      group: "classification",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: categoryOptions },
        }),
      ],
      options: { layout: "tags" },
    }),
    defineField({
      name: "tags",
      title: "Feed tags",
      type: "array",
      group: "classification",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "program",
      title: "Program",
      type: "reference",
      group: "classification",
      to: [{ type: "program" }],
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "classification",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "topic" }],
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "caption",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "projectDates",
      title: "Project dates",
      type: "string",
      group: "classification",
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      group: "classification",
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
      group: "classification",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }],
        }),
      ],
    }),
    defineField({
      name: "affiliation",
      title: "Affiliation",
      type: "string",
      group: "classification",
    }),
    defineField({
      name: "relatedEntries",
      title: "Related entries",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "impactEntry" }],
        }),
      ],
    }),
    defineField({
      name: "legacyNodeId",
      title: "Legacy Drupal node ID",
      type: "number",
      group: "legacy",
    }),
    defineField({
      name: "legacyPath",
      title: "Legacy path",
      type: "string",
      group: "legacy",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "entryType",
      media: "heroImage",
    },
  },
});

