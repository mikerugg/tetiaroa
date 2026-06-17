import type { Metadata } from "next";
import { VowStoryPage } from "../story-pages";

export const metadata: Metadata = {
  title: "Promise Concept | Tetiaroa Society",
  description:
    "A standalone cinematic homepage history concept about Marlon Brando's relationship with Tetiaroa becoming a promise of protection.",
};

export default function Page() {
  return <VowStoryPage />;
}
