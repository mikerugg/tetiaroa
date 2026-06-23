import type { Metadata } from "next";
import { ENGLISH_TEAM_URL, FRENCH_TEAM_URL } from "../language-links";
import { TeamPage } from "./team-page";

export const metadata: Metadata = {
  title: "Our Team | Tetiaroa Society",
  description:
    "Meet the people protecting Tetiaroa through fieldwork, science, education, governance, partnerships, and support.",
  alternates: {
    canonical: ENGLISH_TEAM_URL,
    languages: {
      en: ENGLISH_TEAM_URL,
      fr: FRENCH_TEAM_URL,
    },
  },
};

export default function EnglishTeam() {
  return <TeamPage locale="en" />;
}
