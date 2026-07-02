import { draftMode } from "next/headers";

export async function GET(req: Request) {
  const draft = await draftMode();
  draft.disable();

  return Response.redirect(new URL("/impact", req.url));
}

