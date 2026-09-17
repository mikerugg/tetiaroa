"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowDownRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { honuCopy } from "./honu-content";
import styles from "./honu-motion.module.css";

export function HonuHero() {
  const [paused, setPaused] = useState(false);
  const copy = honuCopy.hero;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-background pt-14 md:pt-16",
        paused && styles.paused,
      )}
      aria-labelledby="honu-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,var(--lagoon)_0%,transparent_65%)] opacity-55"
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute -inset-20 opacity-25",
          styles.particles,
        )}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
          <p>{copy.eyebrow}</p>
          <p className="hidden sm:block">17° S / 149° W</p>
        </div>
        <div className="relative grid pb-9 pt-7 lg:min-h-[650px] lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:pb-14">
          <div className="relative z-10 lg:pb-7">
            <h1
              id="honu-title"
              className="font-header text-[clamp(8.5rem,22vw,21rem)] leading-[0.83] tracking-[-0.035em]"
            >
              {copy.name}
            </h1>
            <p className="mt-7 text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">
              {copy.title}
              <br />
              <span className="font-display italic text-primary">
                {copy.accent}
              </span>
            </p>
            <p className="mt-5 max-w-[360px] text-sm leading-7 text-foreground/75 sm:text-base">
              {copy.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                variant="impact"
                size="lg"
                className="rounded-full px-5"
              >
                <a href="#field-mission">
                  {copy.dive}
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="#inside-honu">
                  {copy.explore}
                  <ArrowDownRightIcon
                    data-icon="inline-end"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </div>
          </div>
          <figure className="relative -mx-2 mt-6 sm:mx-0 lg:absolute lg:-right-14 lg:bottom-4 lg:mt-0 lg:w-[66%]">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 before:absolute before:inset-[12%] before:rounded-full before:border before:border-primary/10 after:absolute after:inset-[25%] after:rounded-full after:border after:border-primary/10"
              aria-hidden="true"
            />
            <div className={styles.float}>
              <Image
                src="/sub-render.webp"
                alt="Honu submersible with its clear observation dome, yellow fins, thrusters, and robotic arms"
                width={1318}
                height={1030}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 65vw, 95vw"
                className="relative w-full drop-shadow-[0_30px_45px_rgba(0,0,0,0.45)]"
              />
            </div>
            <figcaption className="relative mt-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground lg:mt-0">
              {copy.caption}
            </figcaption>
          </figure>
        </div>
        <div className="relative flex items-center justify-between gap-6 border-t border-border py-5">
          <p className="max-w-xs text-xs leading-5 text-muted-foreground sm:max-w-none">
            {copy.note}
          </p>
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              paused ? "Resume ocean animation" : "Pause ocean animation"
            }
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <PlayIcon data-icon="inline-start" aria-hidden="true" />
            ) : (
              <PauseIcon data-icon="inline-start" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
