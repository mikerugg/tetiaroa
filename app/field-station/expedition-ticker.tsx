"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Pacific/Tahiti",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Pacific/Tahiti",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function ExpeditionTicker() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  const time = now ? timeFormatter.format(now) : "––:––:––";
  const date = now ? dateFormatter.format(now).toUpperCase() : "–– ––– ––––";

  return (
    <div className={styles.ticker} aria-hidden="true">
      <span className={styles.tickerRec}>● REC</span>
      <span>EXPEDITION FEED — TETIAROA ATOLL</span>
      <span>17°00′ S · 149°34′ W</span>
      <span>{date}</span>
      <span className={styles.tickerClock}>{time} TAHT</span>
      <span>REEL 03 · 4K · 24 FPS</span>
      <span>SEA STATE 1 — GLASSY</span>
    </div>
  );
}
