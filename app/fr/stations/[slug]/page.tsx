import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FRENCH_STATIONS_URL } from "@/app/language-links";
import { StationPage } from "@/app/stations/station-page";
import {
  getStationUrl,
  isStationSlug,
  stationSlugs,
  stationsFr,
} from "@/app/stations/stations-content";

type StationRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StationRouteProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isStationSlug(slug)) {
    return {};
  }

  const station = stationsFr[slug];
  const url = getStationUrl(slug, "fr");

  return {
    title: station.metadataTitle,
    description: station.metadataDescription,
    alternates: {
      canonical: url,
      languages: {
        en: getStationUrl(slug, "en"),
        fr: url,
      },
    },
    openGraph: {
      type: "website",
      title: station.metadataTitle,
      description: station.metadataDescription,
      url,
      locale: "fr_FR",
      images: [{ url: station.heroImage, alt: station.heroImageAlt }],
    },
  };
}

export default async function FrenchStationRoute({
  params,
}: StationRouteProps) {
  const { slug } = await params;

  if (!isStationSlug(slug)) {
    notFound();
  }

  const station = stationsFr[slug];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: station.name,
    description: station.metadataDescription,
    url: getStationUrl(slug, "fr"),
    image: station.heroImage,
    inLanguage: "fr",
    parentOrganization: {
      "@type": "Organization",
      name: "Tetiaroa Society",
      url: "https://www.tetiaroasociety.org/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tetiaroa",
      addressRegion: "Îles de la Société",
      addressCountry: "PF",
    },
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
          name: "Nos stations",
          item: FRENCH_STATIONS_URL,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: station.name,
          item: getStationUrl(slug, "fr"),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StationPage slug={slug} locale="fr" />
    </>
  );
}
