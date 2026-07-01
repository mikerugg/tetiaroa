import Image from "next/image";
import Link from "next/link";
import { Globe2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FRENCH_HOME_PATH, ENGLISH_TEAM_PATH } from "./language-links";

export type TopToolbarCopy = {
  ariaLabel: string;
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

const defaultCopy: TopToolbarCopy = {
  ariaLabel: "Primary",
  homeHref: "/",
  teamHref: ENGLISH_TEAM_PATH,
  teamLabel: "Our Team",
  impactHref: "/impact",
  impactLabel: "Impact Feed",
  logoLabel: "Our Logo",
  storyHref: "/brando-story",
  storyLabel: "Our Story",
  languageHref: FRENCH_HOME_PATH,
  languageLabel: "FR",
  languageHrefLang: "fr",
  languageLang: "fr",
  languageAriaLabel: "Lire en français",
  donateHref: "/#donation-levels",
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

      <div className="flex h-full min-w-0 items-center gap-[18px] text-sm text-foreground/85 max-[860px]:gap-2.5 max-[420px]:gap-1.5 max-[860px]:text-[13px]">
        <Button
          asChild
          size="sm"
          className={cn(
            toolbarButtonClass,
            "border-toolbar-impact bg-toolbar-impact font-bold shadow-toolbar-impact hover:border-toolbar-impact-hover hover:bg-toolbar-impact-hover",
          )}
        >
          <Link href={copy.impactHref}>{copy.impactLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarButtonClass, "max-[640px]:hidden")}
        >
          <Link href={copy.teamHref}>{copy.teamLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarButtonClass, "max-[900px]:hidden")}
        >
          <Link href="/our-logo">{copy.logoLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(toolbarButtonClass, "max-[900px]:hidden")}
        >
          <Link href={copy.storyHref}>{copy.storyLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={toolbarButtonClass}
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
          className="donate-lava h-auto rounded-full px-[18px] py-2 font-semibold text-ink-light shadow-toolbar-donate transition-[filter,transform] duration-300 hover:-translate-y-px hover:text-ink-light hover:brightness-110 max-[420px]:px-2.5"
        >
          <Link href={copy.donateHref}>{copy.donateLabel}</Link>
        </Button>
      </div>
    </nav>
  );
}
