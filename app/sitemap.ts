import type { MetadataRoute } from "next";
import {
  ENGLISH_CONTACT_PATH,
  ENGLISH_DONATE_PATH,
  ENGLISH_EMAIL_LIST_PATH,
  ENGLISH_GEOLOGY_PATH,
  ENGLISH_HOME_PATH,
  ENGLISH_IMPACT_PATH,
  ENGLISH_OUR_STORY_PATH,
  FRENCH_OUR_STORY_PATH,
  ENGLISH_PRIVACY_PATH,
  ENGLISH_STATIONS_PATH,
  ENGLISH_SWAC_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_CONTACT_PATH,
  FRENCH_DONATE_PATH,
  FRENCH_EMAIL_LIST_PATH,
  FRENCH_GEOLOGY_PATH,
  FRENCH_HOME_PATH,
  FRENCH_IMPACT_PATH,
  FRENCH_PRIVACY_PATH,
  FRENCH_STATIONS_PATH,
  FRENCH_SWAC_PATH,
  FRENCH_TEAM_PATH,
} from "./language-links";
import { getImpactSitemapEntries } from "@/lib/sanity/impact";
import { getPillarPath, pillarSlugs } from "./pillars/pillar-content";
import { getStationPath, stationSlugs } from "./stations/stations-content";

export const revalidate = 3600;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";

const pillarRoutes = pillarSlugs.flatMap((slug) => [
  { path: getPillarPath("en", slug), priority: 0.8 },
  { path: getPillarPath("fr", slug), priority: 0.7 },
]);

const stationRoutes = stationSlugs.flatMap((slug) => [
  { path: getStationPath(slug, "en"), priority: 0.8 },
  { path: getStationPath(slug, "fr"), priority: 0.7 },
]);

const staticRoutes = [
  { path: ENGLISH_HOME_PATH, priority: 1 },
  { path: FRENCH_HOME_PATH, priority: 0.9 },
  { path: ENGLISH_IMPACT_PATH, priority: 0.9 },
  { path: FRENCH_IMPACT_PATH, priority: 0.8 },
  { path: ENGLISH_TEAM_PATH, priority: 0.8 },
  { path: FRENCH_TEAM_PATH, priority: 0.7 },
  { path: ENGLISH_CONTACT_PATH, priority: 0.7 },
  { path: FRENCH_CONTACT_PATH, priority: 0.6 },
  { path: ENGLISH_EMAIL_LIST_PATH, priority: 0.7 },
  { path: FRENCH_EMAIL_LIST_PATH, priority: 0.6 },
  { path: ENGLISH_PRIVACY_PATH, priority: 0.4 },
  { path: FRENCH_PRIVACY_PATH, priority: 0.4 },
  { path: ENGLISH_DONATE_PATH, priority: 0.7 },
  { path: FRENCH_DONATE_PATH, priority: 0.6 },
  { path: ENGLISH_GEOLOGY_PATH, priority: 0.8 },
  { path: FRENCH_GEOLOGY_PATH, priority: 0.7 },
  { path: ENGLISH_SWAC_PATH, priority: 0.8 },
  { path: FRENCH_SWAC_PATH, priority: 0.7 },
  { path: ENGLISH_OUR_STORY_PATH, priority: 0.8 },
  { path: FRENCH_OUR_STORY_PATH, priority: 0.7 },
  { path: ENGLISH_STATIONS_PATH, priority: 0.8 },
  { path: FRENCH_STATIONS_PATH, priority: 0.7 },
  ...stationRoutes,
  { path: "/our-logo", priority: 0.6 },
  { path: "/turtle-tales", priority: 0.6 },
  ...pillarRoutes,
] satisfies Array<{ path: string; priority: number }>;

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updatedAt = new Date();
  const [englishImpactEntries, frenchImpactEntries] = await Promise.all([
    getImpactSitemapEntries("en"),
    getImpactSitemapEntries("fr"),
  ]);
  const staticSitemapEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: updatedAt,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
  const impactSitemapEntries = [
    ...englishImpactEntries,
    ...frenchImpactEntries,
  ].map((entry) => ({
    url: absoluteUrl(
      entry.language === "fr"
        ? `${FRENCH_IMPACT_PATH}/${entry.slug}`
        : `${ENGLISH_IMPACT_PATH}/${entry.slug}`,
    ),
    lastModified: entry.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticSitemapEntries, ...impactSitemapEntries];
}
