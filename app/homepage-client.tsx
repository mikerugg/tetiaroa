"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export function HomepageInitialScrollReset() {
  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigationEntry?.type === "back_forward") {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  return null;
}

export function HomepageNavState() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-topnav]");

    if (!nav) {
      return;
    }

    const updateScrolled = () => {
      nav.dataset.scrolled = window.scrollY > 40 ? "true" : "false";
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  return null;
}

export function HeroSoundToggle({ videoId }: { videoId: string }) {
  const [muted, setMuted] = useState(true);

  const handleClick = () => {
    const nextMuted = !muted;
    const video = document.getElementById(videoId) as HTMLVideoElement | null;

    setMuted(nextMuted);

    if (!video) {
      return;
    }

    video.muted = nextMuted;

    if (!nextMuted) {
      void video.play().catch(() => {
        video.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <button
      type="button"
      className={styles.soundToggle}
      aria-pressed={!muted}
      onClick={handleClick}
    >
      {muted ? "♪ Sound off" : "♪ Sound on"}
    </button>
  );
}
