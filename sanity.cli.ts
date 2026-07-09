import { defineCliConfig } from "sanity/cli";
import { sanityDataset, sanityProjectId } from "./lib/sanity/env";

export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
  },
  deployment: {
    appId: "yzeis32ltibk30tt2dvnlgwj",
  },
});
