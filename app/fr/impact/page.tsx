import type { Metadata } from "next";
import { homeCopies } from "@/app/home-copy";
import {
  ENGLISH_IMPACT_URL,
  FRENCH_IMPACT_URL,
} from "@/app/language-links";
import { PrimaryRouteDock } from "@/app/primary-route-dock";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { ImpactFeed } from "@/app/impact/impact-feed";
import {
  getImpactToolbarCopy,
  impactRouteCopy,
} from "@/app/impact/impact-route-copy";
import { getImpactEntriesByLanguage } from "@/lib/sanity/impact";
import { computeImpactStats } from "@/lib/impact/stats";
import { toImpactFeedItem } from "@/lib/impact/types";

const copy = impactRouteCopy.fr;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: FRENCH_IMPACT_URL,
    languages: {
      en: ENGLISH_IMPACT_URL,
      fr: FRENCH_IMPACT_URL,
    },
  },
};

export default async function FrenchImpactPage() {
  const entries = await getImpactEntriesByLanguage("fr");
  const impactProjects = entries.map(toImpactFeedItem);
  const stats = computeImpactStats(entries);

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy("fr")} />
      <PrimaryRouteDock active="impact" locale="fr" />
      <ImpactFeed projects={impactProjects} stats={stats} locale="fr" />
      <SiteFooter copy={homeCopies.fr.footer} />
    </>
  );
}
