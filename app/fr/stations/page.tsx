import type { Metadata } from "next";
import {
  ENGLISH_STATIONS_URL,
  FRENCH_STATIONS_URL,
} from "@/app/language-links";
import { StationsIndexPage } from "@/app/stations/stations-index-page";
import {
  getStationUrl,
  stationSlugs,
  stations,
  stationsIndexCopyFr as copy,
} from "@/app/stations/stations-content";

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: {
    canonical: FRENCH_STATIONS_URL,
    languages: {
      en: ENGLISH_STATIONS_URL,
      fr: FRENCH_STATIONS_URL,
    },
  },
  openGraph: {
    type: "website",
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    url: FRENCH_STATIONS_URL,
    locale: "fr_FR",
    images: stationSlugs.map((slug) => ({
      url: stations[slug].heroImage,
      alt: stations[slug].heroImageAlt,
    })),
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: copy.metadataTitle,
  description: copy.metadataDescription,
  url: FRENCH_STATIONS_URL,
  inLanguage: "fr",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: stationSlugs.map((slug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stations[slug].name,
      url: getStationUrl(slug),
    })),
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StationsIndexPage locale="fr" />
    </>
  );
}
