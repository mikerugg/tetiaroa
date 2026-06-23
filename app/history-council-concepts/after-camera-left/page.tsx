import type { Metadata } from "next";

import { CouncilHistorySection } from "../council-concepts";

export const metadata: Metadata = {
  title: "After the Camera Left | Tetiaroa Society",
  description:
    "A council-approved history section concept about Marlon Brando, Tetiaroa, and the promise that remained after the film production ended.",
};

export default function Page() {
  return <CouncilHistorySection slug="after-camera-left" />;
}
