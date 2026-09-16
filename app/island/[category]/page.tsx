import { GuideListPage, guideListMetadata } from "@/app/atoll/guide-list-page";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props) { return guideListMetadata("en", (await params).category); }

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  return <GuideListPage locale="en" categoryId={category} searchParams={query} />;
}
