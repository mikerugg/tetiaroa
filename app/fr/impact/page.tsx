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
import { getImpactFeedItemsByLanguage } from "@/lib/sanity/impact";

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
  const impactProjects = await getImpactFeedItemsByLanguage("fr");

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy("fr")} />
      <PrimaryRouteDock active="impact" locale="fr" />
      <ImpactFeed projects={impactProjects} locale="fr" />
      <SiteFooter copy={homeCopies.fr.footer} />
    </>
  );
}
