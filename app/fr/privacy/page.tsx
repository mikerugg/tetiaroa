import type { Metadata } from "next";
import {
  ENGLISH_PRIVACY_URL,
  FRENCH_PRIVACY_URL,
} from "../../language-links";
import { PrivacyPage } from "../../privacy/privacy-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Tetiaroa Society",
  description:
    "Découvrez comment Tetiaroa Society recueille, utilise, protège et gère les données personnelles.",
  alternates: {
    canonical: FRENCH_PRIVACY_URL,
    languages: {
      en: ENGLISH_PRIVACY_URL,
      fr: FRENCH_PRIVACY_URL,
    },
  },
};

export default function FrenchPrivacy() {
  return <PrivacyPage locale="fr" />;
}
