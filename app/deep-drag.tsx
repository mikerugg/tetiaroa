"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-experience.module.css";

export function DeepDrag({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const idleUntilRef = useRef(0);
  const [hintVisible, setHintVisible] = useState(true);

  const bounds = () => {
    const panel = panelRef.current;
    const track = trackRef.current;

    if (!panel || !track) {
      return 0;
    }

    return Math.min(panel.clientWidth - track.scrollWidth, 0);
  };

  const applyOffset = () => {
    const track = trackRef.current;

    if (track) {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let direction = -1;

    offsetRef.current = bounds() / 2;
    applyOffset();

    const drift = (time: number) => {
      if (!dragRef.current && time > idleUntilRef.current) {
        const min = bounds();

        offsetRef.current += direction * 0.18;

        if (offsetRef.current <= min) {
          offsetRef.current = min;
          direction = 1;
        } else if (offsetRef.current >= 0) {
          offsetRef.current = 0;
          direction = -1;
        }

        applyOffset();
      }

      frame = requestAnimationFrame(drift);
    };

    if (!reducedMotion) {
      frame = requestAnimationFrame(drift);
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className={styles.deepPanel}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          startX: event.clientX,
          startOffset: offsetRef.current,
        };
        setHintVisible(false);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;

        if (!drag) {
          return;
        }

        const min = bounds();
        const next = drag.startOffset + (event.clientX - drag.startX);

        offsetRef.current = Math.min(Math.max(next, min), 0);
        applyOffset();
      }}
      onPointerUp={() => {
        dragRef.current = null;
        idleUntilRef.current = performance.now() + 2500;
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        idleUntilRef.current = performance.now() + 2500;
      }}
    >
      <div ref={trackRef} className={styles.deepTrack}>
        {children}
      </div>

      <div className={styles.deepTint} aria-hidden="true" />
      <div className={styles.hudFrame} aria-hidden="true" />
      <div className={styles.reticle} aria-hidden="true" />
      <div className={styles.hudFeed} aria-hidden="true">
        <span className={styles.hudDot} />
        rec &mdash; capturing dive 15
      </div>
      <div className={styles.hudDepth} aria-hidden="true">
        &minus;104 m &middot; 8k 360&deg;
      </div>
      <div
        className={
          hintVisible
            ? styles.hudHint
            : `${styles.hudHint} ${styles.hudHintHidden}`
        }
        aria-hidden="true"
      >
        drag to look
      </div>
    </div>
  );
}
