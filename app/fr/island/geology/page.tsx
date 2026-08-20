import type { Metadata } from "next";
import { GeologyExperience } from "@/app/geology/geology-experience";
import { geologyCopies } from "@/app/geology/geology-content";
import {
  ENGLISH_GEOLOGY_URL,
  FRENCH_GEOLOGY_URL,
} from "@/app/language-links";

const copy = geologyCopies.fr;

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: {
    canonical: FRENCH_GEOLOGY_URL,
    languages: {
      en: ENGLISH_GEOLOGY_URL,
      fr: FRENCH_GEOLOGY_URL,
    },
  },
  openGraph: {
    type: "article",
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: FRENCH_GEOLOGY_URL,
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://www.tetiaroasociety.org/geology/atoll-foundation-poster.webp",
        width: 1672,
        height: 941,
        alt: copy.hero.posterAlt,
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: copy.metadata.title,
  description: copy.metadata.description,
  url: FRENCH_GEOLOGY_URL,
  inLanguage: "fr",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/fr",
  },
  about: ["Tetiaroa", "Formation des atolls", "Géologie", "Récifs coralliens"],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tetiaroa Society",
        item: "https://www.tetiaroasociety.org/fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Géologie",
        item: FRENCH_GEOLOGY_URL,
      },
    ],
  },
};

export default function FrenchGeologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GeologyExperience locale="fr" />
    </>
  );
}
