import { permanentRedirect } from "next/navigation";
import { AtollHubPage } from "@/app/atoll/atoll-hub-page";
import { searchParamsToString } from "@/app/atoll/directory-state";
import { atollMetadata } from "@/app/atoll/metadata";
import { atollCopy } from "@/app/atoll/atoll-copy";
import { getAtollHub } from "@/lib/sanity/atoll";

export async function generateMetadata() {
  const hub = await getAtollHub("fr");
  return atollMetadata({ locale: "fr", title: atollCopy.fr.atoll, description: atollCopy.fr.hubDescription, path: "/fr/island", image: hub.image });
}

export default async function IslandPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = searchParamsToString(await searchParams);
  if (query) permanentRedirect(`/fr/island/guide?${query}`);
  return <AtollHubPage locale="fr" />;
}
