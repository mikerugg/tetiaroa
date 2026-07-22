import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillarUrl,
  isPillarSlug,
  pillarContent,
  pillarSlugs,
} from "../pillar-content";
import { PillarPage } from "../pillar-page";

type PillarRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return pillarSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PillarRouteProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isPillarSlug(slug)) {
    return {};
  }

  const copy = pillarContent.en[slug];
  const englishUrl = getPillarUrl("en", slug);
  const frenchUrl = getPillarUrl("fr", slug);

  return {
    title: `${copy.title} | Tetiaroa Society`,
    description: copy.metadataDescription,
    alternates: {
      canonical: englishUrl,
      languages: {
        en: englishUrl,
        fr: frenchUrl,
      },
    },
    openGraph: {
      title: `${copy.title} | Tetiaroa Society`,
      description: copy.metadataDescription,
      url: englishUrl,
      images: [{ url: copy.heroImage, alt: copy.heroImageAlt }],
    },
  };
}

export default async function EnglishPillarRoute({ params }: PillarRouteProps) {
  const { slug } = await params;

  if (!isPillarSlug(slug)) {
    notFound();
  }

  return <PillarPage locale="en" slug={slug} />;
}
