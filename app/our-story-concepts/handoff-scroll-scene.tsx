"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import styles from "./concepts.module.css";

export function HandoffScrollScene({ children }: PropsWithChildren) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;

    if (!section || !scene) {
      return;
    }

    let frame = 0;
    let isNearScene = false;

    const updateProgress = () => {
      frame = 0;

      const bounds = section.getBoundingClientRect();
      const scrollRange = Math.max(bounds.height - scene.offsetHeight, 1);
      const rawProgress = -bounds.top / scrollRange;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const revealProgress = Math.min(
        1,
        Math.max(0, (progress - 0.08) / (0.84 - 0.08)),
      );
      const reveal = `${(revealProgress * 100).toFixed(3)}%`;
      const seamOpacity = Math.min(
        revealProgress * 8,
        (1 - revealProgress) * 8,
        1,
      );

      scene.style.setProperty("--reveal-progress", reveal);
      scene.style.setProperty("--seam-opacity", seamOpacity.toFixed(3));
    };

    const requestUpdate = () => {
      if (!isNearScene || frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearScene = entry.isIntersecting;
        if (isNearScene) {
          requestUpdate();
        }
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(section);
    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="handoff"
      className={styles.handoffScrollTrack}
      aria-labelledby="handoff-title"
    >
      <div ref={sceneRef} className={styles.handoffPinnedScene}>
        {children}
      </div>
    </section>
  );
}
