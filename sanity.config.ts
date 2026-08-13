import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./lib/sanity/env";
import { ImpactEntryIPlacesAction } from "./sanity/components/impactEntryIPlacesAction";
import { ImpactEntryPreviewAction } from "./sanity/components/impactEntryPreviewAction";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "tetiaroa",
  title: "Tetiaroa Society Content",
  basePath: "/studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  plugins: [structureTool(), visionTool()],
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
        : previousActions,
  },
});
