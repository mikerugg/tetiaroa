export default async function StudioPage() {
  const StudioDevPage = (await import("@/app/studio/studio-dev")).default;

  return <StudioDevPage />;
}
