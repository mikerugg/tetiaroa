export const sanityApiVersion = "2026-07-02";

export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  "tetiaroa";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  "production";

export function hasSanityConfig() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID) &&
      (process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET),
  );
}

export function hasSanityToken() {
  return Boolean(process.env.SANITY_API_TOKEN);
}

