"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export type RelayLine = {
  text: string;
  at: number;
};

export function NightRelay({ lines }: { lines: RelayLine[] }) {
  const relayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const relay = relayRef.current;

    if (!relay) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      relay.style.setProperty("--relay", "1");
      return;
    }

    let queued = false;

    const update = () => {
      queued = false;

      const rect = relay.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const traversed = clampUnit((window.innerHeight - rect.top) / total);

      relay.style.setProperty(
        "--relay",
        String(clampUnit((traversed - 0.12) / 0.62)),
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
    <div ref={relayRef} className={styles.relay}>
      <div className={styles.relayThread} aria-hidden="true" />
      <ol className={styles.relayList}>
        {lines.map((line) => (
          <li
            key={line.text}
            className={styles.relayLine}
            style={{ "--at": line.at } as React.CSSProperties}
          >
            <span className={styles.relayLamp} aria-hidden="true" />
            <span className={styles.relayText}>{line.text}</span>
          </li>
        ))}
      </ol>
      <div
        className={styles.relayClose}
        style={{ "--at": 0.9 } as React.CSSProperties}
      >
        <span
          className={`${styles.relayLamp} ${styles.relayLampYours}`}
          aria-hidden="true"
        />
        <p className={styles.relayCloseText}>
          Every chain starts with one light on a beach.{" "}
          <strong className={styles.relayYours}>Yours.</strong>
        </p>
      </div>
    </div>
  );
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
