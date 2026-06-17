import type { Metadata } from "next";

import { HistoryConceptSection } from "../concepts";

export const metadata: Metadata = {
  title: "Archive Vow History Concept | Tetiaroa Society",
  description:
    "A standalone homepage history section concept about Marlon Brando's promise to protect Tetiaroa.",
};

export default function Page() {
  return <HistoryConceptSection slug="archive-vow" />;
}
