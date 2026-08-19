"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TopToolbarMobileMenu } from "./top-toolbar-mobile-menu";
import {
  ENGLISH_DONATE_PATH,
  ENGLISH_GEOLOGY_PATH,
  ENGLISH_STATIONS_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_HOME_PATH,
} from "./language-links";

export type TopToolbarCopy = {
  ariaLabel: string;
  menuLabel: string;
  menuTitle: string;
  homeHref: string;
  teamHref: string;
  teamLabel: string;
  impactHref: string;
  impactLabel: string;
  logoLabel: string;
  storyHref: string;
  storyLabel: string;
  atollHref: string;
  atollLabel: string;
  stationsHref: string;
  stationsLabel: string;
  languageHref: string;
  languageLabel: string;
  languageHrefLang: string;
  languageLang: string;
  languageAriaLabel: string;
  donateHref: string;
  donateLabel: string;
};

const toolbarButtonClass =
  "h-auto rounded-full border-glow/40 bg-background/20 px-3 py-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-ink-light hover:border-glow/60 hover:bg-glow/10 hover:text-ink-light max-[420px]:px-2 max-[420px]:text-[10px] max-[420px]:tracking-[0.1em]";

const toolbarOutlineButtonClass = cn(
  toolbarButtonClass,
  "!border-glow hover:-translate-y-px hover:!border-glow hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] aria-[current=page]:-translate-y-px aria-[current=page]:!border-glow aria-[current=page]:bg-glow/10 aria-[current=page]:text-ink-light aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)]",
);

const toolbarIconButtonClass =
  "size-11 rounded-full border-glow/40 bg-background/20 text-ink-light hover:border-glow/60 hover:bg-glow/10 hover:text-ink-light";

const defaultCopy: TopToolbarCopy = {
  ariaLabel: "Primary",
  menuLabel: "Open navigation menu",
  menuTitle: "Navigation menu",
  homeHref: "/",
  teamHref: ENGLISH_TEAM_PATH,
  teamLabel: "Our Team",
  impactHref: "/impact",
  impactLabel: "Impact Feed",
  logoLabel: "Our Logo",
  storyHref: "/our-story",
  storyLabel: "Our Story",
  atollHref: ENGLISH_GEOLOGY_PATH,
  atollLabel: "Our Atoll",
  stationsHref: ENGLISH_STATIONS_PATH,
  stationsLabel: "Our Stations",
  languageHref: FRENCH_HOME_PATH,
  languageLabel: "FR",
  languageHrefLang: "fr",
  languageLang: "fr",
  languageAriaLabel: "Lire en français",
  donateHref: ENGLISH_DONATE_PATH,
  donateLabel: "Donate",
};

function isRouteActive(pathname: string, href: string) {
  const hrefPathname = href.split(/[?#]/, 1)[0]?.replace(/\/$/, "");

  if (!hrefPathname || !hrefPathname.startsWith("/")) {
    return false;
  }

  return pathname === hrefPathname || pathname.startsWith(`${hrefPathname}/`);
}

export function TopToolbar({ copy = defaultCopy }: { copy?: TopToolbarCopy }) {
  const pathname = usePathname();
  const activeHref = [
    copy.impactHref,
    copy.stationsHref,
    copy.teamHref,
    "/our-logo",
    copy.storyHref,
    copy.atollHref,
    copy.donateHref,
  ].find((href) => isRouteActive(pathname, href));

  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 flex h-14 justify-between gap-3 border-b border-border bg-background/30 px-3 backdrop-blur-md sm:px-4 md:h-16 md:px-7"
      aria-label={copy.ariaLabel}
    >
      <Link
        href={copy.homeHref}
        className="relative h-full w-40 shrink-0 overflow-hidden max-[420px]:w-24 md:w-48"
      >
        <Image
          src="/logos/TSFP_Logo_2026_White.png"
          alt="Tetiaroa Society"
          width={596}
          height={371}
          sizes="(max-width: 420px) 96px, (max-width: 768px) 160px, 192px"
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 shrink-0 object-contain max-[420px]:h-14 md:h-24"
          preload
        />
      </Link>

      <div className="hidden h-full min-w-0 items-center gap-[18px] text-sm text-foreground/85 min-[761px]:flex max-[860px]:gap-2.5 max-[420px]:gap-1.5 max-[860px]:text-[13px]">
        <Button
          asChild
          size="sm"
          className={cn(
            toolbarButtonClass,
            "border-toolbar-impact bg-toolbar-impact font-bold shadow-toolbar-impact hover:-translate-y-px hover:border-ink-light/70 hover:bg-toolbar-impact-hover hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] aria-[current=page]:-translate-y-px aria-[current=page]:border-ink-light/70 aria-[current=page]:bg-toolbar-impact-hover aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)]",
          )}
        >
          <Link
            href={copy.impactHref}
            aria-current={activeHref === copy.impactHref ? "page" : undefined}
          >
            {copy.impactLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[1100px]:hidden")}
        >
          <Link
            href={copy.storyHref}
            aria-current={activeHref === copy.storyHref ? "page" : undefined}
          >
            {copy.storyLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[1000px]:hidden")}
        >
          <Link
            href={copy.atollHref}
            aria-current={activeHref === copy.atollHref ? "page" : undefined}
          >
            {copy.atollLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[860px]:hidden")}
        >
          <Link
            href={copy.stationsHref}
            aria-current={activeHref === copy.stationsHref ? "page" : undefined}
          >
            {copy.stationsLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[1200px]:hidden")}
        >
          <Link
            href="/our-logo"
            aria-current={activeHref === "/our-logo" ? "page" : undefined}
          >
            {copy.logoLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[640px]:hidden")}
        >
          <Link
            href={copy.teamHref}
            aria-current={activeHref === copy.teamHref ? "page" : undefined}
          >
            {copy.teamLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={toolbarOutlineButtonClass}
        >
          <a
            href={copy.languageHref}
            hrefLang={copy.languageHrefLang}
            lang={copy.languageLang}
            aria-label={copy.languageAriaLabel}
          >
            <Globe2Icon data-icon="inline-start" aria-hidden="true" />
            {copy.languageLabel}
          </a>
        </Button>
        <Button
          asChild
          variant="donate"
          size="sm"
          className="h-auto rounded-full px-[18px] py-2 font-semibold aria-[current=page]:-translate-y-px aria-[current=page]:brightness-110 aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] max-[420px]:px-2.5"
        >
          <Link
            href={copy.donateHref}
            aria-current={activeHref === copy.donateHref ? "page" : undefined}
          >
            {copy.donateLabel}
          </Link>
        </Button>
      </div>

      <div className="flex h-full items-center gap-2 min-[761px]:hidden max-[360px]:gap-1.5">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "min-h-11 px-2.5")}
        >
          <a
            href={copy.languageHref}
            hrefLang={copy.languageHrefLang}
            lang={copy.languageLang}
            aria-label={copy.languageAriaLabel}
          >
            <Globe2Icon data-icon="inline-start" aria-hidden="true" />
            {copy.languageLabel}
          </a>
        </Button>
        <Button
          asChild
          variant="donate"
          size="sm"
          className="h-auto min-h-11 rounded-full px-3 py-2 font-semibold aria-[current=page]:-translate-y-px aria-[current=page]:brightness-110 aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] max-[360px]:px-2.5"
        >
          <Link
            href={copy.donateHref}
            aria-current={activeHref === copy.donateHref ? "page" : undefined}
          >
            {copy.donateLabel}
          </Link>
        </Button>
        <TopToolbarMobileMenu
          copy={copy}
          activeHref={activeHref}
          triggerClassName={toolbarIconButtonClass}
        />
      </div>
    </nav>
  );
}
