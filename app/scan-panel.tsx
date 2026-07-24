"use client";

import { useEffect, useRef } from "react";
import styles from "./home-experience.module.css";
import {
  captureViewportLayout,
  measureSafeViewportHeight,
  shouldRefreshStableViewport,
} from "./stable-viewport";

const SCAN_START = 0.14;
const SCAN_RANGE = 0.38;

export function ScanPanel({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    let queued = false;
    let viewportHeight = measureSafeViewportHeight();
    let viewportLayout = captureViewportLayout();

    const update = () => {
      queued = false;

      const rect = panel.getBoundingClientRect();
      const total = rect.height + viewportHeight;
      const traversed = clampUnit((viewportHeight - rect.top) / total);

      panel.style.setProperty(
        "--scan",
        String(clampUnit((traversed - SCAN_START) / SCAN_RANGE)),
      );
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      const nextLayout = captureViewportLayout();
      const shouldRefresh = shouldRefreshStableViewport(
        viewportLayout,
        nextLayout,
      );

      viewportLayout = nextLayout;

      if (!shouldRefresh) {
        return;
      }

      viewportHeight = measureSafeViewportHeight();
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
