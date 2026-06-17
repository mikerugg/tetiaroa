import type { Metadata } from "next";
import { WorkStoryPage } from "../story-pages";

export const metadata: Metadata = {
  title: "Living Mission Concept | Tetiaroa Society",
  description:
    "A standalone cinematic homepage history concept about Tetiaroa Society carrying Marlon Brando's promise into field work.",
};

export default function Page() {
  return <WorkStoryPage />;
}
