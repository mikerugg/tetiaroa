import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ENGLISH_STATIONS_URL } from "@/app/language-links";
import { StationPage } from "../station-page";
import {
  getStationUrl,
  isStationSlug,
  stationSlugs,
  stations,
} from "../stations-content";

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

  const station = stations[slug];
  const url = getStationUrl(slug);

  return {
    title: station.metadataTitle,
    description: station.metadataDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title: station.metadataTitle,
      description: station.metadataDescription,
      url,
      locale: "en_US",
      images: [{ url: station.heroImage, alt: station.heroImageAlt }],
    },
  };
}

export default async function EnglishStationRoute({
  params,
}: StationRouteProps) {
  const { slug } = await params;

  if (!isStationSlug(slug)) {
    notFound();
  }

  const station = stations[slug];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: station.name,
    description: station.metadataDescription,
    url: getStationUrl(slug),
    image: station.heroImage,
    parentOrganization: {
      "@type": "Organization",
      name: "Tetiaroa Society",
      url: "https://www.tetiaroasociety.org/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tetiaroa",
      addressRegion: "Society Islands",
      addressCountry: "PF",
    },
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
          name: "Our Stations",
          item: ENGLISH_STATIONS_URL,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: station.name,
          item: getStationUrl(slug),
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
      <StationPage slug={slug} />
    </>
  );
}
