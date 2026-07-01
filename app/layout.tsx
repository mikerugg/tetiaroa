import type { Metadata } from "next";
import {
  Bebas_Neue,
  Fraunces,
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

const header = Bebas_Neue({
  variable: "--font-header",
  subsets: ["latin"],
  weight: "400",
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
      className={cn(display.variable, mono.variable, header.variable, "font-sans", inter.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
