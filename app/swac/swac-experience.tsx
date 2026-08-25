import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import { DocumentLanguage } from "@/app/document-language";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { SwacMotionProvider } from "./motion-provider";
import { SwacHero } from "./swac-hero";
import { WhatIsSwac } from "./what-is-swac";
import { TheDive } from "./the-dive";
import { TheMeter } from "./the-meter";
import { TheSlope } from "./the-slope";
import { FeasibilityGlobe } from "./feasibility-globe";
import { swacCopies, type SwacLocale } from "./swac-content";
import styles from "./swac.module.css";

const sourceHrefs = {
  society: {
    en: "https://www.tetiaroasociety.org/island/swac",
    fr: "https://www.tetiaroasociety.org/fr/island/swac",
  },
  makai: "https://www.makai.com/ocean-engineering/seawater-air-conditioning/",
  nrel: "https://www.nrel.gov/water/marine-energy-resource-assessment",
  otec: "https://www.ocean-energy-systems.org/",
  honolulu: "https://files.hawaii.gov/dbedt/erp/Publications/SWAC-EIS.pdf",
  cornell: "https://energyandsustainability.fs.cornell.edu/util/cooling/production/lsc/default.cfm",
} as const;

type SwacExperienceProps = {
  locale: SwacLocale;
};

export function SwacExperience({ locale }: SwacExperienceProps) {
  const copy = swacCopies[locale];
  const homeCopy = homeCopies[locale];
  const toolbarCopy = {
    ...homeCopy.toolbar,
    languageHref: copy.languageHref,
    languageLabel: locale === "en" ? "FR" : "EN",
    languageHrefLang: locale === "en" ? "fr" : "en",
    languageLang: locale === "en" ? "fr" : "en",
    languageAriaLabel:
      locale === "en"
        ? "Lire cette page en français"
        : "Read this page in English",
  };

  const sources = [
    { label: copy.sources.labels.society, href: sourceHrefs.society[locale] },
    { label: copy.sources.labels.makai, href: sourceHrefs.makai },
    { label: copy.sources.labels.nrel, href: sourceHrefs.nrel },
    { label: copy.sources.labels.otec, href: sourceHrefs.otec },
    { label: copy.sources.labels.honolulu, href: sourceHrefs.honolulu },
    { label: copy.sources.labels.cornell, href: sourceHrefs.cornell },
  ];

  return (
    <SwacMotionProvider>
      <DocumentLanguage lang={locale} />
      <TopToolbar copy={toolbarCopy} />
      <main className={styles.page}>
        <SwacHero copy={copy.hero} />
        <TheDive copy={copy.dive} />
        <WhatIsSwac copy={copy.basics} />
        <TheMeter copy={copy.meter} locale={locale} />
        <TheSlope copy={copy.slope} />
        <FeasibilityGlobe copy={copy.globe} />

        <section className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {copy.hard.eyebrow}
              </p>
              <h2 className="font-header text-5xl leading-[0.9] text-foreground sm:text-7xl">
                {copy.hard.title}
              </h2>
              <p className="max-w-lg text-base leading-7 text-muted-foreground">
                {copy.hard.intro}
              </p>
            </div>
            <ol className="flex flex-col">
              {copy.hard.items.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-5 border-t border-border py-6 last:border-b"
                >
                  <span className="font-header text-4xl leading-none text-primary/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="font-display text-2xl leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {copy.sources.eyebrow}
              </p>
              <h2 className="font-header text-5xl leading-[0.9] text-foreground sm:text-7xl">
                {copy.sources.title}
              </h2>
              <p className="max-w-lg text-base leading-7 text-muted-foreground">
                {copy.sources.intro}
              </p>
            </div>
            <ol className="flex flex-col">
              {sources.map((source, index) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex min-h-24 items-center gap-5 border-t border-border py-5 text-foreground transition-colors hover:text-primary last:border-b"
                  >
                    <span className="font-header text-4xl text-primary/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-base leading-6">
                      {source.label}
                    </span>
                    <ExternalLinkIcon
                      className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.closingSection}>
          <div
            className="absolute inset-0 bg-[url('/geology/reef-shore.webp')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className={styles.closingScrim} aria-hidden="true" />
          <div className="relative mx-auto grid min-h-[80svh] max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {copy.cta.eyebrow}
              </p>
              <h2 className="mt-6 font-header text-6xl leading-[0.88] text-foreground sm:text-7xl lg:text-8xl">
                {copy.cta.title}
              </h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-foreground/80 sm:text-lg">
                {copy.cta.body}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="impact" className="h-auto rounded-full px-5 py-3">
                  <Link href={copy.cta.contactHref}>
                    {copy.cta.contactLabel}
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto rounded-full bg-background/30 px-5 py-3 backdrop-blur-sm"
                >
                  <Link href={copy.cta.stationsHref}>{copy.cta.stationsLabel}</Link>
                </Button>
                <Button asChild size="lg" variant="donate" className="h-auto rounded-full px-5 py-3">
                  <Link href={copy.cta.donateHref}>{copy.cta.donateLabel}</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-background/55 p-6 backdrop-blur-md sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {copy.cta.expertiseLabel}
              </p>
              <ul className="mt-5 flex flex-col">
                {copy.cta.expertise.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-t border-border py-4 text-base leading-6 text-foreground/85 last:border-b"
                  >
                    <CheckIcon
                      className="mt-1 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Separator />
      <SiteFooter copy={homeCopy.footer} />
    </SwacMotionProvider>
  );
}
