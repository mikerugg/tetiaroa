import type { Metadata } from "next";
import { FirstSightStoryPage } from "../story-pages";

export const metadata: Metadata = {
  title: "Camera Concept | Tetiaroa Society",
  description:
    "A standalone cinematic homepage history concept about Marlon Brando encountering Tetiaroa and the responsibility it awakened.",
};

export default function Page() {
  return <FirstSightStoryPage />;
}
