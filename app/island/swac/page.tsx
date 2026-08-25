import type { Metadata } from "next";
import { SwacExperience } from "@/app/swac/swac-experience";
import { swacCopies } from "@/app/swac/swac-content";
import { ENGLISH_SWAC_URL, FRENCH_SWAC_URL } from "@/app/language-links";

const copy = swacCopies.en;

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: {
    canonical: ENGLISH_SWAC_URL,
    languages: {
      en: ENGLISH_SWAC_URL,
      fr: FRENCH_SWAC_URL,
    },
  },
  openGraph: {
    type: "article",
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: ENGLISH_SWAC_URL,
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
  url: ENGLISH_SWAC_URL,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/",
  },
  about: ["Sea water air conditioning", "Tetiaroa", "District cooling", "Deep ocean water"],
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
        name: "Sea Water Air Conditioning",
        item: ENGLISH_SWAC_URL,
      },
    ],
  },
};

export default function EnglishSwacPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SwacExperience locale="en" />
    </>
  );
}
