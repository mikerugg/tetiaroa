import type { Metadata } from "next";
import {
  Caveat,
  Cormorant_Garamond,
  Courier_Prime,
  Source_Serif_4,
  Special_Elite,
} from "next/font/google";

const atlasDisplay = Cormorant_Garamond({
  variable: "--font-atlas-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const atlasSerif = Source_Serif_4({
  variable: "--font-atlas-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const atlasType = Special_Elite({
  variable: "--font-atlas-type",
  subsets: ["latin"],
  weight: "400",
});

const atlasMono = Courier_Prime({
  variable: "--font-atlas-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const atlasHand = Caveat({
  variable: "--font-atlas-hand",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Field Station — Tetiaroa Society (Concept 03)",
  description:
    "An atlas of one atoll, kept whole. The Tetiaroa Society's open research dossier — expedition footage, specimen pages, the Brando correspondence, and the crew roster.",
};

export default function FieldStationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${atlasDisplay.variable} ${atlasSerif.variable} ${atlasType.variable} ${atlasMono.variable} ${atlasHand.variable}`}
    >
      {children}
    </div>
  );
}
