import type { Metadata } from "next";
import { Anton } from "next/font/google";

const depthDisplay = Anton({
  variable: "--font-depth",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Te Hohonu (The Deep) — Tetiaroa Society (Concept 01)",
  description:
    "Go deeper for Tetiaroa. A homepage concept where scroll is depth — from the sunlit lagoon to Honu XR at −104 m.",
};

export default function DescentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={depthDisplay.variable}>{children}</div>;
}
