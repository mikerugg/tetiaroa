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
import { PrimaryRouteDock } from "../primary-route-dock";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { getImpactEntriesByLanguage } from "@/lib/sanity/impact";
import { computeImpactStats } from "@/lib/impact/stats";
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

export default async function ImpactPage() {
  const entries = await getImpactEntriesByLanguage("en");
  const impactProjects = entries.map(toImpactFeedItem);
  const stats = computeImpactStats(entries);

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy("en")} />
      <PrimaryRouteDock active="impact" />
      <ImpactFeed projects={impactProjects} stats={stats} locale="en" />
      <SiteFooter copy={homeCopies.en.footer} />
    </>
  );
}
