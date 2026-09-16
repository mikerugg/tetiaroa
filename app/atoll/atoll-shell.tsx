import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { SiteFooter } from "@/app/site-footer";
import { homeCopies } from "@/app/home-copy";
import { getAtollPath } from "@/lib/atoll/config";
import type { GuideLocale } from "@/lib/atoll/types";
import { atollCopy } from "./atoll-copy";
import { AtollToolbar } from "./atoll-toolbar";

export function AtollShell({ locale, alternateHref, children }: { locale: GuideLocale; alternateHref: string; children: React.ReactNode }) {
  const copy = atollCopy[locale];
  const site = homeCopies[locale];
  const opposite = locale === "fr" ? "en" : "fr";
  return <div className="min-h-screen bg-background text-foreground" lang={locale}>
    <a href="#atoll-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-50 focus:rounded-md focus:bg-primary focus:px-5 focus:py-3 focus:text-primary-foreground">{copy.skip}</a>
    <AtollToolbar copy={{ ...site.toolbar, atollHref: getAtollPath(locale), languageHref: alternateHref, languageLabel: opposite.toUpperCase(), languageHrefLang: opposite, languageLang: opposite, languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français" }} />
    <main id="atoll-content" className="pt-[var(--toolbar-height)]">
      {children}
    </main>
    <SiteFooter copy={site.footer} />
  </div>;
}

export function AtollBreadcrumbs({ locale, items = [] }: { locale: GuideLocale; items?: { title: string; href?: string }[] }) {
  const crumbs = [{ title: atollCopy[locale].atoll, href: getAtollPath(locale) }, ...items];
  return <nav aria-label={atollCopy[locale].breadcrumbs} className="mb-4">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {crumbs.map((item, index) => <li key={`${item.title}-${index}`} className="flex items-center gap-2">
        {index > 0 && <ChevronRightIcon aria-hidden="true" className="size-3" />}
        {item.href ? <Link href={item.href} className="transition-colors hover:text-foreground focus-visible:underline">{item.title}</Link> : <span aria-current="page" className="text-foreground">{item.title}</span>}
      </li>)}
    </ol>
  </nav>;
}

export function AtollEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{children}</p>;
}
