"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import styles from "./home-story-handoff.module.css";

export function HomeStoryHandoffScroll({ children }: PropsWithChildren) {
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
    let sectionTop = 0;
    let pinOffset = 0;
    let scrollRange = 1;

    const measureGeometry = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      pinOffset = Number.parseFloat(getComputedStyle(scene).top) || 0;
      scrollRange = Math.max(section.offsetHeight - scene.offsetHeight, 1);
    };

    const updateProgress = () => {
      frame = 0;

      const rawProgress =
        (window.scrollY + pinOffset - sectionTop) / scrollRange;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const revealProgress = Math.min(
        1,
        Math.max(0, (progress - 0.08) / (0.84 - 0.08)),
      );
      const seamOpacity = Math.min(
        revealProgress * 8,
        (1 - revealProgress) * 8,
        1,
      );

      scene.style.setProperty(
        "--reveal-progress",
        `${(revealProgress * 100).toFixed(3)}%`,
      );
      scene.style.setProperty("--seam-opacity", seamOpacity.toFixed(3));
    };

    const requestUpdate = () => {
      if (!isNearScene || frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isNearScene = entry.isIntersecting;
        if (isNearScene) {
          requestUpdate();
        }
      },
      { rootMargin: "100% 0px" },
    );

    const resizeObserver = new ResizeObserver(() => {
      measureGeometry();
      requestUpdate();
    });

    intersectionObserver.observe(section);
    resizeObserver.observe(section);
    resizeObserver.observe(scene);
    measureGeometry();
    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      className={styles.scrollTrack}
      aria-labelledby="home-story-title"
    >
      <div ref={sceneRef} className={styles.pinnedScene}>
        {children}
      </div>
    </section>
  );
}
