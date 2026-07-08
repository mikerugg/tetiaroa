import Image from "next/image";
import Link from "next/link";
import { Globe2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TopToolbarMobileMenu } from "./top-toolbar-mobile-menu";
import {
  ENGLISH_DONATE_PATH,
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
  "!border-glow hover:-translate-y-px hover:!border-glow hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)]",
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
  storyHref: "/brando-story/work",
  storyLabel: "Our Story",
  languageHref: FRENCH_HOME_PATH,
  languageLabel: "FR",
  languageHrefLang: "fr",
  languageLang: "fr",
  languageAriaLabel: "Lire en français",
  donateHref: ENGLISH_DONATE_PATH,
  donateLabel: "Donate",
};

export function TopToolbar({ copy = defaultCopy }: { copy?: TopToolbarCopy }) {
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
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 shrink-0 object-contain max-[420px]:h-14 md:h-24"
          priority
        />
      </Link>

      <div className="hidden h-full min-w-0 items-center gap-[18px] text-sm text-foreground/85 min-[761px]:flex max-[860px]:gap-2.5 max-[420px]:gap-1.5 max-[860px]:text-[13px]">
        <Button
          asChild
          size="sm"
          className={cn(
            toolbarButtonClass,
            "border-toolbar-impact bg-toolbar-impact font-bold shadow-toolbar-impact hover:-translate-y-px hover:border-ink-light/70 hover:bg-toolbar-impact-hover hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)]",
          )}
        >
          <Link href={copy.impactHref}>{copy.impactLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[640px]:hidden")}
        >
          <Link href={copy.teamHref}>{copy.teamLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[900px]:hidden")}
        >
          <Link href="/our-logo">{copy.logoLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarOutlineButtonClass, "max-[900px]:hidden")}
        >
          <Link href={copy.storyHref}>{copy.storyLabel}</Link>
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
          size="sm"
          className="donate-lava h-auto rounded-full px-[18px] py-2 font-semibold text-ink-light shadow-toolbar-donate transition-[filter,box-shadow,transform] duration-300 hover:-translate-y-px hover:text-ink-light hover:brightness-110 hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] max-[420px]:px-2.5"
        >
          <Link href={copy.donateHref}>{copy.donateLabel}</Link>
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
          size="sm"
          className="donate-lava h-auto min-h-11 rounded-full px-3 py-2 font-semibold text-ink-light shadow-toolbar-donate transition-[filter,box-shadow,transform] duration-300 hover:-translate-y-px hover:text-ink-light hover:brightness-110 hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.28)] max-[360px]:px-2.5"
        >
          <Link href={copy.donateHref}>{copy.donateLabel}</Link>
        </Button>
        <TopToolbarMobileMenu
          copy={copy}
          triggerClassName={toolbarIconButtonClass}
        />
      </div>
    </nav>
  );
}
