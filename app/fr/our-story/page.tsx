import type { Metadata } from "next";
import {
  ENGLISH_OUR_STORY_URL,
  FRENCH_OUR_STORY_URL,
} from "@/app/language-links";
import { OurStoryPage } from "@/app/our-story/our-story-page";
import { ourStoryCopies } from "@/app/our-story/our-story-content";

const copy = ourStoryCopies.fr;

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: {
    canonical: FRENCH_OUR_STORY_URL,
    languages: {
      en: ENGLISH_OUR_STORY_URL,
      fr: FRENCH_OUR_STORY_URL,
    },
  },
  openGraph: {
    type: "article",
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: FRENCH_OUR_STORY_URL,
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://www.tetiaroasociety.org/story/history-new-living-handoff.png",
        width: 1983,
        height: 793,
        alt: "L'histoire de la Tetiaroa Society, de l'idée de Marlon Brando au travail de terrain d'aujourd'hui",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: copy.metadata.title,
  description: copy.metadata.description,
  url: FRENCH_OUR_STORY_URL,
  inLanguage: "fr",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/fr",
  },
  about: [
    "Teti'aroa",
    "Marlon Brando",
    "Tetiaroa Society",
    "Conservation",
    "Patrimoine culturel polynésien",
    "Résilience insulaire",
  ],
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
        name: "Notre histoire",
        item: FRENCH_OUR_STORY_URL,
      },
    ],
  },
};

export default function FrenchOurStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <OurStoryPage locale="fr" />
    </>
  );
}
