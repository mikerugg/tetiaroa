import type { Metadata } from "next";
import {
  generateImpactEntryMetadata,
  getImpactEntrySource,
  ImpactEntryPageContent,
} from "@/app/impact/impact-entry-page";
import { getImpactSlugs } from "@/lib/sanity/impact";

type FrenchImpactEntryRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  const slugs = await getImpactSlugs("fr");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FrenchImpactEntryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  return generateImpactEntryMetadata(slug, "fr");
}

export default async function FrenchImpactEntryPage({
  params,
  searchParams,
}: FrenchImpactEntryRouteProps) {
  const { slug } = await params;
  const entrySource = getImpactEntrySource(await searchParams);

  return (
    <ImpactEntryPageContent
      slug={slug}
      locale="fr"
      entrySource={entrySource}
    />
  );
}
