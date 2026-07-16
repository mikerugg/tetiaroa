import { defineArrayMember, defineField, defineType } from "sanity";
import { HtmlPackageInput } from "../../components/htmlPackageInput";

export const htmlPackage = defineType({
  name: "htmlPackage",
  title: "Rich HTML package",
  type: "object",
  description:
    "Use a ZIP when this language needs a designed, media-rich layout. It will be published instead of Body.",
  components: { input: HtmlPackageInput },
  fields: [
    defineField({
      name: "archive",
      title: "Source ZIP",
      type: "file",
      options: { accept: "application/zip,.zip" },
    }),
    defineField({
      name: "html",
      title: "Processed HTML",
      type: "text",
      hidden: true,
    }),
    defineField({
      name: "originalFilename",
      title: "Original filename",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "importedAt",
      title: "Imported at",
      type: "datetime",
      hidden: true,
    }),
    defineField({
      name: "imageCount",
      title: "Image count",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "images",
      title: "Imported images",
      type: "array",
      hidden: true,
      of: [
        defineArrayMember({
          name: "htmlPackageImage",
          type: "object",
          fields: [
            defineField({
              name: "originalPath",
              title: "Original path",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "warnings",
      title: "Import warnings",
      type: "array",
      hidden: true,
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "removed",
      title: "Pending removal",
      type: "boolean",
      hidden: true,
    }),
    defineField({
      name: "cleanupAssetIds",
      title: "Assets pending deletion",
      type: "array",
      hidden: true,
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) {
        return true;
      }

      const packageValue = value as {
        archive?: { asset?: { _ref?: string } };
        html?: string;
        removed?: boolean;
      };

      if (packageValue.removed) {
        return true;
      }

      return packageValue.archive?.asset?._ref && packageValue.html
        ? true
        : "This package is incomplete. Upload the ZIP again to rebuild it.";
    }),
});
