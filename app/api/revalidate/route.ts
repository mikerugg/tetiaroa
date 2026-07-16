import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { getSanityWriteClient } from "@/lib/sanity/client";

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  english?: {
    slug?: { current?: string };
  };
  french?: {
    slug?: { current?: string };
  };
  language?: string;
  slug?: {
    current?: string;
  };
};

type ImpactEntryCleanupDocument = {
  _id: string;
  english?: {
    slug?: { current?: string };
    htmlPackage?: {
      removed?: boolean;
      cleanupAssetIds?: string[];
    } | null;
  } | null;
  french?: {
    slug?: { current?: string };
    htmlPackage?: {
      removed?: boolean;
      cleanupAssetIds?: string[];
    } | null;
  } | null;
  slug?: { current?: string } | null;
  htmlPackage?: {
    removed?: boolean;
    cleanupAssetIds?: string[];
  } | null;
};

function isSanityAssetId(value: string) {
  return /^(?:image|file)-[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value);
}

async function deleteRetiredHtmlPackageAssets(body: SanityWebhookBody | null) {
  if (body?._type !== "impactEntry") {
    return { deletedAssetCount: 0, slugs: [] as string[] };
  }

  const id = body._id?.replace(/^drafts\./, "") ?? "";
  const englishSlug = body.english?.slug?.current ?? "";
  const frenchSlug = body.french?.slug?.current ?? "";
  const legacySlug = body.slug?.current ?? "";

  if (!id && !englishSlug && !frenchSlug && !legacySlug) {
    return { deletedAssetCount: 0, slugs: [] as string[] };
  }

  const client = getSanityWriteClient();
  const document = await client.fetch<ImpactEntryCleanupDocument | null>(
    `*[
      _type == "impactEntry" &&
      (
        ($id != "" && _id == $id) ||
        ($englishSlug != "" && english.slug.current == $englishSlug) ||
        ($frenchSlug != "" && french.slug.current == $frenchSlug) ||
        ($legacySlug != "" && slug.current == $legacySlug)
      )
    ][0] {
      _id,
      english {
        slug,
        htmlPackage {
          removed,
          cleanupAssetIds
        }
      },
      french {
        slug,
        htmlPackage {
          removed,
          cleanupAssetIds
        }
      },
      slug,
      htmlPackage {
        removed,
        cleanupAssetIds
      }
    }`,
    { id, englishSlug, frenchSlug, legacySlug },
  );

  const packages = [
    { path: "english.htmlPackage", value: document?.english?.htmlPackage },
    { path: "french.htmlPackage", value: document?.french?.htmlPackage },
    { path: "htmlPackage", value: document?.htmlPackage },
  ];
  const assetIds = [
    ...new Set(
      packages
        .flatMap(({ value }) => value?.cleanupAssetIds ?? [])
        .filter(isSanityAssetId),
    ),
  ];
  const slugs = [
    document?.english?.slug?.current,
    document?.french?.slug?.current,
    document?.slug?.current,
  ].filter((slug): slug is string => Boolean(slug));

  if (!document) {
    return { deletedAssetCount: 0, slugs };
  }

  const unsetPaths = packages.flatMap(({ path, value }) => {
    if (value?.removed) {
      return [path];
    }

    return value?.cleanupAssetIds?.length ? [`${path}.cleanupAssetIds`] : [];
  });

  if (!assetIds.length && !unsetPaths.length) {
    return { deletedAssetCount: 0, slugs };
  }

  let transaction = client.transaction();

  for (const assetId of assetIds) {
    transaction = transaction.delete(assetId);
  }

  transaction = transaction.patch(document._id, (patch) => patch.unset(unsetPaths));

  await transaction.commit();
  return { deletedAssetCount: assetIds.length, slugs };
}

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

  let cleanupResult = { deletedAssetCount: 0, slugs: [] as string[] };

  try {
    cleanupResult = await deleteRetiredHtmlPackageAssets(body);
  } catch (error) {
    console.error("Unable to delete retired HTML package assets", error);
    return Response.json(
      {
        message: "Unable to delete retired HTML package assets",
        type: body?._type,
        slug:
          body?.english?.slug?.current ??
          body?.french?.slug?.current ??
          body?.slug?.current,
      },
      { status: 500 },
    );
  }

  revalidateTag("impact", "max");
  revalidateTag("homepage-highlight", "max");
  revalidatePath("/");
  revalidatePath("/fr");
  revalidatePath("/impact");
  revalidatePath("/fr/impact");

  const slugs = [
    ...cleanupResult.slugs,
    body?.english?.slug?.current,
    body?.french?.slug?.current,
    body?.slug?.current,
  ].filter((slug, index, values): slug is string =>
    Boolean(slug) && values.indexOf(slug) === index,
  );

  for (const slug of slugs) {
    revalidateTag(`impact:${slug}`, "max");
    revalidatePath(`/impact/${slug}`);
    revalidatePath(`/fr/impact/${slug}`);
  }

  return Response.json({
    revalidated: true,
    deletedHtmlPackageAssets: cleanupResult.deletedAssetCount,
    type: body?._type,
    slugs,
    now: Date.now(),
  });
}
