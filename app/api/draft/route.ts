import { draftMode } from "next/headers";

function getPreviewSecret() {
  return process.env.SANITY_PREVIEW_SECRET ?? process.env.DRAFT_SECRET;
}

function getRedirectPath(value: string | null) {
  if (!value) {
    return "/impact";
  }

  if (value.startsWith("http") || value.startsWith("//")) {
    return "/impact";
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/impact/${value}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const previewSecret = getPreviewSecret();

  if (!previewSecret || secret !== previewSecret) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return Response.redirect(new URL(getRedirectPath(searchParams.get("slug")), req.url));
}

