"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowUpRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HomepageHighlight } from "@/lib/impact/homepage-highlight";
import { cn } from "@/lib/utils";
import styles from "./home-experience.module.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type HomeHighlightCarouselLabels = {
  eyebrow: string;
  cta: string;
  carouselLabel: string;
  previousLabel: string;
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
  ofLabel: string;
};

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function HomeHighlightCarousel({
  highlights,
  labels,
}: {
  highlights: HomepageHighlight[];
  labels: HomeHighlightCarouselLabels;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const hasMultipleHighlights = highlights.length > 1;
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 7000,
      playOnInit: false,
      stopOnFocusIn: false,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );
  const plugins = useMemo(
    () => (hasMultipleHighlights ? [autoplay] : []),
    [autoplay, hasMultipleHighlights],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateSelectedIndex = () => setSelectedIndex(api.selectedScrollSnap());

    const frame = window.requestAnimationFrame(updateSelectedIndex);
    api.on("select", updateSelectedIndex);
    api.on("reInit", updateSelectedIndex);

    return () => {
      window.cancelAnimationFrame(frame);
      api.off("select", updateSelectedIndex);
      api.off("reInit", updateSelectedIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !hasMultipleHighlights) {
      return;
    }

    const shouldPlay =
      !reducedMotion &&
      !userPaused &&
      !isHovered &&
      !hasFocusWithin;

    if (shouldPlay) {
      autoplay.play();
    } else {
      autoplay.stop();
    }

    return () => autoplay.stop();
  }, [
    autoplay,
    api,
    hasFocusWithin,
    hasMultipleHighlights,
    isHovered,
    reducedMotion,
    userPaused,
  ]);

  return (
    <section className={styles.highlight} id="highlight">
      <Carousel
        className="mx-auto max-w-[1240px]"
        opts={{ align: "start", loop: hasMultipleHighlights }}
        plugins={plugins}
        setApi={setApi}
        aria-label={labels.carouselLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setHasFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setHasFocusWithin(false);
          }
        }}
        onPointerDownCapture={() => {
          if (api && hasMultipleHighlights) {
            autoplay.reset();
          }
        }}
      >
        <CarouselContent className="-ml-0">
          {highlights.map((highlight, index) => (
            <CarouselItem
              key={highlight.id}
              className="pl-0"
              aria-label={`${index + 1} ${labels.ofLabel} ${highlights.length}`}
            >
              <div className={styles.highlightInner}>
                <figure className={styles.highlightMedia}>
                  <div className={styles.highlightFrame}>
                    <Image
                      src={highlight.image}
                      alt={highlight.imageAlt}
                      width={2048}
                      height={1365}
                      className={styles.highlightImage}
                      sizes="(max-width: 860px) 82vw, 460px"
                    />
                  </div>
                  <figcaption className={`${styles.highlightCaption} font-mono`}>
                    {highlight.imageAlt}
                  </figcaption>
                </figure>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    styles.highlightAction,
                    "hidden h-auto font-mono max-[640px]:order-3 max-[640px]:mt-1.5 max-[640px]:inline-flex max-[640px]:justify-self-center",
                  )}
                >
                  <a href={highlight.href}>
                    {labels.cta}
                    <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
                  </a>
                </Button>
                <div className={styles.highlightCopy}>
                  <div className={`${styles.highlightEyebrow} font-mono`}>
                    {labels.eyebrow}
                  </div>
                  <h2 className={`${styles.highlightTitle} font-header`}>
                    {highlight.title}
                  </h2>
                  <p className={styles.highlightText}>{highlight.summary}</p>
                  <Button
                    asChild
                    variant="outline"
                    className={cn(
                      styles.highlightAction,
                      "h-auto font-mono max-[640px]:hidden",
                    )}
                  >
                    <a href={highlight.href}>
                      {labels.cta}
                      <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {hasMultipleHighlights ? (
          <div className="mt-9 flex items-center justify-center gap-3">
            <CarouselPrevious
              size="icon-lg"
              className={cn("static", styles.highlightControl)}
              aria-label={labels.previousLabel}
            />
            <span
              className={`${styles.highlightCounter} font-mono`}
              aria-live={userPaused || reducedMotion ? "polite" : "off"}
              aria-atomic="true"
            >
              {selectedIndex + 1} {labels.ofLabel} {highlights.length}
            </span>
            {!reducedMotion ? (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className={styles.highlightControl}
                aria-label={userPaused ? labels.playLabel : labels.pauseLabel}
                onClick={() => setUserPaused((paused) => !paused)}
              >
                {userPaused ? (
                  <PlayIcon data-icon="inline-start" aria-hidden="true" />
                ) : (
                  <PauseIcon data-icon="inline-start" aria-hidden="true" />
                )}
              </Button>
            ) : null}
            <CarouselNext
              size="icon-lg"
              className={cn("static", styles.highlightControl)}
              aria-label={labels.nextLabel}
            />
          </div>
        ) : null}
      </Carousel>
    </section>
  );
}
