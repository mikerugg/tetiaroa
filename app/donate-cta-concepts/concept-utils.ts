"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// smoothstep — soft in, soft out
export const smooth = (t: number) => t * t * (3 - 2 * t);

// scroll progress of a tall wrapper whose sticky child pins for one viewport
export function scrollProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const span = rect.height - window.innerHeight;
  return clamp01(span > 0 ? -rect.top / span : 0);
}
