import type { CSSProperties, PropsWithChildren } from "react";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentLanguage } from "../document-language";
import { homeCopies } from "../home-copy";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import {
  getPillarPath,
  pillarContent,
  pillarSlugs,
  pillarUiCopy,
  type PillarLink,
  type PillarLocale,
  type PillarSlug,
} from "./pillar-content";

export const paperVars = {
  "--background": "var(--paper)",
  "--foreground": "var(--ink)",
  "--card": "rgb(255 252 243 / 0.92)",
  "--card-foreground": "var(--ink)",
  "--muted": "rgb(7 16 14 / 0.08)",
  "--muted-foreground": "rgb(7 16 14 / 0.66)",
  "--border": "rgb(7 16 14 / 0.16)",
  "--primary": "var(--lagoon)",
  "--primary-foreground": "var(--paper)",
  "--secondary": "rgb(31 107 110 / 0.12)",
  "--secondary-foreground": "var(--lagoon)",
} as CSSProperties;

export function PillarChrome({
  locale,
  slug,
  children,
}: PropsWithChildren<{ locale: PillarLocale; slug: PillarSlug }>) {
  const counterpartLocale = locale === "fr" ? "en" : "fr";
  const toolbarCopy = {
    ...homeCopies[locale].toolbar,
    languageHref: getPillarPath(counterpartLocale, slug),
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: counterpartLocale,
    languageLang: counterpartLocale,
    languageAriaLabel:
      locale === "fr" ? "Read this page in English" : "Lire cette page en français",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <DocumentLanguage lang={locale} />
      <TopToolbar copy={toolbarCopy} />
      {children}
      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}

export function PillarEndMatter({
  locale,
  slug,
}: {
  locale: PillarLocale;
  slug: PillarSlug;
}) {
  const copy = pillarContent[locale][slug];
  const ui = pillarUiCopy[locale];
  const otherPillars = pillarSlugs.filter((pillarSlug) => pillarSlug !== slug);
  const donateHref = locale === "fr" ? "/fr/donate" : "/donate";

  return (
    <>
      <section className="bg-background px-5 py-16 text-foreground md:px-8 lg:px-12 lg:py-24" style={paperVars}>
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(280px,0.5fr)] md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {ui.relatedEyebrow}
              </p>
              <h2 className="mt-3 font-header text-5xl uppercase leading-none sm:text-6xl">
                {ui.relatedTitle}
              </h2>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              {ui.relatedCopy}
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.links.map((link) => (
              <PillarLinkCard key={link.href} link={link} openLabel={ui.openLabel} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1450px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {ui.otherEyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            {ui.otherTitle}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {otherPillars.map((otherSlug) => {
              const other = pillarContent[locale][otherSlug];

              return (
                <Link
                  key={otherSlug}
                  href={getPillarPath(locale, otherSlug)}
                  className="group rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Card className="h-full rounded-md transition-[border-color,transform] group-hover:-translate-y-1 group-hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <span className="font-header text-5xl text-primary/40">
                          {other.number}
                        </span>
                        <ArrowRightIcon
                          className="size-5 text-primary transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                      <CardTitle>
                        <h3 className="font-display text-3xl">{other.title}</h3>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="mt-auto text-sm text-muted-foreground">
                      {ui.otherAction}
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 overflow-hidden rounded-xl bg-[linear-gradient(115deg,var(--lagoon),var(--ink-2)_76%)] p-7 shadow-2xl sm:p-10 lg:p-12">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-4xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {ui.donateEyebrow}
                </p>
                <h2 className="mt-3 font-header text-4xl uppercase leading-none sm:text-6xl">
                  {ui.donateTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/75">
                  {ui.donateCopy}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                variant={slug === "research-conservation" ? "donate" : "default"}
                className="w-fit"
              >
                <Link href={donateHref}>
                  {ui.donateAction}
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PillarLinkCard({
  link,
  openLabel,
}: {
  link: PillarLink;
  openLabel: string;
}) {
  const card = (
    <Card className="h-full rounded-md transition-[border-color,transform] group-hover:-translate-y-1 group-hover:border-primary/50">
      <CardHeader>
        <CardTitle>
          <h3 className="font-display text-2xl leading-tight">{link.label}</h3>
        </CardTitle>
        <CardDescription className="pt-2 leading-6">
          {link.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-primary">
        {openLabel}
        {link.external ? (
          <ExternalLinkIcon className="size-4" aria-hidden="true" />
        ) : (
          <ArrowRightIcon
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </CardFooter>
    </Card>
  );
  const className =
    "group rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer noopener" className={className}>
        {card}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {card}
    </Link>
  );
}
