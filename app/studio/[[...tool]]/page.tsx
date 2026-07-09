import { redirect } from "next/navigation";

const hostedStudioUrl = "https://tetiaroa.sanity.studio/";

export default async function StudioPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect(hostedStudioUrl);
  }

  const StudioDevPage = (await import("@/app/studio/studio-dev")).default;

  return <StudioDevPage />;
}
