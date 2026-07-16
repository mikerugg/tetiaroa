import type { Metadata } from "next";
import HomeExperience from "../home-experience";
import { ENGLISH_HOME_URL, FRENCH_HOME_URL } from "../language-links";
import { getHomepageHighlights } from "@/lib/sanity/impact";

export const metadata: Metadata = {
  title: "Tetiaroa Society | Français",
  description:
    "Sauver l'île. Sauver le monde. Conservation, éducation et recherche sur l'atoll de Tetiaroa.",
  alternates: {
    canonical: FRENCH_HOME_URL,
    languages: {
      en: ENGLISH_HOME_URL,
      fr: FRENCH_HOME_URL,
    },
  },
};

export default async function FrenchHome() {
  const highlights = await getHomepageHighlights("fr");

  return <HomeExperience locale="fr" highlights={highlights} />;
}
