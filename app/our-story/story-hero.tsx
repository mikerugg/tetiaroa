"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OurStoryCopy } from "./our-story-content";

export function StoryHero({ copy }: { copy: OurStoryCopy["hero"] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = videoRef.current;

    if (!video) return;

    const syncPreference = () => {
      if (mediaQuery.matches) {
        video.pause();
        setIsPlaying(false);
      }
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-background"
      aria-label={copy.videoLabel}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/geology/atoll-foundation-poster.webp"
        aria-hidden="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/atoll.webm" type="video/webm" />
        <source src="/atoll.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_14_17_/_0.18)_0%,rgb(3_14_17_/_0.2)_38%,rgb(3_14_17_/_0.9)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_74%_24%,rgb(143_201_201_/_0.32),transparent_28%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pb-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-6xl font-header text-[clamp(5rem,13vw,13rem)] leading-[0.72] tracking-[-0.02em] text-foreground">
          {copy.titleLead}
          <span className="block font-display text-[0.54em] font-normal italic leading-[1.05] text-primary">
            {copy.titleAccent}
          </span>
        </h1>
        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-base leading-7 text-foreground/82 sm:text-lg sm:leading-8">
            {copy.description}
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-auto w-fit rounded-full bg-background/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] backdrop-blur-sm"
          >
            <a href="#inheritance">
              {copy.begin}
              <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-4 top-20 h-auto rounded-full bg-background/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur-md sm:right-7 md:top-24"
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
