import { notFound, redirect } from "next/navigation";
import { getImpactEntryByLegacyPath } from "@/lib/sanity/impact";

type FrenchLegacyPathRouteProps = {
  params: Promise<{ legacyPath: string[] }>;
};

export default async function FrenchLegacyPathRoute({
  params,
}: FrenchLegacyPathRouteProps) {
  const { legacyPath } = await params;
  const legacyPathname = legacyPath.join("/");
  const match =
    (await getImpactEntryByLegacyPath(`/fr/${legacyPathname}`)) ??
    (await getImpactEntryByLegacyPath(`/${legacyPathname}`));

  if (match) {
    redirect(match.href);
  }

  notFound();
}
