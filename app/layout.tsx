import type { Metadata } from "next";
import {
  Anton,
  Fraunces,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const depth = Anton({
  variable: "--font-depth",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tetiaroa Society",
  description:
    "Save the island. Save the world. Conservation, education, and research on Tetiaroa Atoll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(display.variable, mono.variable, depth.variable, geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
