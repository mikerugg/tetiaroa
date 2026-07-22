import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillarUrl,
  isPillarSlug,
  pillarContent,
  pillarSlugs,
} from "@/app/pillars/pillar-content";
import { PillarPage } from "@/app/pillars/pillar-page";

type FrenchPillarRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return pillarSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FrenchPillarRouteProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isPillarSlug(slug)) {
    return {};
  }

  const copy = pillarContent.fr[slug];
  const englishUrl = getPillarUrl("en", slug);
  const frenchUrl = getPillarUrl("fr", slug);

  return {
    title: `${copy.title} | Tetiaroa Society`,
    description: copy.metadataDescription,
    alternates: {
      canonical: frenchUrl,
      languages: {
        en: englishUrl,
        fr: frenchUrl,
      },
    },
    openGraph: {
      title: `${copy.title} | Tetiaroa Society`,
      description: copy.metadataDescription,
      url: frenchUrl,
      locale: "fr_FR",
      images: [{ url: copy.heroImage, alt: copy.heroImageAlt }],
    },
  };
}

export default async function FrenchPillarRoute({
  params,
}: FrenchPillarRouteProps) {
  const { slug } = await params;

  if (!isPillarSlug(slug)) {
    notFound();
  }

  return <PillarPage locale="fr" slug={slug} />;
}
