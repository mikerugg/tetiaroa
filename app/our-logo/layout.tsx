import type { Metadata } from "next";
import { Anton } from "next/font/google";

const markDisplay = Anton({
  variable: "--font-depth",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Our Logo Revealed - Tetiaroa Society",
  description:
    "An interactive guide to the seven Polynesian motifs inside the Tetiaroa Society 2026 logo.",
};

export default function MarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={markDisplay.variable}>{children}</div>;
}
