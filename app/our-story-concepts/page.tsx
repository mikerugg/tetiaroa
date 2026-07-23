import type { Metadata } from "next";
import { ConceptsPage } from "./concepts-page";

export const metadata: Metadata = {
  title: "Our Story Homepage Concepts | Tetiaroa Society",
  description:
    "Three creative homepage directions for introducing Tetiaroa Society's story.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ConceptsPage />;
}
