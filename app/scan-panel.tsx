"use client";

import { useEffect, useRef } from "react";
import styles from "./home-experience.module.css";

export function ScanPanel({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    let queued = false;

    const update = () => {
      queued = false;

      const rect = panel.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const traversed = clampUnit((window.innerHeight - rect.top) / total);

      panel.style.setProperty(
        "--scan",
        String(clampUnit((traversed - 0.18) / 0.55)),
      );
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={panelRef} className={styles.scanPanel}>
      {children}
    </div>
  );
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
