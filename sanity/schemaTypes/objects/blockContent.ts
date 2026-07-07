import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
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
    }),
    defineArrayMember({
      name: "callout",
      title: "Callout",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          title: "title",
          subtitle: "text",
        },
      },
    }),
    defineArrayMember({
      name: "statBlock",
      title: "Stat block",
      type: "object",
      fields: [
        defineField({
          name: "value",
          title: "Value",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          title: "value",
          subtitle: "label",
        },
      },
    }),
    defineArrayMember({
      name: "videoEmbed",
      title: "Video embed",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (rule) =>
            rule.required().uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
      preview: {
        select: {
          title: "url",
          subtitle: "caption",
        },
      },
    }),
    defineArrayMember({
      name: "documentLink",
      title: "Document link",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "file",
          title: "Uploaded file",
          type: "file",
        }),
      ],
      preview: {
        select: {
          title: "title",
          subtitle: "url",
        },
      },
    }),
  ],
});
