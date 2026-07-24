"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LanternDonateLabels, LanternTier } from "./lantern-donate";
import {
  captureViewportLayout,
  shouldRefreshStableViewport,
} from "./stable-viewport";
import styles from "./lantern-experience.module.css";

export type LanternCopy = {
  eyebrow: string;
  titleLines: [string, string];
  beatLines: string[];
  closeLead: string;
  closeStrong: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

type RGB = [number, number, number];

const FLAME: RGB = [255, 184, 92];
const PALE: RGB = [255, 226, 182];
const MOON: RGB = [206, 226, 255];
const CORE: RGB = [255, 250, 235];
const SMOKE_WARM: RGB = [152, 142, 132];
const SMOKE_COOL: RGB = [116, 126, 146];
const EMBER_GOLD: RGB = [255, 206, 122];
const EMBER_MID: RGB = [255, 138, 58];
const EMBER_RED: RGB = [186, 46, 26];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// teardrop flame silhouettes for the donate lanterns (viewBox 0 0 32 52)
const FLAME_OUTER =
  "M16 2 C 22 15 30 22 27 34 C 25.5 43 21 50 16 50 C 11 50 6.5 43 5 34 C 2 22 10 15 16 2 Z";
const FLAME_INNER =
  "M16 19 C 19.5 27 24 31 22.5 39 C 21.5 45 18.5 48 16 48 C 13.5 48 10.5 45 9.5 39 C 8 31 12.5 27 16 19 Z";

// offsets are in units of moon radius; craters/maria sit on the disc, clouds
// drift across in front of it.
const MOON_MARIA: Array<[number, number, number]> = [
  [-0.3, -0.16, 0.44],
  [0.26, 0.1, 0.5],
  [0.04, 0.46, 0.34],
];
const MOON_CRATERS: Array<[number, number, number]> = [
  [-0.14, 0.32, 0.1],
  [0.4, -0.34, 0.08],
  [0.16, -0.08, 0.06],
  [-0.46, 0.04, 0.07],
  [0.3, 0.4, 0.05],
];
const MOON_CLOUDS = [
  { yoff: -0.55, speed: 9, len: 3.7, thick: 0.34, alpha: 0.3, phase: 40 },
  { yoff: 0.06, speed: 6, len: 4.7, thick: 0.54, alpha: 0.38, phase: 190 },
  { yoff: 0.58, speed: 12, len: 3.0, thick: 0.3, alpha: 0.26, phase: 320 },
];

function glow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  c: RGB,
  a: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a})`);
  g.addColorStop(0.4, `rgba(${c[0]},${c[1]},${c[2]},${a * 0.5})`);
  g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(
  ctx: CanvasRenderingContext2D,
  mx: number,
  my: number,
  R: number,
  t: number,
) {
  // atmospheric corona — layered soft glows, no hard edges
  glow(ctx, mx, my, R * 7, MOON, 0.14);
  glow(ctx, mx, my, R * 4.6, MOON, 0.12);
  glow(ctx, mx, my, R * 3.3, [226, 236, 255], 0.24);
  glow(ctx, mx, my, R * 1.7, [234, 242, 255], 0.42);

  // dimensional disc — everything below is clipped to the moon circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, R, 0, Math.PI * 2);
  ctx.clip();

  // body volume: lit from upper-left, darkening toward the limb
  const body = ctx.createRadialGradient(
    mx - R * 0.35,
    my - R * 0.35,
    R * 0.2,
    mx,
    my,
    R * 1.08,
  );
  body.addColorStop(0, "rgba(249,251,255,1)");
  body.addColorStop(0.7, "rgba(226,234,250,1)");
  body.addColorStop(1, "rgba(194,206,230,1)");
  ctx.fillStyle = body;
  ctx.fillRect(mx - R, my - R, R * 2, R * 2);

  // maria — soft dark seas
  for (const [ox, oy, rr] of MOON_MARIA) {
    const g = ctx.createRadialGradient(mx + ox * R, my + oy * R, 0, mx + ox * R, my + oy * R, rr * R);
    g.addColorStop(0, "rgba(150,164,190,0.28)");
    g.addColorStop(1, "rgba(150,164,190,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mx + ox * R, my + oy * R, rr * R, 0, Math.PI * 2);
    ctx.fill();
  }

  // craters — darker centers with a faint rim
  for (const [ox, oy, rr] of MOON_CRATERS) {
    const cxx = mx + ox * R;
    const cyy = my + oy * R;
    const g = ctx.createRadialGradient(cxx, cyy, 0, cxx, cyy, rr * R);
    g.addColorStop(0, "rgba(148,158,184,0.5)");
    g.addColorStop(0.7, "rgba(172,184,208,0.14)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cxx, cyy, rr * R, 0, Math.PI * 2);
    ctx.fill();
  }

  // gentle terminator shadow on the lower-right — a not-quite-full moon
  const term = ctx.createRadialGradient(
    mx - R * 0.5,
    my - R * 0.5,
    R * 0.6,
    mx + R * 0.7,
    my + R * 0.7,
    R * 1.7,
  );
  term.addColorStop(0, "rgba(18,26,44,0)");
  term.addColorStop(1, "rgba(16,24,42,0.3)");
  ctx.fillStyle = term;
  ctx.fillRect(mx - R, my - R, R * 2, R * 2);
  ctx.restore();

  // drifting cloud veil in front — dims the moon as it passes
  for (const c of MOON_CLOUDS) {
    const span = R * 13;
    const cx = mx - span / 2 + ((t * c.speed + c.phase) % span);
    const cy = my + c.yoff * R;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(c.len, c.thick);
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    cg.addColorStop(0, `rgba(32,44,58,${c.alpha})`);
    cg.addColorStop(1, "rgba(32,44,58,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// the lantern's flight, normalized to the stage — ember on the water, lifting
// through the night sky, then settling toward the horizon where it becomes one
// of many.
const FLIGHT = [
  { p: 0.0, x: 0.5, y: 0.85 },
  { p: 0.16, x: 0.51, y: 0.7 },
  { p: 0.34, x: 0.4, y: 0.5 },
  { p: 0.54, x: 0.29, y: 0.34 },
  { p: 0.74, x: 0.4, y: 0.5 },
  { p: 0.9, x: 0.48, y: 0.61 },
  { p: 1.0, x: 0.5, y: 0.63 },
];

function sampleFlight(p: number) {
  for (let i = 0; i < FLIGHT.length - 1; i += 1) {
    const a = FLIGHT[i];
    const b = FLIGHT[i + 1];
    if (p <= b.p) {
      const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
    }
  }
  const last = FLIGHT[FLIGHT.length - 1];
  return { x: last.x, y: last.y };
}

// a wavering reflection cast down onto the water
function reflection(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  length: number,
  c: RGB,
  a: number,
  t: number,
  spread: number,
) {
  const rows = Math.max(1, Math.floor(length / 6));
  for (let k = 0; k < rows; k += 1) {
    const f = 1 - k / rows;
    const yy = topY + k * 6;
    const wob = Math.sin(k * 0.42 + t * 2.1) * spread * (0.35 + 0.65 * f);
    const width = spread * (0.5 + f);
    ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a * f * 0.5})`;
    ctx.fillRect(x - width / 2 + wob, yy, width, 2.4);
  }
}

function paperLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  a: number,
) {
  glow(ctx, x, y, 92 * scale, FLAME, 0.42 * a);
  glow(ctx, x, y, 40 * scale, PALE, 0.6 * a);
  const bw = 15 * scale;
  const bh = 21 * scale;
  const bg = ctx.createLinearGradient(0, y - bh / 2, 0, y + bh / 2);
  bg.addColorStop(0, `rgba(255,214,158,${0.92 * a})`);
  bg.addColorStop(1, `rgba(255,150,74,${0.86 * a})`);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw * 0.5);
  ctx.fill();
  glow(ctx, x, y, 9 * scale, CORE, 0.9 * a);
}

type Star = { nx: number; ny: number; r: number; phase: number; speed: number };
type Flock = {
  nx: number;
  baseY: number;
  scale: number;
  delay: number;
  phase: number;
  drift: number;
};
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  seed: number;
};

export function LanternExperience({
  night,
  tiers,
  labels,
  donatePath,
}: {
  night: LanternCopy;
  tiers: LanternTier[];
  labels: LanternDonateLabels;
  donatePath: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div style={{ background: "var(--ink)" }}>
      {reduced ? <LanternStatic night={night} /> : <LanternCinema night={night} />}
      <LanternRelease
        night={night}
        tiers={tiers}
        labels={labels}
        donatePath={donatePath}
      />
    </div>
  );
}

function LanternCinema({ night }: { night: LanternCopy }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<HTMLParagraphElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const flockRef = useRef<Flock[]>([]);
  const embersRef = useRef<Particle[]>([]);
  const smokeRef = useRef<Particle[]>([]);
  const capIndexRef = useRef(-1);
  const beats = night.beatLines;

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 130 }, () => ({
        nx: Math.random(),
        ny: Math.random() * 0.58,
        r: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.6,
      }));
      flockRef.current = Array.from({ length: 16 }, () => ({
        nx: 0.08 + Math.random() * 0.84,
        baseY: 0.63 + Math.random() * 0.12,
        scale: 0.35 + Math.random() * 0.6,
        delay: Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        drift: 0.3 + Math.random() * 0.5,
      }));
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let raf = 0;
    let layoutFrame = 0;
    let last = performance.now();
    let progress = 0;
    let trackTop = 0;
    let scrollSpan = 1;
    let viewportLayout = captureViewportLayout();

    const lockViewportGeometry = () => {
      wrap.style.removeProperty("--lantern-stage-height");
      wrap.style.removeProperty("--lantern-track-height");

      const stageHeight = stage.getBoundingClientRect().height;

      wrap.style.setProperty("--lantern-stage-height", `${stageHeight}px`);
      wrap.style.setProperty(
        "--lantern-track-height",
        `${stageHeight * 5.2}px`,
      );
    };

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (nextWidth === w && nextHeight === h) {
        return;
      }

      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const measureGeometry = () => {
      trackTop = wrap.getBoundingClientRect().top + window.scrollY;
      scrollSpan = Math.max(wrap.offsetHeight - stage.offsetHeight, 1);
    };

    const onScroll = () => {
      progress = clamp01((window.scrollY - trackTop) / scrollSpan);
    };

    const onLayoutChange = () => {
      if (layoutFrame) {
        return;
      }

      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0;
        resizeCanvas();
        measureGeometry();
        onScroll();
      });
    };

    const onViewportResize = () => {
      const nextLayout = captureViewportLayout();
      const shouldRefresh = shouldRefreshStableViewport(
        viewportLayout,
        nextLayout,
      );

      viewportLayout = nextLayout;

      if (!shouldRefresh) {
        return;
      }

      lockViewportGeometry();
      onLayoutChange();
    };

    lockViewportGeometry();
    resizeCanvas();
    measureGeometry();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onViewportResize);

    const resizeObserver = new ResizeObserver(onLayoutChange);
    resizeObserver.observe(wrap);
    resizeObserver.observe(stage);
    resizeObserver.observe(document.body);

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const t = now / 1000;
      const p = progress;
      const hy = h * 0.6;
      const mx = w * 0.72;
      const my = h * 0.19;

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, "#070c1a");
      sky.addColorStop(0.6, "#0a1622");
      sky.addColorStop(1, "#132430");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, hy);

      // stars
      for (const s of starsRef.current) {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase));
        const sx = (s.nx * w + t * 6) % w;
        glow(ctx, sx, s.ny * h, s.r * 2.4, [255, 255, 255], 0.5 * tw);
        ctx.fillStyle = `rgba(255,255,255,${0.85 * tw})`;
        ctx.fillRect(sx, s.ny * h, s.r, s.r);
      }

      // moon — dimensional disc behind a drifting cloud veil
      drawMoon(ctx, mx, my, 27, t);

      // water
      const water = ctx.createLinearGradient(0, hy, 0, h);
      water.addColorStop(0, "#0d2028");
      water.addColorStop(0.5, "#081319");
      water.addColorStop(1, "#03080b");
      ctx.fillStyle = water;
      ctx.fillRect(0, hy, w, h - hy);

      // moonpath on the water
      reflection(ctx, mx, hy, h - hy, MOON, 0.5, t, 60);

      // faint ripple lines
      ctx.strokeStyle = "rgba(150,190,200,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i += 1) {
        const yy = hy + (h - hy) * (i / 6);
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(w, yy);
        ctx.stroke();
      }

      // the flotilla — one becomes many
      for (const f of flockRef.current) {
        const a = clamp01((p - 0.78 - f.delay) / 0.14);
        if (a <= 0) continue;
        const fx = f.nx * w + Math.sin(t * f.drift + f.phase) * 10;
        const fy = (f.baseY - (p - 0.8) * 0.03) * h;
        reflection(ctx, fx, fy + 6, (h - fy) * 0.6, FLAME, a * 0.7, t + f.phase, 14 * f.scale);
        paperLantern(ctx, fx, fy, f.scale, a);
      }

      // hero lantern
      const hero = sampleFlight(p);
      const hx = hero.x * w;
      const hyp = hero.y * h;
      const heroA = clamp01(1 - (p - 0.82) / 0.13);
      if (heroA > 0) {
        // reflection from the waterline down
        const top = Math.max(hy, hyp);
        reflection(ctx, hx, top, (h - top) * 0.85, FLAME, heroA * 0.85, t, 20);

        // smoke — slow, expanding, wandering on a light breeze
        if (Math.random() < dt / 95) {
          smokeRef.current.push({
            x: hx + (Math.random() - 0.5) * 6,
            y: hyp - 6,
            vx: 0,
            vy: -0.025 - Math.random() * 0.03,
            life: 0,
            max: 3.6 + Math.random() * 2.2,
            seed: Math.random() * Math.PI * 2,
          });
          if (smokeRef.current.length > 40) smokeRef.current.shift();
        }
        // embers — sparse bursts, buoyant then hovering, cooling as they die
        if (Math.random() < dt / 1000) {
          const burst = Math.random() < 0.3 ? 2 : 1;
          for (let b = 0; b < burst; b += 1) {
            embersRef.current.push({
              x: hx + (Math.random() - 0.5) * 8,
              y: hyp - 2,
              vx: (Math.random() - 0.5) * 0.04,
              vy: -0.08 - Math.random() * 0.07,
              life: 0,
              max: 2.6 + Math.random() * 1.8,
              seed: Math.random() * Math.PI * 2,
            });
          }
          if (embersRef.current.length > 60) embersRef.current.shift();
        }

        // smoke behind the flame
        smokeRef.current = smokeRef.current.filter((s) => s.life < s.max);
        for (const s of smokeRef.current) {
          s.life += dt / 1000;
          const st = s.life / s.max;
          s.vx = 0.008 + Math.sin(s.life * 0.8 + s.seed) * 0.03;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const a = Math.sin(Math.PI * st) * 0.13 * heroA;
          if (a > 0) glow(ctx, s.x, s.y, 5 + st * 20, mix(SMOKE_WARM, SMOKE_COOL, st), a);
        }

        // embers in front, twinkling and swirling
        embersRef.current = embersRef.current.filter((e) => e.life < e.max);
        for (const e of embersRef.current) {
          e.life += dt / 1000;
          const et = e.life / e.max;
          e.vx = e.vx * 0.99 + Math.sin(e.life * 2.4 + e.seed) * 0.0005 * dt;
          e.vy = Math.min(0.02, e.vy + 0.00007 * dt);
          e.x += e.vx * dt;
          e.y += e.vy * dt;
          const twinkle = 0.65 + 0.35 * Math.sin(e.life * 22 + e.seed);
          const a = (1 - et) * twinkle * heroA * 0.85;
          const color =
            et < 0.5
              ? mix(EMBER_GOLD, EMBER_MID, et / 0.5)
              : mix(EMBER_MID, EMBER_RED, (et - 0.5) / 0.5);
          if (a > 0) glow(ctx, e.x, e.y, 4.6 * (1 - 0.4 * et), color, a);
        }

        paperLantern(ctx, hx, hyp, 1, heroA);
      }

      // vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      // overlays
      if (titleRef.current) {
        titleRef.current.style.opacity = String(clamp01(1 - p * 8));
      }
      if (capRef.current) {
        const seg = p * beats.length;
        const idx = Math.min(beats.length - 1, Math.floor(seg));
        const local = seg - idx;
        if (idx !== capIndexRef.current) {
          capIndexRef.current = idx;
          capRef.current.textContent = beats[idx];
        }
        const fade = clamp01(Math.min(local / 0.15, (1 - local) / 0.15, 1));
        const gate = clamp01((p - 0.08) / 0.04);
        capRef.current.style.opacity = String(fade * gate);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onViewportResize);
      wrap.style.removeProperty("--lantern-stage-height");
      wrap.style.removeProperty("--lantern-track-height");
    };
  }, [beats]);

  return (
    <div ref={wrapRef} className={styles.cinemaTrack}>
      <div ref={stageRef} className={styles.cinemaStage}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className={styles.cinemaSafeFrame}>
          <div
            ref={titleRef}
            className="pointer-events-none absolute inset-x-0 top-[24%] px-6 text-center"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[color:var(--flame)]">
              {night.eyebrow}
            </div>
            <h3 className="font-header mx-auto mt-4 max-w-[14ch] text-[clamp(2.2rem,5.4vw,4.6rem)] uppercase leading-[0.92] text-[color:var(--paper)]">
              {night.titleLines[0]}
              <br />
              {night.titleLines[1]}
            </h3>
            <div className="font-mono mx-auto mt-6 w-fit text-[11px] uppercase tracking-[0.28em] text-[color:rgba(220,235,255,0.5)]">
              scroll to release it
            </div>
          </div>

          <p
            ref={capRef}
            className="font-display pointer-events-none absolute inset-x-0 bottom-[14%] mx-auto max-w-[40ch] px-6 text-center text-[clamp(1.15rem,2.4vw,1.9rem)] italic leading-[1.4] text-[color:var(--paper)]"
            style={{
              opacity: 0,
              textShadow: "0 2px 30px rgba(0,0,0,0.7)",
            }}
          />
        </div>

        <ul className="sr-only">
          {beats.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LanternStatic({ night }: { night: LanternCopy }) {
  return (
    <div className="px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[color:var(--flame)]">
          {night.eyebrow}
        </div>
        <h3 className="font-header mt-4 text-[clamp(2rem,4.4vw,3.6rem)] uppercase leading-[0.95] text-[color:var(--paper)]">
          {night.titleLines[0]} {night.titleLines[1]}
        </h3>
        <ul className="mt-8 flex flex-col gap-4">
          {night.beatLines.map((line) => (
            <li key={line} className="flex gap-4 text-[color:rgba(255,226,178,0.9)]">
              <span className="mt-2 inline-block size-2 flex-none rounded-full bg-[color:var(--flame)] shadow-[0_0_14px_4px_rgba(255,180,84,0.5)]" />
              <span className="font-display text-[clamp(1.05rem,1.8vw,1.4rem)] italic leading-[1.4]">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LanternRelease({
  night,
  tiers,
  labels,
  donatePath,
}: {
  night: LanternCopy;
  tiers: LanternTier[];
  labels: LanternDonateLabels;
  donatePath: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");

  const selectedTier = selected === null ? null : tiers[selected];
  const amount = useMemo(() => {
    if (!selectedTier) return null;
    const raw = selectedTier.custom ? custom : selectedTier.amount;
    const n = Number.parseInt(raw.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [selectedTier, custom]);

  const ctaLabel = (() => {
    if (!selectedTier) return labels.emptySelection;
    if (selectedTier.custom) {
      return custom
        ? `${labels.lightPrefix} — ${labels.currencySymbol}${custom}`
        : labels.customAmountRequired;
    }
    return `${labels.lightPrefix} — ${selectedTier.amount}`;
  })();

  return (
    <section
      id="donation-levels"
      aria-labelledby="donation-levels-heading"
      className="relative scroll-mt-14 overflow-hidden px-6 pb-28 pt-16 sm:px-12 md:scroll-mt-16"
    >
      {/* horizon glow behind the release */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(255,150,74,0.14), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1180px]">
        <h2
          id="donation-levels-heading"
          className="font-display text-center text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.3] text-[color:var(--paper)]"
        >
          {night.closeLead}{" "}
          <strong className="font-normal not-italic text-[color:var(--flame)] max-[640px]:block">
            {night.closeStrong}
          </strong>
        </h2>

        <div
          className="mt-14 grid grid-cols-4 gap-6 max-[960px]:grid-cols-2 max-[560px]:grid-cols-1"
          aria-label={labels.ariaLabel}
        >
          {tiers.map((tier, index) => {
            const isLit =
              selected === index && (!tier.custom || custom !== "");
            return (
              <div key={tier.name} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                  className={cn(
                    styles.lantern,
                    "group relative flex h-36 w-24 cursor-pointer flex-col items-center justify-end rounded-[40%/28%] border transition-colors duration-300",
                    isLit
                      ? "border-[color:rgba(255,190,110,0.85)]"
                      : "border-[color:rgba(255,220,180,0.18)] hover:border-[color:rgba(255,220,180,0.4)]",
                  )}
                  style={
                    {
                      "--bob-dur": `${5.5 + index * 0.6}s`,
                      "--bob-delay": `${index * 0.5}s`,
                      background: isLit
                        ? "linear-gradient(180deg, rgba(255,208,150,0.28), rgba(255,150,74,0.16))"
                        : "linear-gradient(180deg, rgba(255,226,190,0.05), rgba(255,180,120,0.03))",
                      boxShadow: isLit
                        ? "0 0 46px rgba(255,170,84,0.42), inset 0 0 26px rgba(255,190,120,0.28)"
                        : "inset 0 0 20px rgba(255,220,180,0.06)",
                    } as React.CSSProperties
                  }
                >
                  {/* wire loop */}
                  <span
                    className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border"
                    style={{
                      borderColor: isLit
                        ? "rgba(255,200,140,0.8)"
                        : "rgba(255,220,180,0.25)",
                    }}
                  />
                  {/* flame */}
                  <span className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
                    <svg
                      viewBox="0 0 32 52"
                      width="30"
                      height="49"
                      aria-hidden="true"
                      className={styles.flame}
                      style={{
                        opacity: isLit ? 1 : 0.16,
                        filter: isLit
                          ? "drop-shadow(0 0 9px rgba(255,150,60,0.85)) drop-shadow(0 0 22px rgba(255,110,40,0.5))"
                          : "none",
                      }}
                    >
                      <defs>
                        <linearGradient id={`flame-${index}`} x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0" stopColor="#fff6dd" />
                          <stop offset="0.35" stopColor="#ffb454" />
                          <stop offset="0.72" stopColor="#ff7a1a" />
                          <stop offset="1" stopColor="#e0480a" stopOpacity="0.55" />
                        </linearGradient>
                        <linearGradient id={`flame-core-${index}`} x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0" stopColor="#ffffff" />
                          <stop offset="0.55" stopColor="#ffe595" />
                          <stop offset="1" stopColor="#ffb454" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <path
                        d={FLAME_OUTER}
                        fill={isLit ? `url(#flame-${index})` : "rgba(255,255,255,0.5)"}
                      />
                      {isLit ? <path d={FLAME_INNER} fill={`url(#flame-core-${index})`} /> : null}
                    </svg>
                  </span>
                  <span className="font-header pb-4 text-[1.55rem] leading-none text-[color:var(--paper)]">
                    {tier.custom && custom ? `$${custom}` : tier.amount}
                  </span>
                </button>

                <Badge
                  variant={isLit ? "default" : "secondary"}
                  className="mt-2 h-auto font-mono text-[11px] uppercase tracking-[0.2em]"
                >
                  {tier.name}
                </Badge>
              </div>
            );
          })}
        </div>

        {selectedTier?.custom ? (
          <FieldGroup className="mx-auto mt-8 max-w-sm gap-3">
            <Field orientation="horizontal" className="items-center justify-center gap-2">
              <FieldLabel
                htmlFor="lantern-custom-amount"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:rgba(220,235,255,0.6)]"
              >
                {labels.customAmountLabel}
              </FieldLabel>
              <span className="text-[15px] text-[color:var(--paper)]">
                {labels.currencySymbol}
              </span>
              <Input
                id="lantern-custom-amount"
                type="number"
                min="1"
                inputMode="numeric"
                value={custom}
                placeholder="50"
                className="w-[110px] font-mono text-[15px]"
                onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </Field>
          </FieldGroup>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Button
            type="button"
            disabled={amount === null}
            onClick={() => amount !== null && router.push(`${donatePath}?amount=${amount}`)}
            className="donate-lava h-auto rounded-full px-8 py-4 text-[15px] font-bold text-[var(--ink)] disabled:opacity-45"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
