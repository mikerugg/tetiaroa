import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon, WavesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentLanguage } from "@/app/document-language";
import { HonuAdventure } from "./honu-adventure";
import { adventureCopy as copy } from "./adventure-content";

export const metadata: Metadata = {
  title: "Your first HONU dive | Tetiaroa Society",
  description:
    "Pilot HONU through a coral reef. Find a butterflyfish, octopus, and turtle, then use the lights and sonar to explore deeper water.",
  robots: { index: false, follow: true },
};

export default function HonuCartoonPage() {
  return (
    <div className="honu-cartoon-theme min-h-screen bg-background text-foreground">
      <DocumentLanguage lang="en" />
      <header className="mx-auto flex max-w-[1480px] items-center justify-between gap-5 px-5 py-5 sm:px-10">
        <Link href="/" aria-label="Tetiaroa Society home">
          <Image
            src="/logos/TSFP_Logo_2026_Blue.png"
            alt="Tetiaroa Society"
            width={140}
            height={67}
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/honu">
              <ArrowLeftIcon data-icon="inline-start" />
              Meet HONU
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link href="/donate">
              Support our work
              <ArrowUpRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-[1400px] gap-5 px-5 pb-8 pt-7 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20 lg:pb-10 lg:pt-8">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <WavesIcon className="size-4" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(3rem,5.7vw,5.5rem)] leading-[1.02] tracking-[-0.045em]">
              {copy.title}
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:pb-1 lg:text-base">
            {copy.intro}
          </p>
        </section>
        <HonuAdventure />
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-24 lg:py-24">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Ocean research and education
            </p>
            <h2 className="max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {copy.supportTitle}
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-muted-foreground">
              {copy.supportBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-5">
                <Link href="/donate">
                  Support Tetiaroa Society
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/honu">
                  Explore HONU
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 border-t border-border px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:px-10">
        <p>Tetiaroa Society</p>
        <Link href="/honu">More about the HONU submersibles</Link>
      </footer>
    </div>
  );
}
