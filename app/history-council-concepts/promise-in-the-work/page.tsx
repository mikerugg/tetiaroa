import type { Metadata } from "next";

import { CouncilHistorySection } from "../council-concepts";

export const metadata: Metadata = {
  title: "Promise in the Work | Tetiaroa Society",
  description:
    "A council-approved history section concept about Tetiaroa Society carrying Marlon Brando's protection promise into daily fieldwork.",
};

export default function Page() {
  return <CouncilHistorySection slug="promise-in-the-work" />;
}
