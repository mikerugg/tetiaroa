import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { hasSanityConfig } from "@/lib/sanity/env";

export default async function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = await draftMode();

  return (
    <>
      {children}
      {hasSanityConfig() && draft.isEnabled ? <VisualEditing /> : null}
    </>
  );
}

