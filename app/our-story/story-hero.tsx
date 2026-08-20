"use client";

import { useEffect, useState } from "react";
import { homeVideoSources } from "../home-video-sources";
import { SproutBackgroundVideo } from "../sprout-background-video";
import type { OurStoryCopy } from "./our-story-content";
import { StoryFilmDialog } from "./story-film-dialog";

const film = homeVideoSources.societyFilm;

export function StoryHero({ copy }: { copy: OurStoryCopy["hero"] }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-background"
      aria-label={copy.videoLabel}
    >
      <SproutBackgroundVideo
        className="absolute inset-0 size-full object-cover"
        embedUrl={film.embedUrl}
        title={copy.videoLabel}
        poster="/story/society-film-poster.webp"
        playing={isPlaying && !isWatching}
        eager
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_14_17_/_0.38)_0%,rgb(3_14_17_/_0.42)_38%,rgb(3_14_17_/_0.92)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_74%_24%,rgb(143_201_201_/_0.32),transparent_28%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pb-20">
        <h1 className="max-w-2xl font-header text-[clamp(2.5rem,11vw,11rem)] leading-[0.84] tracking-[-0.02em] text-foreground">
          {copy.title}
        </h1>
        <div className="mt-7 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-3xl font-display text-2xl italic leading-tight text-primary sm:text-3xl">
            {copy.description}
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <p className="max-w-xs font-mono text-base uppercase leading-5 tracking-[0.14em] text-foreground/62 sm:text-right sm:text-sm">
              {copy.filmNote}
            </p>
            <StoryFilmDialog copy={copy} onOpenChange={setIsWatching} />
          </div>
        </div>
      </div>
    </section>
  );
}
