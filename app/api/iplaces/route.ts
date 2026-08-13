import {
  fetchIPlacesArticle,
  IPlacesNotFoundError,
} from "@/lib/impact/iplaces-server";
import { parseIPlacesArticleUrl } from "@/lib/impact/iplaces";

export const maxDuration = 30;

type ImportRequest = {
  url?: unknown;
};

export async function POST(request: Request) {
  let body: ImportRequest;

  try {
    body = (await request.json()) as ImportRequest;
  } catch {
    return Response.json(
      { message: "Send the request as JSON with an iPlaces article URL." },
      { status: 400 },
    );
  }

  if (typeof body.url !== "string") {
    return Response.json(
      { message: "Paste an iPlaces article URL." },
      { status: 400 },
    );
  }

  let reference;
  try {
    reference = parseIPlacesArticleUrl(body.url);
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Paste a valid iPlaces article URL.",
      },
      { status: 400 },
    );
  }

  try {
    const record = await fetchIPlacesArticle(reference);
    return Response.json({ record });
  } catch (error) {
    if (error instanceof IPlacesNotFoundError) {
      return Response.json({ message: error.message }, { status: 404 });
    }

    console.error("Unable to import iPlaces article", {
      error,
      groupName: reference.groupName,
      shortId: reference.shortId,
    });

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We couldn’t load that iPlaces article. Try again.",
      },
      { status: 502 },
    );
  }
}
