import type { Metadata } from "next";
import { ENGLISH_STATIONS_URL } from "@/app/language-links";
import { StationsIndexPage } from "./stations-index-page";
import {
  getStationUrl,
  stationSlugs,
  stations,
  stationsIndexCopy,
} from "./stations-content";

export const metadata: Metadata = {
  title: stationsIndexCopy.metadataTitle,
  description: stationsIndexCopy.metadataDescription,
  alternates: {
    canonical: ENGLISH_STATIONS_URL,
  },
  openGraph: {
    type: "website",
    title: stationsIndexCopy.metadataTitle,
    description: stationsIndexCopy.metadataDescription,
    url: ENGLISH_STATIONS_URL,
    locale: "en_US",
    images: stationSlugs.map((slug) => ({
      url: stations[slug].heroImage,
      alt: stations[slug].heroImageAlt,
    })),
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: stationsIndexCopy.metadataTitle,
  description: stationsIndexCopy.metadataDescription,
  url: ENGLISH_STATIONS_URL,
  inLanguage: "en",
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
      <StationsIndexPage />
    </>
  );
}
