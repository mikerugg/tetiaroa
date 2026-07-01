import type { Metadata } from "next";
import { homeCopies } from "../home-copy";
import { PrimaryRouteDock } from "../primary-route-dock";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { impactProjects } from "./data";
import { ImpactFeed } from "./impact-feed";

export const metadata: Metadata = {
  title: "Impact Feed / Tetiaroa Society",
  description:
    "Field notes and project updates from Tetiaroa Society's conservation, research, education, and restoration work.",
};

export default function ImpactPage() {
  return (
    <>
      <TopToolbar copy={homeCopies.en.toolbar} />
      <PrimaryRouteDock active="impact" />
      <ImpactFeed projects={impactProjects} />
      <SiteFooter copy={homeCopies.en.footer} />
    </>
  );
}
