"use client";

import Link from "next/link";
import { Globe2Icon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { TopToolbarCopy } from "./top-toolbar";

const menuLinkClass =
  "flex min-h-12 items-center border px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-[background,border-color,box-shadow,transform,color] duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

const menuOutlineLinkClass = cn(
  menuLinkClass,
  "rounded-md border-glow/30 border-l-glow bg-background/20 text-ink-light shadow-[inset_3px_0_0_rgb(143_201_201_/_0.45)] hover:-translate-y-px hover:border-glow/60 hover:bg-glow/10 hover:text-ink-light hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.22)] aria-[current=page]:-translate-y-px aria-[current=page]:border-glow/60 aria-[current=page]:bg-glow/10 aria-[current=page]:text-ink-light aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.22)]",
);

const menuImpactLinkClass = cn(
  menuLinkClass,
  "rounded-md border-primary bg-lagoon-2/20 text-ink-light shadow-[inset_3px_0_0_var(--lagoon-2),0_0_18px_color-mix(in_oklch,var(--lagoon-2)_18%,transparent)] hover:-translate-y-px hover:border-primary hover:bg-lagoon/30 hover:text-ink-light hover:shadow-[inset_3px_0_0_var(--lagoon-2),0_6px_18px_rgb(0_0_0_/_0.24)] aria-[current=page]:-translate-y-px aria-[current=page]:border-primary aria-[current=page]:bg-lagoon/30 aria-[current=page]:text-ink-light aria-[current=page]:shadow-[inset_3px_0_0_var(--lagoon-2),0_6px_18px_rgb(0_0_0_/_0.24)]",
);

export function TopToolbarMobileMenu({
  copy,
  activeHref,
  triggerClassName,
}: {
  copy: TopToolbarCopy;
  activeHref?: string;
  triggerClassName?: string;
}) {
  const menuItems = [
    {
      href: copy.impactHref,
      label: copy.impactLabel,
      className: menuImpactLinkClass,
    },
    {
      href: copy.storyHref,
      label: copy.storyLabel,
      className: menuOutlineLinkClass,
    },
    {
      href: copy.atollHref,
      label: copy.atollLabel,
      className: menuOutlineLinkClass,
    },
    {
      href: copy.stationsHref,
      label: copy.stationsLabel,
      className: menuOutlineLinkClass,
    },
    { href: "/our-logo", label: copy.logoLabel, className: menuOutlineLinkClass },
    { href: copy.teamHref, label: copy.teamLabel, className: menuOutlineLinkClass },
  ];
  const languageLabel =
    copy.languageLabel === "FR" ? "Français" : copy.languageLabel;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={triggerClassName}
          aria-label={copy.menuLabel}
        >
          <MenuIcon data-icon="inline-start" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(88vw,22rem)] gap-0 border-border bg-background/95 p-0 text-foreground backdrop-blur-xl"
      >
        <SheetHeader className="border-b border-border bg-muted/30 p-5 pr-14">
          <SheetTitle className="font-header text-2xl leading-none tracking-normal">
            {copy.menuTitle}
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label={copy.menuTitle}
          className="flex flex-col gap-2 px-3 pb-3"
        >
          {menuItems.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className={item.className}
                aria-current={activeHref === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <Separator />
        <div className="flex flex-col gap-2 p-3">
          <SheetClose asChild>
            <a
              href={copy.languageHref}
              hrefLang={copy.languageHrefLang}
              lang={copy.languageLang}
              aria-label={copy.languageAriaLabel}
              className={cn(menuOutlineLinkClass, "gap-2")}
            >
              <Globe2Icon data-icon="inline-start" aria-hidden="true" />
              {languageLabel}
            </a>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={copy.donateHref}
              aria-current={
                activeHref === copy.donateHref ? "page" : undefined
              }
              className="donate-lava flex min-h-12 items-center rounded-md px-4 py-3 font-semibold text-ink-light shadow-toolbar-donate transition-[filter,box-shadow,transform] duration-300 hover:-translate-y-px hover:text-ink-light hover:brightness-110 hover:shadow-[0_6px_18px_rgb(0_0_0_/_0.24)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:-translate-y-px aria-[current=page]:brightness-110 aria-[current=page]:shadow-[0_6px_18px_rgb(0_0_0_/_0.24)]"
            >
              {copy.donateLabel}
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
