import type { Metadata } from "next";

import {
  ENGLISH_DONATE_URL,
  FRENCH_DONATE_URL,
} from "../language-links";
import { DonatePage } from "./donate-page";
import { donateRouteCopy } from "./donate-route-copy";

const copy = donateRouteCopy.en;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: ENGLISH_DONATE_URL,
    languages: {
      en: ENGLISH_DONATE_URL,
      fr: FRENCH_DONATE_URL,
    },
  },
};

export default function EnglishDonate() {
  return <DonatePage locale="en" />;
}
