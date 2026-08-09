"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeVideoSources } from "../home-video-sources";
import { SproutBackgroundVideo } from "../sprout-background-video";
import type { GeologyCopy } from "./geology-content";
import { resolveMediaSource } from "./geology-content";
import styles from "./geology.module.css";

type GeologyHeroProps = {
  copy: GeologyCopy["hero"];
};

export function GeologyHero({ copy }: GeologyHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const posterSrc = resolveMediaSource(
    copy.posterSrc,
    "/geology/atoll-foundation-poster.webp",
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (reducedMotion.matches) {
        setIsPlaying(false);
      }
    };

    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);

    return () => reducedMotion.removeEventListener("change", syncMotionPreference);
  }, []);

  const togglePlayback = () => setIsPlaying((playing) => !playing);

  return (
    <section className={styles.hero} aria-label={copy.videoLabel}>
      <div className={styles.heroPosterFallback} aria-hidden="true" />
      <SproutBackgroundVideo
        className={styles.heroVideo}
        embedUrl={homeVideoSources.atoll.embedUrl}
        poster={posterSrc}
        playing={isPlaying}
        title={copy.videoLabel}
        eager
      />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.heroContour} aria-hidden="true" />

      <div className={styles.heroCoordinates}>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/70 sm:text-xs">
          {copy.coordinates}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50 sm:text-xs">
          {copy.place}
        </p>
      </div>

      <div className={styles.heroContent}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          {copy.eyebrow}
        </p>
        <h1 className="mt-6 max-w-5xl font-header text-[clamp(4.6rem,12vw,11.5rem)] leading-[0.76] tracking-[-0.02em] text-foreground">
          {copy.titleLead}
          <span className="block font-display text-[0.58em] font-normal italic leading-[1.05] text-primary">
            {copy.titleAccent}
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8">
          {copy.description}
        </p>
        <Button asChild size="lg" variant="outline" className="mt-8 h-auto rounded-full bg-background/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] backdrop-blur-sm">
          <a href="#formation">
            {copy.begin}
            <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.heroPlayback}
        onClick={togglePlayback}
        aria-pressed={!isPlaying}
      >
        {isPlaying ? (
          <PauseIcon data-icon="inline-start" aria-hidden="true" />
        ) : (
          <PlayIcon data-icon="inline-start" aria-hidden="true" />
        )}
        {isPlaying ? copy.pause : copy.play}
      </Button>
    </section>
  );
}
