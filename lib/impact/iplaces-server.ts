import "server-only";

import {
  IPLACES_GRAPHQL_ENDPOINT,
  normalizeIPlacesRecord,
  type IPlacesArticleReference,
} from "./iplaces";

const PAGE_SIZE = 250;
const MAX_PAGES = 40;
const REQUEST_TIMEOUT_MS = 15_000;

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

type ManuscriptIndexRecord = {
  id?: unknown;
  shortId?: unknown;
};

export class IPlacesNotFoundError extends Error {}

async function requestIPlaces<T>(query: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(IPLACES_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("iPlaces took too long to respond. Try again in a moment.");
    }

    throw new Error("We couldn’t reach iPlaces. Try again in a moment.");
  }

  let payload: GraphQlResponse<T>;
  try {
    payload = (await response.json()) as GraphQlResponse<T>;
  } catch {
    throw new Error("iPlaces returned a response we couldn’t read.");
  }

  if (!response.ok || payload.errors?.length || !payload.data) {
    const upstreamMessage = payload.errors
      ?.map((error) => error.message)
      .filter(Boolean)
      .join(" ");
    throw new Error(
      upstreamMessage ||
        `iPlaces couldn’t return the article (HTTP ${response.status}). Try again.`,
    );
  }

  return payload.data;
}

async function findManuscriptId(reference: IPlacesArticleReference) {
  const groupName = JSON.stringify(reference.groupName);

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const data = await requestIPlaces<{
      manuscriptsPublishedSinceDate?: unknown;
    }>(`{
      manuscriptsPublishedSinceDate(
        groupName: ${groupName}
        limit: ${PAGE_SIZE}
        offset: ${offset}
      ) {
        id
        shortId
      }
    }`);
    const records = Array.isArray(data.manuscriptsPublishedSinceDate)
      ? (data.manuscriptsPublishedSinceDate as ManuscriptIndexRecord[])
      : [];
    const match = records.find(
      (record) => Number(record.shortId) === reference.shortId,
    );

    if (match && typeof match.id === "string") {
      return match.id;
    }

    if (records.length < PAGE_SIZE) {
      break;
    }
  }

  throw new IPlacesNotFoundError(
    `We couldn’t find published article ${reference.shortId} for ${reference.groupName} on iPlaces.`,
  );
}

export async function fetchIPlacesArticle(reference: IPlacesArticleReference) {
  const manuscriptId = await findManuscriptId(reference);
  const data = await requestIPlaces<{ publishedManuscript?: unknown }>(`{
    publishedManuscript(id: ${JSON.stringify(manuscriptId)}) {
      id
      shortId
      publishedDate
      meta {
        source
      }
      submission
    }
  }`);

  if (!data.publishedManuscript) {
    throw new IPlacesNotFoundError(
      `We couldn’t find published article ${reference.shortId} for ${reference.groupName} on iPlaces.`,
    );
  }

  return normalizeIPlacesRecord(data.publishedManuscript, reference);
}
