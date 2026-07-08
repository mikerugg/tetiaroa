import type { Metadata } from "next";

import {
  ENGLISH_DONATE_URL,
  FRENCH_DONATE_URL,
} from "../../language-links";
import { DonatePage } from "../../donate/donate-page";
import { donateRouteCopy } from "../../donate/donate-route-copy";

const copy = donateRouteCopy.fr;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: FRENCH_DONATE_URL,
    languages: {
      en: ENGLISH_DONATE_URL,
      fr: FRENCH_DONATE_URL,
    },
  },
};

export default function FrenchDonate() {
  return <DonatePage locale="fr" />;
}
