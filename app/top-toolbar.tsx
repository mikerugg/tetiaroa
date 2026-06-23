import Image from "next/image";
import Link from "next/link";
import { Globe2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRENCH_HOME_PATH, ENGLISH_TEAM_PATH } from "./language-links";

export type TopToolbarCopy = {
  ariaLabel: string;
  homeHref: string;
  teamHref: string;
  teamLabel: string;
  logoLabel: string;
  languageHref: string;
  languageLabel: string;
  languageHrefLang: string;
  languageLang: string;
  languageAriaLabel: string;
  donateHref: string;
  donateLabel: string;
};

const toolbarButtonClass =
  "h-auto rounded-full border-primary/40 bg-background/20 px-3 py-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:bg-primary/10 hover:text-primary max-[420px]:px-2.5 max-[420px]:tracking-[0.12em]";

const defaultCopy: TopToolbarCopy = {
  ariaLabel: "Primary",
  homeHref: "/",
  teamHref: ENGLISH_TEAM_PATH,
  teamLabel: "Our Team",
  logoLabel: "Our Logo",
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
      className="fixed inset-x-0 top-0 z-40 flex h-14 justify-between gap-4 border-b border-border bg-background/30 px-4 backdrop-blur-md md:h-16 md:px-7"
      aria-label={copy.ariaLabel}
    >
      <Link
        href={copy.homeHref}
        className="relative h-full w-40 shrink-0 overflow-hidden max-[420px]:w-28 md:w-48"
      >
        <Image
          src="/logos/TSFP_Logo_2026_White.png"
          alt="Tetiaroa Society"
          width={596}
          height={371}
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 shrink-0 object-contain max-[420px]:h-16 md:h-24"
          priority
        />
      </Link>

      <div className="flex h-full items-center gap-[22px] text-sm text-foreground/85 max-[860px]:gap-3.5 max-[420px]:gap-2 max-[860px]:text-[13px]">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={toolbarButtonClass}
        >
          <Link href={copy.teamHref}>{copy.teamLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={`${toolbarButtonClass} max-[520px]:hidden`}
        >
          <Link href="/our-logo">{copy.logoLabel}</Link>
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
          className="donate-lava h-auto rounded-full px-[18px] py-2 font-semibold text-[var(--ink)] shadow-[0_0_18px_rgba(249,115,22,0.28)] transition-[filter,transform] duration-300 hover:-translate-y-px hover:text-[var(--ink)] hover:brightness-110 max-[420px]:px-3"
        >
          <Link href={copy.donateHref}>{copy.donateLabel}</Link>
        </Button>
      </div>
    </nav>
  );
}
