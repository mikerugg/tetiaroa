import { GuideProfilePage, guideProfileMetadata } from "@/app/atoll/guide-profile-page";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  return guideProfileMetadata("en", category, slug);
}

export default async function ProfilePage({ params }: Props) {
  const { category, slug } = await params;
  return <GuideProfilePage locale="en" category={category} slug={slug} />;
}
