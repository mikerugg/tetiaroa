import type { Metadata } from "next";

import {
  ENGLISH_CONTACT_URL,
  FRENCH_CONTACT_URL,
} from "../language-links";
import { ContactPage } from "./contact-page";
import { contactRouteCopy } from "./contact-route-copy";

const copy = contactRouteCopy.en;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: ENGLISH_CONTACT_URL,
    languages: {
      en: ENGLISH_CONTACT_URL,
      fr: FRENCH_CONTACT_URL,
    },
  },
};

export default function EnglishContact() {
  return <ContactPage locale="en" />;
}
