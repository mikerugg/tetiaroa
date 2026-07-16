import type { Metadata } from "next";
import {
  ENGLISH_PRIVACY_URL,
  FRENCH_PRIVACY_URL,
} from "../language-links";
import { PrivacyPage } from "./privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Tetiaroa Society",
  description:
    "Learn how Tetiaroa Society collects, uses, protects, and manages personal information.",
  alternates: {
    canonical: ENGLISH_PRIVACY_URL,
    languages: {
      en: ENGLISH_PRIVACY_URL,
      fr: FRENCH_PRIVACY_URL,
    },
  },
};

export default function EnglishPrivacy() {
  return <PrivacyPage locale="en" />;
}
