import type { Metadata } from "next";

import { CouncilHistorySection } from "../council-concepts";

export const metadata: Metadata = {
  title: "Changed by the Atoll | Tetiaroa Society",
  description:
    "A council-approved history section concept about Marlon Brando's relationship with Tetiaroa changing ownership into stewardship.",
};

export default function Page() {
  return <CouncilHistorySection slug="changed-by-the-atoll" />;
}
