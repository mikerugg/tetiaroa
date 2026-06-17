import type { Metadata } from "next";
import HomeExperience from "./home-experience";
import { ENGLISH_HOME_URL, FRENCH_HOME_URL } from "./language-links";

export const metadata: Metadata = {
  alternates: {
    canonical: ENGLISH_HOME_URL,
    languages: {
      en: ENGLISH_HOME_URL,
      fr: FRENCH_HOME_URL,
    },
  },
};

export default function Home() {
  return <HomeExperience />;
}
