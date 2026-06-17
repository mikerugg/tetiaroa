import type { Metadata } from "next";

import { HistoryConceptSection } from "../concepts";

export const metadata: Metadata = {
  title: "Living Handoff History Concept | Tetiaroa Society",
  description:
    "A standalone homepage history section concept about Tetiaroa Society carrying Marlon Brando's protection mission forward.",
};

export default function Page() {
  return <HistoryConceptSection slug="living-handoff" />;
}
