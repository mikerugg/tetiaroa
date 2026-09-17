import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, WavesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DocumentLanguage } from "@/app/document-language";
import { homeCopies } from "@/app/home-copy";
import { HomeVrLightbox } from "@/app/home-vr-experience";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { HonuHero } from "./honu-hero";
import { HonuAnatomy } from "./honu-anatomy";
import { HonuMission } from "./honu-mission";
import { honuCopy as copy } from "./honu-content";

const pageUrl = "https://www.tetiaroasociety.org/honu";

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: copy.metadata.title,
    description: copy.metadata.description,
    type: "website",
    url: pageUrl,
    images: [
      {
        url: "https://www.tetiaroasociety.org/launch-party.webp",
        width: 1600,
        height: 1066,
        alt: "Explorers inside Honu’s clear observation dome",
      },
    ],
  },
};

export default function HonuPage() {
  return (
    <>
      <DocumentLanguage lang="en" />
      <TopToolbar copy={homeCopies.en.toolbar} homepageLayout position="static" />
      <main className="bg-background text-foreground">
        <HonuHero />
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-24 lg:px-16 lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {copy.intro.eyebrow}
            </p>
            <h2 className="mt-5 font-header text-5xl leading-none sm:text-6xl">
              {copy.intro.title}
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              {copy.intro.body}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-7">
            <dl className="grid grid-cols-3 gap-5">
              {[
                { value: "2", label: "sister submersibles" },
                {
                  value: "3",
                  label: "people on board",
                  detail: "1 pilot + 2 passengers",
                },
                { value: "1,200", label: "metres depth rating" },
              ].map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs leading-5 text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-header text-5xl text-primary sm:text-6xl">
                    {fact.value}
                  </dd>
                  {fact.detail && (
                    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                      {fact.detail}
                    </p>
                  )}
                </div>
              ))}
            </dl>
            <Separator />
            <a
              href="https://www.honusubs.com/subs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Explore the published Honu specifications
              <ArrowUpRightIcon className="size-3" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </section>
        <Separator />
        <HonuAnatomy />
        <HonuMission />
        <section
          id="honu-xr"
          className="scroll-mt-36 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
          aria-labelledby="xr-title"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <figure>
              <div className="relative aspect-[1.1] overflow-hidden rounded-[2rem]">
                <Image
                  src="/launch-party.webp"
                  alt="Three people sharing the view inside Honu’s clear observation dome"
                  fill
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {copy.xr.caption}
              </figcaption>
            </figure>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {copy.xr.eyebrow}
              </p>
              <h2
                id="xr-title"
                className="mt-5 font-header text-6xl leading-none sm:text-7xl"
              >
                {copy.xr.title}
                <span className="mt-2 block font-display text-[0.58em] italic text-primary">
                  {copy.xr.accent}
                </span>
              </h2>
              <p className="mt-7 text-sm leading-7 text-muted-foreground">
                {copy.xr.body}
              </p>
              <div className="mt-7">
                <HomeVrLightbox
                  label={copy.xr.cta}
                  labels={{
                    recording: "Honu XR · ocean film",
                    depth: "360° exploration",
                    dragHint: "Drag to look around",
                  }}
                  locale="en"
                  src="/vr-clip.mp4"
                  title="Explore the ocean in 360°"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {copy.xr.note}
              </p>
            </div>
          </div>
        </section>
        <section
          id="support-honu"
          className="relative scroll-mt-36 overflow-hidden border-y border-border bg-secondary/30 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
          aria-labelledby="support-title"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {copy.support.eyebrow}
              </p>
              <h2
                id="support-title"
                className="mt-5 font-header text-6xl leading-none sm:text-7xl lg:text-8xl"
              >
                {copy.support.title}
                <span className="mt-2 block font-display text-[0.65em] italic text-primary">
                  {copy.support.accent}
                </span>
              </h2>
              <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground">
                {copy.support.body}
              </p>
              <p className="mt-4 text-sm leading-7">{copy.support.closing}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="donate"
                  size="lg"
                  className="rounded-full px-5"
                >
                  <Link href="/donate">
                    {copy.support.donate}
                    <ArrowUpRightIcon
                      data-icon="inline-end"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-5"
                >
                  <Link href="/contact">{copy.support.contact}</Link>
                </Button>
              </div>
            </div>
            <ol className="flex flex-col justify-center gap-7">
              {copy.support.paths.map((path) => (
                <li key={path.number}>
                  <div className="flex gap-5">
                    <span className="mt-2 font-mono text-xs text-primary">
                      {path.number}
                    </span>
                    <div>
                      <h3 className="font-header text-3xl">{path.title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                        {path.body}
                      </p>
                    </div>
                  </div>
                  <Separator className="mt-7" />
                </li>
              ))}
            </ol>
          </div>
        </section>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-6 py-10 sm:flex-row sm:items-center sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <WavesIcon
              className="size-6 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              The ocean cools an island, too.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/island/swac">
              Explore the SWAC expedition
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </main>
      <Separator />
      <SiteFooter copy={homeCopies.en.footer} />
    </>
  );
}
