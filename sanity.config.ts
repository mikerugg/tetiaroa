import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./lib/sanity/env";
import { ImpactEntryIPlacesAction } from "./sanity/components/impactEntryIPlacesAction";
import { ImpactEntryPreviewAction } from "./sanity/components/impactEntryPreviewAction";
import { schemaTypes } from "./sanity/schemaTypes";
import { AtollPreviewAction } from "./sanity/components/atollPreviewAction";

export default defineConfig({
  name: "tetiaroa",
  title: "Tetiaroa Society Content",
  basePath: "/studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  plugins: [structureTool({ structure: (S) => S.list().title("Content").items([
    S.listItem().title("Atoll Guide").child(S.list().title("Atoll Guide").items([
      S.listItem().title("Atoll homepage").child(S.document().schemaType("atollHub").documentId("atoll-hub")),
      S.documentTypeListItem("atollCategory").title("Guide categories"),
      S.documentTypeListItem("speciesGuide").title("Species profiles"),
    ])), S.divider(),
    ...S.documentTypeListItems().filter((item) => !["atollHub", "atollCategory", "speciesGuide"].includes(item.getId() ?? "")),
  ]) }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previousActions, context) =>
      context.schemaType === "impactEntry"
        ? [
            ...previousActions,
            ImpactEntryIPlacesAction,
            ImpactEntryPreviewAction,
          ]
        : ["speciesGuide", "atollCategory", "atollHub"].includes(context.schemaType)
          ? [...previousActions, AtollPreviewAction]
          : previousActions,
  },
});
