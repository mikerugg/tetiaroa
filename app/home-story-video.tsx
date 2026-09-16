"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { homeVideoSources } from "./home-video-sources";
import { SproutBackgroundVideo } from "./sprout-background-video";

const motionQuery = "(prefers-reduced-motion: reduce)";
const poster = "/story/our-story-hd-poster.webp";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

function getServerReducedMotion() {
  return true;
}

export function HomeStoryVideo() {
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getReducedMotion,
    getServerReducedMotion,
  );
  return (
    <div
      id="home-story-video"
      className="@container absolute inset-0 flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="relative aspect-[4/3] h-full max-h-[75cqw] shrink-0 overflow-hidden">
        {/* The HD upload pads the 4:3 picture inside a 16:9 file.
            Remove that padding while preserving the whole picture. */}
        <div className="absolute left-1/2 top-1/2 h-[112.5%] w-[150%] -translate-x-1/2 -translate-y-1/2">
          {reducedMotion ? (
            <Image src={poster} alt="" fill sizes="100vw" className="object-contain" />
          ) : (
            <SproutBackgroundVideo
              className="size-full"
              embedUrl={homeVideoSources.story.embedUrl}
              title={homeVideoSources.story.title}
              poster={poster}
            />
          )}
        </div>
      </div>
    </div>
  );
}
