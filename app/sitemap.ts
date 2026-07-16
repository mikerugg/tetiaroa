import type { MetadataRoute } from "next";
import {
  ENGLISH_CONTACT_PATH,
  ENGLISH_DONATE_PATH,
  ENGLISH_EMAIL_LIST_PATH,
  ENGLISH_HOME_PATH,
  ENGLISH_IMPACT_PATH,
  ENGLISH_PRIVACY_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_CONTACT_PATH,
  FRENCH_DONATE_PATH,
  FRENCH_EMAIL_LIST_PATH,
  FRENCH_HOME_PATH,
  FRENCH_IMPACT_PATH,
  FRENCH_PRIVACY_PATH,
  FRENCH_TEAM_PATH,
} from "./language-links";
import { getImpactSitemapEntries } from "@/lib/sanity/impact";

export const revalidate = 3600;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";

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
  { path: "/our-logo", priority: 0.6 },
  { path: "/brando-story", priority: 0.6 },
  { path: "/brando-story/first-sight", priority: 0.5 },
  { path: "/brando-story/vow", priority: 0.5 },
  { path: "/brando-story/work", priority: 0.6 },
  { path: "/field-station", priority: 0.6 },
  { path: "/turtle-tales", priority: 0.6 },
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
