import { GuideListPage, guideListMetadata } from "@/app/atoll/guide-list-page";

export function generateMetadata() { return guideListMetadata("fr"); }

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <GuideListPage locale="fr" searchParams={await searchParams} />;
}
