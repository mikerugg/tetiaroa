import type { Metadata } from "next";
import {
  generateImpactEntryMetadata,
  getImpactEntrySource,
  ImpactEntryPageContent,
} from "../impact-entry-page";

type ImpactEntryRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ImpactEntryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  return generateImpactEntryMetadata(slug, "en");
}

export default async function ImpactEntryPage({
  params,
  searchParams,
}: ImpactEntryRouteProps) {
  const { slug } = await params;
  const entrySource = getImpactEntrySource(await searchParams);

  return (
    <ImpactEntryPageContent
      slug={slug}
      locale="en"
      entrySource={entrySource}
    />
  );
}
