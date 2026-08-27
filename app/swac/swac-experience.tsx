import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
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
import { FeasibilityGlobe } from "./feasibility-globe";
import { swacCopies, type SwacLocale } from "./swac-content";
import styles from "./swac.module.css";

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

  return (
    <SwacMotionProvider>
      <DocumentLanguage lang={locale} />
      <TopToolbar copy={toolbarCopy} />
      <main className={styles.page}>
        <SwacHero copy={copy.hero} />
        <TheDive copy={copy.dive} />
        <WhatIsSwac copy={copy.basics} />
        <TheMeter copy={copy.meter} locale={locale} />
        <FeasibilityGlobe copy={copy.globe} />

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
