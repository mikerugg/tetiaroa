import { notFound, redirect } from "next/navigation";
import { getImpactEntryByLegacyPath } from "@/lib/sanity/impact";

type LegacyPathRouteProps = {
  params: Promise<{ legacyPath: string[] }>;
};

export default async function LegacyPathRoute({
  params,
}: LegacyPathRouteProps) {
  const { legacyPath } = await params;
  const legacyPathname = `/${legacyPath.join("/")}`;
  const match = await getImpactEntryByLegacyPath(legacyPathname);

  if (match) {
    redirect(match.href);
  }

  notFound();
}
