import type { Metadata } from "next";

import {
  ENGLISH_CONTACT_URL,
  FRENCH_CONTACT_URL,
} from "../../language-links";
import { ContactPage } from "../../contact/contact-page";
import { contactRouteCopy } from "../../contact/contact-route-copy";

const copy = contactRouteCopy.fr;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: FRENCH_CONTACT_URL,
    languages: {
      en: ENGLISH_CONTACT_URL,
      fr: FRENCH_CONTACT_URL,
    },
  },
};

export default function FrenchContact() {
  return <ContactPage locale="fr" />;
}
