import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import { DocumentLanguage } from "@/app/document-language";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { FormationScrolly } from "./formation-scrolly";
import { GeologyHero } from "./geology-hero";
import { ModernAtollMap } from "./modern-atoll-map";
import { SeaLevelMachine } from "./sea-level-machine";
import { TahitiFlexure } from "./tahiti-flexure";
import { geologyCopies, type GeologyLocale } from "./geology-content";
import styles from "./geology.module.css";

const sourceHrefs = {
  society: {
    en: "https://www.tetiaroasociety.org/island/geology",
    fr: "https://www.tetiaroasociety.org/fr/ile/geologie",
  },
  lithosphere: "https://academic.oup.com/gji/article/147/1/123/608429",
  moorea: "https://doi.org/10.1016/j.jvolgeores.2026.108555",
  seaLevel: "https://www.nature.com/articles/s41586-018-0335-4",
} as const;

type GeologyExperienceProps = {
  locale: GeologyLocale;
};

export function GeologyExperience({ locale }: GeologyExperienceProps) {
  const copy = geologyCopies[locale];
  const homeCopy = homeCopies[locale];
  const toolbarCopy = {
    ...homeCopy.toolbar,
    languageHref: copy.languageHref,
    languageLabel: locale === "en" ? "FR" : "EN",
    languageHrefLang: locale === "en" ? "fr" : "en",
    languageLang: locale === "en" ? "fr" : "en",
    languageAriaLabel:
      locale === "en" ? "Lire cette page en français" : "Read this page in English",
  };
  const sources = [
    {
      label: copy.sources.labels.society,
      href: sourceHrefs.society[locale],
    },
    {
      label: copy.sources.labels.lithosphere,
      href: sourceHrefs.lithosphere,
    },
    {
      label: copy.sources.labels.moorea,
      href: sourceHrefs.moorea,
    },
    {
      label: copy.sources.labels.seaLevel,
      href: sourceHrefs.seaLevel,
    },
  ];

  return (
    <>
      <DocumentLanguage lang={locale} />
      <TopToolbar copy={toolbarCopy} />
      <main className={styles.page}>
        <GeologyHero copy={copy.hero} />
        <FormationScrolly
          story={copy.story}
          stages={copy.stages}
        />

        <section className={styles.fieldNoteSection}>
          <div className={styles.fieldNoteImage}>
            <Image
              src="/geology/reef-shore.webp"
              alt={copy.fieldNote.imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, 58vw"
              className="object-cover"
            />
            <div className={styles.fieldNoteImageWash} aria-hidden="true" />
          </div>
          <div className="flex flex-col justify-center gap-5 px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {copy.fieldNote.eyebrow}
            </p>
            <h2 className="max-w-xl font-display text-5xl leading-none text-foreground sm:text-6xl">
              {copy.fieldNote.title}
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {copy.fieldNote.body}
            </p>
          </div>
        </section>

        <TahitiFlexure copy={copy.flexure} />
        <SeaLevelMachine copy={copy.seaLevel} />
        <ModernAtollMap copy={copy.map} />

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
                    <ExternalLinkIcon className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.closingSection}>
          <Image
            src={copy.hero.posterSrc}
            alt={copy.hero.posterAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className={styles.closingScrim} aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[82svh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {copy.cta.eyebrow}
            </p>
            <h2 className="mt-6 font-header text-6xl leading-[0.88] text-foreground sm:text-8xl lg:text-9xl">
              {copy.cta.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg">
              {copy.cta.body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="impact" className="h-auto rounded-full px-5 py-3">
                <Link href={copy.cta.researchHref}>
                  {copy.cta.researchLabel}
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-auto rounded-full bg-background/30 px-5 py-3 backdrop-blur-sm">
                <a
                  href="https://recherche.upf.pf/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {copy.cta.gisLabel}
                  <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="donate" className="h-auto rounded-full px-5 py-3">
                <Link href={copy.cta.donateHref}>{copy.cta.donateLabel}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Separator />
      <SiteFooter copy={homeCopy.footer} />
    </>
  );
}
