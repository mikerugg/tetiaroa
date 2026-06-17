import type { Metadata } from "next";

import { HistoryConceptSection } from "../concepts";

export const metadata: Metadata = {
  title: "Lagoon Witness History Concept | Tetiaroa Society",
  description:
    "A standalone homepage history section concept about Marlon Brando first encountering Tetiaroa as a living atoll worth protecting.",
};

export default function Page() {
  return <HistoryConceptSection slug="lagoon-witness" />;
}
