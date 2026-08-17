import { mintRenderToken } from "../../contact/timing-token";

/**
 * The homepage is prerendered, so a token baked into its HTML would be shared
 * and stale for everyone. Client-side forms that live on cached pages (the
 * homepage popup) mint one here instead, when the form actually opens.
 */
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export function GET() {
  try {
    return Response.json({ token: mintRenderToken() }, { headers: noStore });
  } catch (error) {
    console.error("Unable to mint a form render token.", error);

    return Response.json(
      { error: "unavailable" },
      { headers: noStore, status: 500 },
    );
  }
}
