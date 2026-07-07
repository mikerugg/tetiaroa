import type { ImpactContentEntry } from "./types";

export type ImpactStats = {
  totalEntries: number;
  updatedThisYear: number;
  yearsOfFieldwork: number;
  fieldworkSince: number;
  researchProjects: number;
  speciesDocumented: number;
  peopleProfiled: number;
  publishedReports: number;
  films: number;
  partnerInstitutions: number;
};

// Distinct partner institutions (universities, labs, NGOs) curated by hand
// from the free-text affiliation fields and Partner entries in Sanity as of
// July 2026. The affiliation field mixes institutions with job titles, so
// this cannot be computed live; re-audit when new partners land in the CMS.
export const CURATED_PARTNER_INSTITUTIONS = 35;

const EARLIEST_VALID_YEAR = 1971;

export function computeImpactStats(
  entries: ImpactContentEntry[],
): ImpactStats {
  const currentYear = new Date().getFullYear();

  const publishYears = entries
    .map((entry) => Number(entry.publishedAt.slice(0, 4)))
    .filter((year) => Number.isFinite(year) && year > EARLIEST_VALID_YEAR);
  const fieldworkSince = publishYears.length
    ? Math.min(...publishYears)
    : currentYear;

  return {
    totalEntries: entries.length,
    updatedThisYear: entries.filter((entry) =>
      entry.latestUpdate.startsWith(String(currentYear)),
    ).length,
    yearsOfFieldwork: Math.max(1, currentYear - fieldworkSince),
    fieldworkSince,
    researchProjects: entries.filter((entry) => entry.entryType === "Project")
      .length,
    speciesDocumented: entries.filter(
      (entry) => entry.category === "Nature Guide",
    ).length,
    peopleProfiled: entries.filter((entry) => entry.entryType === "Profile")
      .length,
    publishedReports: entries.filter((entry) => entry.entryType === "Report")
      .length,
    films: entries.filter((entry) => entry.entryType === "Video").length,
    partnerInstitutions: CURATED_PARTNER_INSTITUTIONS,
  };
}
