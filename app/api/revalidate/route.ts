import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
    req,
    secret,
  );

  if (!isValidSignature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag("impact", "max");
  revalidatePath("/impact");

  const slug = body?.slug?.current;

  if (slug) {
    revalidateTag(`impact:${slug}`, "max");
    revalidatePath(`/impact/${slug}`);
  }

  return Response.json({
    revalidated: true,
    type: body?._type,
    slug,
    now: Date.now(),
  });
}
