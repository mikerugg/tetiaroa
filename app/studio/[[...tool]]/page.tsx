import { redirect } from "next/navigation";

const sanityLoginUrl = "https://www.sanity.io/login";

export default async function StudioPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect(sanityLoginUrl);
  }

  const StudioDevPage = (await import("@/app/studio/studio-dev")).default;

  return <StudioDevPage />;
}
