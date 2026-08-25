"use client";

import { MotionConfig } from "motion/react";

/**
 * One reduced-motion contract for the whole page. `reducedMotion="user"`
 * makes motion honour the OS setting on every transform and layout animation
 * beneath it, so individual components do not each hand-roll a matchMedia.
 */
export function SwacMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
