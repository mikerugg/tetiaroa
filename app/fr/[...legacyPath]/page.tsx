import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getImpactEntryByLegacyPath } from "@/lib/sanity/impact";
import { getGuideLegacyRedirect } from "@/lib/sanity/atoll";

type FrenchLegacyPathRouteProps = {
  params: Promise<{ legacyPath: string[] }>;
};

export default async function FrenchLegacyPathRoute({
  params,
}: FrenchLegacyPathRouteProps) {
  const { legacyPath } = await params;
  const legacyPathname = legacyPath.join("/");
  const guidePath = await getGuideLegacyRedirect(`/fr/${legacyPathname}`);
  if (guidePath) permanentRedirect(guidePath);
  const match =
    (await getImpactEntryByLegacyPath(`/fr/${legacyPathname}`)) ??
    (await getImpactEntryByLegacyPath(`/${legacyPathname}`));

  if (match) {
    redirect(match.href);
  }

  notFound();
}
