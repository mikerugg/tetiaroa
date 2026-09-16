import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getImpactEntryByLegacyPath } from "@/lib/sanity/impact";
import { getGuideLegacyRedirect } from "@/lib/sanity/atoll";

type LegacyPathRouteProps = {
  params: Promise<{ legacyPath: string[] }>;
};

export default async function LegacyPathRoute({
  params,
}: LegacyPathRouteProps) {
  const { legacyPath } = await params;
  const legacyPathname = `/${legacyPath.join("/")}`;
  const guidePath = await getGuideLegacyRedirect(legacyPathname);
  if (guidePath) permanentRedirect(guidePath);
  const match = await getImpactEntryByLegacyPath(legacyPathname);

  if (match) {
    redirect(match.href);
  }

  notFound();
}
