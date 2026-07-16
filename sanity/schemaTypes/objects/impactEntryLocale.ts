import {
  defineArrayMember,
  defineField,
  defineType,
  getPublishedId,
} from "sanity";

function getLocaleFromPath(path: readonly unknown[] | undefined) {
  return path?.[0] === "french" ? "fr" : "en";
}

export const impactEntryLocale = defineType({
  name: "impactEntryLocale",
  title: "Localized content",
  type: "object",
  options: { collapsible: false },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (_document, context) => {
          const parent = context.parent as { title?: string } | undefined;
          return parent?.title ?? "";
        },
        maxLength: 120,
        isUnique: async (slug, context) => {
          const documentId = context.document?._id;

          if (!documentId) {
            return true;
          }

          const publishedId = getPublishedId(documentId);
          const language = getLocaleFromPath(context.path);
          const localizedSlugPath = language === "fr" ? "french.slug.current" : "english.slug.current";
          const legacyLanguageFilter =
            language === "fr"
              ? 'language == "fr"'
              : 'coalesce(language, "en") == "en"';

          return context
            .getClient({ apiVersion: "2026-07-02" })
            .fetch<boolean>(
              `!defined(*[
                _type == "impactEntry" &&
                !sanity::versionOf($publishedId) &&
                (
                  ${localizedSlugPath} == $slug ||
                  (!defined(${localizedSlugPath}) && ${legacyLanguageFilter} && slug.current == $slug)
                )
              ][0]._id)`,
              {
                slug,
                publishedId,
              },
            );
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Shown on the Impact Feed.",
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
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
      name: "status",
      title: "Status",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "metric",
      title: "Feed metric",
      type: "string",
      description: "Short proof point shown on the Impact Feed card.",
    }),
    defineField({
      name: "tags",
      title: "Feed tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "htmlPackage",
      title: "Rich HTML package",
      type: "htmlPackage",
      description:
        "Upload a ZIP containing email.html and its images folder. This replaces Body for this language.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
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
    }),
    defineField({
      name: "affiliation",
      title: "Affiliation",
      type: "string",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "legacyVid",
      title: "Legacy Drupal revision ID",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "legacyPath",
      title: "Legacy path",
      type: "string",
      hidden: true,
    }),
  ],
});
