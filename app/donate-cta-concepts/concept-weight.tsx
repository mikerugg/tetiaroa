"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { clamp01, lerp, smooth, usePrefersReducedMotion } from "./concept-utils";

type Unit = {
  tx: number; // target, normalized in silhouette box
  ty: number;
  jitter: number;
  drop: number;
  cat: number;
};

const CATS: { label: string; c: [number, number, number] }[] = [
  { label: "red-torch battery", c: [255, 180, 84] },
  { label: "satellite tag", c: [127, 214, 214] },
  { label: "patrol hour", c: [255, 150, 90] },
  { label: "coral fragment", c: [120, 220, 180] },
  { label: "native seedling", c: [200, 230, 140] },
];

const CAPTIONS = [
  { at: 0, text: "$25 — a week of red-torch batteries" },
  { at: 0.22, text: "$40 — one satellite tag, glued to a hatchling's shell" },
  { at: 0.44, text: "$100 — a full night of turtle patrol" },
  { at: 0.66, text: "$250 — a coral fragment, grown out and replanted" },
  { at: 0.88, text: "340 gifts — one nesting season, fully funded" },
];

const SEASON_GOAL = 340;

function drawTurtle(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#fff";
  const ell = (x: number, y: number, rx: number, ry: number, rot = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  ell(150, 60, 24, 27); // head
  ell(78, 100, 42, 19, -0.6); // front flippers
  ell(222, 100, 42, 19, 0.6);
  ell(96, 232, 26, 15, -0.5); // rear flippers
  ell(204, 232, 26, 15, 0.5);
  ell(150, 160, 72, 90); // shell
  ctx.beginPath(); // tail
  ctx.moveTo(150, 250);
  ctx.lineTo(140, 268);
  ctx.lineTo(160, 268);
  ctx.fill();
}

export function ConceptWeight() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unitsRef = useRef<Unit[]>([]);
  const progressRef = useRef(0);
  const userRef = useRef<{ age: number } | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const capRef = useRef<HTMLParagraphElement | null>(null);
  const capIndexRef = useRef(-1);
  const reduced = usePrefersReducedMotion();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // sample the turtle silhouette into target points
    if (unitsRef.current.length === 0) {
      const off = document.createElement("canvas");
      off.width = 300;
      off.height = 300;
      const octx = off.getContext("2d")!;
      drawTurtle(octx);
      const data = octx.getImageData(0, 0, 300, 300).data;
      const pts: { tx: number; ty: number }[] = [];
      for (let y = 0; y < 300; y += 6) {
        for (let x = 0; x < 300; x += 6) {
          if (data[(y * 300 + x) * 4 + 3] > 128) {
            pts.push({ tx: x / 300, ty: y / 300 });
          }
        }
      }
      for (let i = pts.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      unitsRef.current = pts.slice(0, 300).map((p, i) => ({
        tx: p.tx,
        ty: p.ty,
        jitter: (Math.random() - 0.5) * 120,
        drop: Math.random(),
        cat: i % CATS.length,
      }));
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = unitsRef.current.length;

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const p = reduced ? 1 : progressRef.current;

      ctx.clearRect(0, 0, w, h);

      // keep the turtle in the upper ~60% so the HUD below stays legible
      const box = Math.min(w * 0.46, h * 0.62);
      const bx = w / 2 - box / 2;
      const by = h * 0.31 - box / 2;

      let settled = 0;
      for (let i = 0; i < N; i += 1) {
        const u = unitsRef.current[i];
        const start = (i / N) * 0.86;
        const local = smooth(clamp01((p - start) / 0.16));
        if (local > 0.98) settled += 1;
        const tx = bx + u.tx * box;
        const ty = by + u.ty * box;
        const sx = tx + u.jitter;
        const sy = h + (0.04 + u.drop * 0.28) * h;
        const x = lerp(sx, tx, local);
        const y = lerp(sy, ty, local);
        if (local <= 0.001) continue;

        const scale = 0.6 + local * 0.4 + (local > 0.9 ? (1 - local) * 2 : 0);
        const [r, g, b] = CATS[u.cat].c;
        ctx.beginPath();
        ctx.arc(x, y, 8.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.12 * local})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 4.6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.92 * local})`;
        ctx.fill();
      }

      // the user's own gift, dropped on demand
      const user = userRef.current;
      if (user) {
        user.age += dt / 1000;
        const local = smooth(clamp01(user.age / 0.7));
        const tx = bx + 0.5 * box;
        const ty = by + 0.34 * box;
        const x = tx;
        const y = lerp(h + h * 0.2, ty, local);
        const pop = local > 0.85 ? 1 + (1 - local) * 3 : 1;
        ctx.beginPath();
        ctx.arc(x, y, 22 * local, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,60,${0.18 * local})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 7 * pop, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,140,80,1)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,180,120,0.9)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(x, y, 13 * pop, 0, Math.PI * 2);
        ctx.stroke();
        if (local > 0.6) {
          ctx.font = "600 11px ui-monospace, monospace";
          ctx.fillStyle = `rgba(255,190,140,${(local - 0.6) / 0.4})`;
          ctx.textAlign = "center";
          ctx.fillText("YOU", x, y - 20);
        }
      }

      // HUD: filled count + rotating caption
      if (countRef.current) {
        const shown = Math.round(clamp01(settled / N) * SEASON_GOAL) + (userRef.current ? 1 : 0);
        countRef.current.textContent = Math.min(SEASON_GOAL + 1, shown).toString();
      }
      let capIdx = 0;
      for (let i = 0; i < CAPTIONS.length; i += 1) if (p >= CAPTIONS[i].at) capIdx = i;
      if (capIdx !== capIndexRef.current && capRef.current) {
        capIndexRef.current = capIdx;
        capRef.current.textContent = CAPTIONS[capIdx].text;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      progressRef.current = clamp01(span > 0 ? -rect.top / span : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={reduced ? "relative" : "relative h-[400vh] overflow-clip"}
      style={{ background: "var(--ink)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute left-6 top-6 max-w-[22rem]">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[color:var(--flame)]">
            What a season costs
          </div>
          <h3 className="font-header mt-3 text-[clamp(1.8rem,3.6vw,3.25rem)] uppercase leading-[0.95] text-[color:var(--paper)]">
            One gift is small.
            <br />
            Together they&apos;re
            <br />
            <span className="text-[color:var(--glow)]">a whole season.</span>
          </h3>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
          style={{
            background:
              "linear-gradient(to top, var(--ink) 12%, color-mix(in oklab, var(--ink) 82%, transparent) 55%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-12 text-center">
          <div className="flex items-baseline gap-3">
            <span
              ref={countRef}
              className="font-header text-[clamp(2.5rem,6vw,5rem)] leading-none text-[color:var(--paper)]"
            >
              0
            </span>
            <span className="font-mono text-[13px] uppercase tracking-[0.2em] whitespace-nowrap text-[color:rgba(220,240,240,0.55)]">
              / {SEASON_GOAL} gifts
            </span>
          </div>
          <p
            ref={capRef}
            className="font-display mt-3 h-[1.6em] max-w-[42ch] text-[clamp(1rem,1.8vw,1.4rem)] italic text-[color:rgba(220,240,240,0.8)]"
          >
            {CAPTIONS[0].text}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              type="button"
              onClick={() => {
                userRef.current = { age: 0 };
                setAdded(true);
              }}
              variant="outline"
              className="h-auto rounded-full border-[color:rgba(255,180,84,0.5)] px-7 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[color:var(--paper)]"
            >
              {added ? "Added — that's yours" : "Add yours to the season"}
            </Button>
            <Button
              asChild
              className="donate-lava h-auto rounded-full px-8 py-4 text-[15px] font-bold text-[var(--ink)]"
            >
              <Link href="/donate">Give — from $25</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
