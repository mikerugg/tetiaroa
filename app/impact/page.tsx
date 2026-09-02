import type { Metadata } from "next";
import {
  ENGLISH_IMPACT_URL,
  FRENCH_IMPACT_URL,
} from "../language-links";
import { homeCopies } from "../home-copy";
import {
  getImpactToolbarCopy,
  impactRouteCopy,
} from "./impact-route-copy";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { getImpactEntriesByLanguage } from "@/lib/sanity/impact";
import { getRandomizedFeaturedImpactItems } from "@/lib/impact/featured";
import { parseImpactFilters } from "@/lib/impact/filters";
import { toImpactFeedItem } from "@/lib/impact/types";
import { ImpactFeed } from "./impact-feed";

const copy = impactRouteCopy.en;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: ENGLISH_IMPACT_URL,
    languages: {
      en: ENGLISH_IMPACT_URL,
      fr: FRENCH_IMPACT_URL,
    },
  },
};

export default async function ImpactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const entries = await getImpactEntriesByLanguage("en");
  const impactProjects = entries.map(toImpactFeedItem);
  const initialFilters = parseImpactFilters(await searchParams);
  const featuredProjects = getRandomizedFeaturedImpactItems(impactProjects);

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy("en")} />
      <ImpactFeed
        projects={impactProjects}
        featuredProjects={featuredProjects}
        initialFilters={initialFilters}
        locale="en"
      />
      <SiteFooter copy={homeCopies.en.footer} />
    </>
  );
}
