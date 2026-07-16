import type { Metadata } from "next";
import {
  ENGLISH_EMAIL_LIST_URL,
  FRENCH_EMAIL_LIST_URL,
} from "../../language-links";
import { EmailListPage } from "../../email-list/email-list-page";
import { emailListRouteCopy } from "../../email-list/email-list-route-copy";

const copy = emailListRouteCopy.fr;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: FRENCH_EMAIL_LIST_URL,
    languages: {
      en: ENGLISH_EMAIL_LIST_URL,
      fr: FRENCH_EMAIL_LIST_URL,
    },
  },
};

export default function FrenchEmailList() {
  return <EmailListPage locale="fr" />;
}
