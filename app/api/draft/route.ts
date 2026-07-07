import { draftMode } from "next/headers";

function getPreviewSecret() {
  return process.env.SANITY_PREVIEW_SECRET ?? process.env.DRAFT_SECRET;
}

function getRedirectPath(value: string | null, language: string | null) {
  const impactRoot = language === "fr" ? "/fr/impact" : "/impact";

  if (!value) {
    return impactRoot;
  }

  if (value.startsWith("http") || value.startsWith("//")) {
    return impactRoot;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `${impactRoot}/${value}`;
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

  return Response.redirect(
    new URL(
      getRedirectPath(searchParams.get("slug"), searchParams.get("language")),
      req.url,
    ),
  );
}
