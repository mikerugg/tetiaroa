"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CheckCircle2Icon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { HomeLocale } from "../home-copy";
import { TetiaroaMark } from "../tetiaroa-mark";
import { sitePopupConfig, type SitePopupConfig } from "./site-popup-config";
import { sitePopupCopies, type SitePopupImageCopy } from "./site-popup-copy";
import { SitePopupNewsletterForm } from "./site-popup-newsletter-form";
import { useSitePopupTrigger } from "./use-site-popup-trigger";

/** Long enough to read the confirmation, short enough to get out of the way. */
const successCloseDelayMs = 5_000;

const shellClassName = cn(
  // Mobile: a card resting above the bottom edge, so the page stays visible.
  "fixed inset-x-3 bottom-3 top-auto z-50 max-h-[calc(100dvh-1.5rem)] w-auto max-w-none translate-x-0 translate-y-0",
  // Desktop: centred, two columns, image on the left.
  "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2",
  "gap-0 overflow-hidden overflow-y-auto rounded-2xl border border-border bg-popover p-0 text-popover-foreground shadow-[0_40px_120px_-30px_rgb(0_0_0_/_0.9)] ring-1 ring-foreground/10",
  "data-open:slide-in-from-bottom-6 sm:data-open:slide-in-from-bottom-0",
);

function PopupImage({ image }: { image: SitePopupImageCopy }) {
  return (
    // The strip is decoration: on short phones the form needs the room more.
    <div className="relative h-20 shrink-0 max-sm:[@media(max-height:720px)]:hidden sm:h-auto">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 100vw, 216px"
        className="object-cover"
        style={{ objectPosition: image.position }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-popover via-popover/30 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-popover/10 sm:to-popover"
        aria-hidden="true"
      />
    </div>
  );
}

export function SitePopup({
  locale = "en",
  config = sitePopupConfig,
}: {
  locale?: HomeLocale;
  config?: SitePopupConfig;
}) {
  const { isOpen, variant, close, handleSubscribed } =
    useSitePopupTrigger(config);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const copies = sitePopupCopies[locale];
  const copy = copies[variant];

  const onSubscribed = useCallback(() => {
    handleSubscribed();
    setIsSubscribed(true);
  }, [handleSubscribed]);

  useEffect(() => {
    if (!isSubscribed) {
      return;
    }

    const timer = window.setTimeout(close, successCloseDelayMs);

    return () => window.clearTimeout(timer);
  }, [isSubscribed, close]);

  const newsletter = copies.newsletter;
  // After a signup the panel stops selling and confirms instead.
  const hasSubscribed = variant === "newsletter" && isSubscribed;
  const title = hasSubscribed ? newsletter.successTitle : copy.title;
  const description = hasSubscribed
    ? newsletter.successBody
    : copy.description;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <DialogContent
        ref={contentRef}
        tabIndex={-1}
        showCloseButton={false}
        className={shellClassName}
        // The panel takes focus for screen readers only; the global
        // :focus-visible outline is unlayered, so inline style is what beats it.
        style={{ outline: "none" }}
        onOpenAutoFocus={(event) => {
          // Land on the panel itself: screen readers hear the title, and no
          // mobile keyboard springs open over the page.
          event.preventDefault();
          contentRef.current?.focus();
        }}
      >
        <div
          className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-primary/70 to-transparent"
          aria-hidden="true"
        />

        <div className="grid sm:grid-cols-[13.5rem_minmax(0,1fr)]">
          <PopupImage image={copy.image} />

          <div className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-6">
            <div className="flex items-center gap-2">
              <TetiaroaMark className="size-4 shrink-0 text-primary" />
              <p className="font-mono text-[11px] uppercase leading-4 tracking-[0.18em] text-primary">
                {copy.eyebrow}
              </p>
            </div>

            {hasSubscribed ? (
              <div
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary"
                aria-hidden="true"
              >
                <CheckCircle2Icon className="size-5" />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <DialogTitle className="font-header text-3xl leading-[0.95] tracking-wide text-foreground sm:text-4xl">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6">
                {description}
              </DialogDescription>
            </div>

            {variant === "newsletter" ? (
              <>
                {hasSubscribed ? null : (
                  // Hidden on phones: the panel stays short enough to leave the
                  // page visible behind it.
                  <ul className="hidden flex-col gap-1.5 text-sm leading-6 text-muted-foreground sm:flex">
                    {newsletter.promises.map((promise) => (
                      <li key={promise} className="flex items-start gap-2">
                        <span
                          className="mt-[0.5em] size-1 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        {promise}
                      </li>
                    ))}
                  </ul>
                )}

                <SitePopupNewsletterForm
                  copy={newsletter}
                  locale={locale}
                  onSubscribed={onSubscribed}
                  turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()}
                />
              </>
            ) : (
              <>
                <Badge
                  variant="outline"
                  className="h-auto w-fit font-mono text-[11px] uppercase tracking-[0.14em]"
                >
                  {copies.announcement.stat}
                </Badge>
                <Button asChild variant="donate" size="lg" className="w-full">
                  <Link href={copies.announcement.ctaHref} onClick={close}>
                    {copies.announcement.ctaLabel}
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              {hasSubscribed ? null : (
                <p className="max-w-88 text-[11px] leading-4 text-muted-foreground/80">
                  {copy.footnote}
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                {hasSubscribed
                  ? newsletter.successCloseLabel
                  : copy.dismissLabel}
              </Button>
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={copy.closeLabel}
            className="absolute right-2 top-2 rounded-full bg-background/60 text-foreground/80 backdrop-blur-sm hover:bg-background hover:text-foreground"
          >
            <XIcon data-icon="inline-start" aria-hidden="true" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
