"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./home-experience.module.css";

type Rgb = [number, number, number];

type OrbFrame = {
  x: number;
  y: number;
  s: number;
  sx: number;
  c: Rgb;
};

const FLAME: Rgb = [255, 180, 84];
const CYAN: Rgb = [91, 232, 212];
const SCREEN: Rgb = [190, 225, 255];
const MOON: Rgb = [207, 231, 255];

// One keyframe per story beat (plus the opening title frame). The orb is the
// continuity device: hatch-glow on the sand, data streak leaving the island,
// headset glow, a torch at the clean-up, the moon-path home, then gone — the
// field of next-generation lights takes over.
const ORB_FRAMES: OrbFrame[] = [
  { x: 50, y: 78, s: 0.4, sx: 1, c: FLAME },
  { x: 50, y: 70, s: 1, sx: 1, c: FLAME },
  { x: 74, y: 22, s: 0.5, sx: 1, c: CYAN },
  { x: 50, y: 40, s: 1.15, sx: 1, c: SCREEN },
  { x: 30, y: 64, s: 0.45, sx: 1, c: FLAME },
  { x: 50, y: 56, s: 0.85, sx: 7, c: MOON },
  { x: 50, y: 50, s: 0, sx: 1, c: MOON },
];

const FIELD_DOTS = [
  { x: 12, y: 30, d: 0 },
  { x: 22, y: 18, d: 0.1 },
  { x: 31, y: 44, d: 0.2 },
  { x: 38, y: 24, d: 0.05 },
  { x: 47, y: 36, d: 0.15 },
  { x: 55, y: 16, d: 0.25 },
  { x: 62, y: 42, d: 0.1 },
  { x: 70, y: 26, d: 0 },
  { x: 78, y: 38, d: 0.2 },
  { x: 86, y: 20, d: 0.12 },
  { x: 18, y: 56, d: 0.22 },
  { x: 42, y: 58, d: 0.08 },
  { x: 58, y: 54, d: 0.18 },
  { x: 74, y: 58, d: 0.04 },
  { x: 88, y: 50, d: 0.26 },
  { x: 27, y: 68, d: 0.14 },
  { x: 50, y: 70, d: 0.02 },
  { x: 68, y: 68, d: 0.24 },
];

export function NightBeatCinema({
  lines,
  eyebrow,
  titleLines,
}: {
  lines: string[];
  eyebrow: string;
  titleLines: [string, string];
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const subIndexRef = useRef(-1);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      return;
    }

    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const orb = orbRef.current;
    const trail = trailRef.current;
    const sub = subRef.current;

    if (!wrap || !stage || !orb || !trail || !sub) {
      return;
    }

    let queued = false;

    const update = () => {
      queued = false;

      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = clampUnit(span > 0 ? -rect.top / span : 0);
      const seg = progress * (ORB_FRAMES.length - 1);
      const i = Math.min(ORB_FRAMES.length - 2, Math.floor(seg));
      const eased = dwell(seg - i);
      const a = ORB_FRAMES[i];
      const b = ORB_FRAMES[i + 1];

      const x = lerp(a.x, b.x, eased);
      const y = lerp(a.y, b.y, eased);
      const s = lerp(a.s, b.s, eased);
      const sx = lerp(a.sx, b.sx, eased);
      const color = a.c
        .map((channel, k) => Math.round(lerp(channel, b.c[k], eased)))
        .join(", ");

      orb.style.left = `${x}%`;
      orb.style.top = `${y}%`;
      orb.style.transform = `scale(${(sx * s).toFixed(3)}, ${s.toFixed(3)})`;
      trail.style.left = `${x}%`;
      trail.style.top = `${y}%`;

      stage.style.setProperty("--orb-c", color);
      stage.style.setProperty(
        "--trail",
        String(Math.max(0, 1 - Math.abs(seg - 2) * 1.8)),
      );
      stage.style.setProperty("--field", String(clampUnit((seg - 5.05) / 0.75)));
      stage.style.setProperty("--title", String(clampUnit(1 - seg * 1.5)));

      const idx = Math.min(lines.length, Math.max(1, Math.round(seg)));
      if (idx !== subIndexRef.current) {
        subIndexRef.current = idx;
        sub.textContent = lines[idx - 1] ?? "";
      }
      const subOpacity =
        seg < 0.55 ? 0 : clampUnit(1.35 - Math.abs(seg - idx) * 2.4);
      stage.style.setProperty("--sub", String(subOpacity));
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
  }, [lines, reduced]);

  if (reduced) {
    return (
      <div className={styles.cinemaStatic}>
        <div className={`${styles.nightEyebrow} font-mono`}>{eyebrow}</div>
        <h2
          className={`${styles.nightTitle} ${styles.nightTitleLong} font-depth`}
        >
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </h2>
        <ul className={styles.cinemaStaticList}>
          {lines.map((line) => (
            <li key={line} className={`${styles.cinemaStaticLine} font-mono`}>
              <span className={styles.cinemaStaticDot} aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={styles.cinema}>
      <div ref={stageRef} className={styles.cinemaStage}>
        <div className={styles.stars} aria-hidden="true" />
        <div className={styles.cinemaTitleFrame}>
          <div className={`${styles.nightEyebrow} font-mono`}>{eyebrow}</div>
          <h2
            className={`${styles.nightTitle} ${styles.nightTitleLong} font-depth`}
          >
            {titleLines[0]}
            <br />
            {titleLines[1]}
          </h2>
        </div>
        <div ref={trailRef} className={styles.cinemaTrail} aria-hidden="true" />
        <div ref={orbRef} className={styles.cinemaOrb} aria-hidden="true" />
        <div className={styles.cinemaField} aria-hidden="true">
          {FIELD_DOTS.map((dot) => (
            <span
              key={`${dot.x}-${dot.y}`}
              className={styles.fieldDot}
              style={
                {
                  "--fx": `${dot.x}%`,
                  "--fy": `${dot.y}%`,
                  "--fd": dot.d,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <p
          ref={subRef}
          className={`${styles.cinemaSub} font-display`}
          aria-hidden="true"
        />
        <ul className={styles.srOnly}>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Hold on each beat, then move quickly between beats — film cuts, not a slide.
function dwell(t: number) {
  if (t <= 0.3) {
    return 0;
  }
  if (t >= 0.7) {
    return 1;
  }
  const u = (t - 0.3) / 0.4;
  return u * u * (3 - 2 * u);
}
