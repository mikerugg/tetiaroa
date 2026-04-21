"use client";

import { useEffect } from "react";

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
