import { defineArrayMember, defineField, defineType } from "sanity";
import { validateDoiUrl } from "../../../lib/impact/doi";

export const iplacesSource = defineType({
  name: "iplacesSource",
  title: "iPlaces source",
  type: "object",
  description: "Details saved from the latest iPlaces import.",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "url",
      title: "Article URL",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Article title",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "groupName",
      title: "Station",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "shortId",
      title: "Article number",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "doiUrl",
      title: "DOI URL",
      type: "url",
      readOnly: true,
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .custom((value) => validateDoiUrl(value)),
    }),
    defineField({
      name: "manuscriptId",
      title: "iPlaces record ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "sourcePublishedAt",
      title: "Published on iPlaces",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "importedAt",
      title: "Last imported from iPlaces",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "license",
      title: "License",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          name: "iplacesAuthor",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "orcid", title: "ORCID", type: "string" }),
            defineField({
              name: "affiliations",
              title: "Affiliations",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "orcid" },
          },
        }),
      ],
    }),
    defineField({
      name: "affiliations",
      title: "Affiliations",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          name: "iplacesAffiliation",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "ror", title: "ROR", type: "url" }),
          ],
          preview: {
            select: { title: "name", subtitle: "ror" },
          },
        }),
      ],
    }),
    defineField({
      name: "funders",
      title: "Funders",
      type: "array",
      readOnly: true,
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "relatedIdentifiers",
      title: "Related identifiers",
      type: "array",
      readOnly: true,
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
});
