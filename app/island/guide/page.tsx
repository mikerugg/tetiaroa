import { GuideListPage, guideListMetadata } from "@/app/atoll/guide-list-page";

export function generateMetadata() { return guideListMetadata("en"); }

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <GuideListPage locale="en" searchParams={await searchParams} />;
}
