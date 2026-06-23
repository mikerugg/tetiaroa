import type { Metadata } from "next";
import { ENGLISH_TEAM_URL, FRENCH_TEAM_URL } from "../../language-links";
import { TeamPage } from "../../team/team-page";

export const metadata: Metadata = {
  title: "Notre équipe | Tetiaroa Society",
  description:
    "Découvrez les personnes qui protègent Teti'aroa par la science de terrain, l'éducation, la gouvernance, les partenariats et le soutien quotidien.",
  alternates: {
    canonical: FRENCH_TEAM_URL,
    languages: {
      en: ENGLISH_TEAM_URL,
      fr: FRENCH_TEAM_URL,
    },
  },
};

export default function FrenchTeam() {
  return <TeamPage locale="fr" />;
}
