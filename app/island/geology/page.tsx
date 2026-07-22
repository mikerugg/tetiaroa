import type { Metadata } from "next";
import { GeologyExperience } from "@/app/geology/geology-experience";
import { geologyCopies } from "@/app/geology/geology-content";
import {
  ENGLISH_GEOLOGY_URL,
  FRENCH_GEOLOGY_URL,
} from "@/app/language-links";

const copy = geologyCopies.en;

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: {
    canonical: ENGLISH_GEOLOGY_URL,
    languages: {
      en: ENGLISH_GEOLOGY_URL,
      fr: FRENCH_GEOLOGY_URL,
    },
  },
  openGraph: {
    type: "article",
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: ENGLISH_GEOLOGY_URL,
    locale: "en_US",
    alternateLocale: ["fr_FR"],
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
  url: ENGLISH_GEOLOGY_URL,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/",
  },
  about: ["Tetiaroa", "Atoll formation", "Geology", "Coral reefs"],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tetiaroa Society",
        item: "https://www.tetiaroasociety.org/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Geology",
        item: ENGLISH_GEOLOGY_URL,
      },
    ],
  },
};

export default function EnglishGeologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GeologyExperience locale="en" />
    </>
  );
}
