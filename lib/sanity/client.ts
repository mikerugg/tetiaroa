import { createClient, type SanityClient } from "next-sanity";
import {
  hasSanityConfig,
  hasSanityToken,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./env";

let publicClient: SanityClient | null = null;
let draftClient: SanityClient | null = null;
let writeClient: SanityClient | null = null;

export function getSanityClient({ draft = false } = {}) {
  if (!hasSanityConfig()) {
    throw new Error("Sanity project id and dataset are not configured.");
  }

  if (draft && hasSanityToken()) {
    if (!draftClient) {
      draftClient = createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        useCdn: false,
        perspective: "drafts",
        token: process.env.SANITY_API_TOKEN,
      });
    }

    return draftClient;
  }

  if (!publicClient) {
    publicClient = createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: "published",
    });
  }

  return publicClient;
}

export function getSanityWriteClient() {
  if (!hasSanityConfig()) {
    throw new Error("Sanity project id and dataset are not configured.");
  }

  if (!hasSanityToken()) {
    throw new Error("SANITY_API_TOKEN is required to delete retired HTML assets.");
  }

  if (!writeClient) {
    writeClient = createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: false,
      perspective: "published",
      token: process.env.SANITY_API_TOKEN,
    });
  }

  return writeClient;
}
