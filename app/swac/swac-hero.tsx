"use client";

import { motion, useReducedMotion } from "motion/react";
import { homeVideoSources } from "../home-video-sources";
import { SproutBackgroundVideo } from "../sprout-background-video";
import { resolveMediaSource, type SwacCopy } from "./swac-content";
import styles from "./swac.module.css";

type SwacHeroProps = {
  copy: SwacCopy["hero"];
};

export function SwacHero({ copy }: SwacHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const posterSrc = resolveMediaSource(
    copy.posterSrc,
    "/geology/atoll-foundation-poster.webp",
  );

  return (
    <section className={styles.hero} aria-label={copy.videoLabel}>
      <div className={styles.heroPosterFallback} aria-hidden="true" />
      <SproutBackgroundVideo
        className={styles.heroVideo}
        embedUrl={homeVideoSources.atoll.embedUrl}
        poster={posterSrc}
        playing={!prefersReducedMotion}
        title={copy.videoLabel}
        eager
      />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.heroDepthLines} aria-hidden="true" />

      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
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
      </motion.div>
    </section>
  );
}
