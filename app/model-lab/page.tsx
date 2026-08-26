import type { Metadata } from "next";
import { ModelLab, type ModelName, type ViewName } from "./model-lab";

export const metadata: Metadata = {
  title: "Model lab",
  // A build tool, not a page anyone should find.
  robots: { index: false, follow: false },
};

const MODELS = new Set([
  "whale",
  "squid",
  "jellyfish",
  "giant-jack",
  "sea-turtle",
  "shark",
  "pipe-intake",
  "submersible",
  "starfish",
  "coral-branching",
  "coral-mound",
  "coral-plate",
  "sea-fan",
  "sponge",
  "sea-whip",
  "algae",
]);
const VIEWS = new Set(["side", "front", "back", "top", "quarter"]);

export default async function ModelLabPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const model = typeof params.model === "string" ? params.model : "";
  const view = typeof params.view === "string" ? params.view : "";

  return (
    <ModelLab
      initialModel={(MODELS.has(model) ? model : "whale") as ModelName}
      initialView={(VIEWS.has(view) ? view : "side") as ViewName}
    />
  );
}
