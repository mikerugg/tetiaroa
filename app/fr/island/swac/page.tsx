import type { Metadata } from "next";
import { SwacExperience } from "@/app/swac/swac-experience";
import { swacCopies } from "@/app/swac/swac-content";
import { ENGLISH_SWAC_URL, FRENCH_SWAC_URL } from "@/app/language-links";

const copy = swacCopies.fr;

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: {
    canonical: FRENCH_SWAC_URL,
    languages: {
      en: ENGLISH_SWAC_URL,
      fr: FRENCH_SWAC_URL,
    },
  },
  openGraph: {
    type: "article",
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: FRENCH_SWAC_URL,
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
  url: FRENCH_SWAC_URL,
  inLanguage: "fr",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/fr",
  },
  about: ["Climatisation à l\x27eau de mer", "Tetiaroa", "Réseau de froid", "Eau océanique profonde"],
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
        name: "Climatisation à l'eau de mer",
        item: FRENCH_SWAC_URL,
      },
    ],
  },
};

export default function FrenchSwacPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SwacExperience locale="fr" />
    </>
  );
}
