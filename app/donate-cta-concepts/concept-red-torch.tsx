"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { lerp, usePrefersReducedMotion } from "./concept-utils";

type Nest = { nx: number; ny: number; hatchlings?: boolean };

const NESTS: Nest[] = [
  { nx: 0.16, ny: 0.42 },
  { nx: 0.31, ny: 0.6 },
  { nx: 0.44, ny: 0.34, hatchlings: true },
  { nx: 0.57, ny: 0.55 },
  { nx: 0.68, ny: 0.38 },
  { nx: 0.8, ny: 0.58 },
  { nx: 0.9, ny: 0.44 },
];

export function ConceptRedTorch() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const foundRef = useRef<boolean[]>(NESTS.map(() => false));
  const torchRef = useRef({ x: -9999, y: -9999, active: false });
  const movedRef = useRef(false);
  const ambientRef = useRef(0.05);
  const reduced = usePrefersReducedMotion();

  const [found, setFound] = useState(0);
  const [moved, setMoved] = useState(false);
  const complete = reduced || found >= NESTS.length;
  const displayFound = reduced ? NESTS.length : found;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (reduced) {
      foundRef.current = NESTS.map(() => true);
    }

    const scene = document.createElement("canvas");
    const sctx = scene.getContext("2d")!;
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d")!;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let raf = 0;

    // ---- scene, painted once per resize, in red patrol-light tones ----
    const paintScene = () => {
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, scene.width, scene.height);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sand = sctx.createLinearGradient(0, 0, 0, h);
      sand.addColorStop(0, "#1c0806");
      sand.addColorStop(0.62, "#3a120c");
      sand.addColorStop(0.72, "#4a180f");
      sand.addColorStop(1, "#120504");
      sctx.fillStyle = sand;
      sctx.fillRect(0, 0, w, h);

      // grain
      sctx.fillStyle = "rgba(120,40,26,0.06)";
      for (let i = 0; i < 900; i += 1) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        sctx.fillRect(gx, gy, 1.4, 1.4);
      }

      // wet-sand sheen near the waterline
      const sheen = sctx.createLinearGradient(0, h * 0.68, 0, h * 0.82);
      sheen.addColorStop(0, "rgba(180,70,45,0)");
      sheen.addColorStop(0.5, "rgba(180,70,45,0.22)");
      sheen.addColorStop(1, "rgba(120,45,30,0)");
      sctx.fillStyle = sheen;
      sctx.fillRect(0, h * 0.66, w, h * 0.18);

      // foam line
      sctx.strokeStyle = "rgba(210,90,60,0.45)";
      sctx.lineWidth = 1.4;
      sctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.86 + Math.sin(x * 0.03) * 4 + Math.sin(x * 0.011) * 6;
        if (x === 0) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
      }
      sctx.stroke();

      // tracks from the water up to each nest
      sctx.strokeStyle = "rgba(150,50,34,0.55)";
      sctx.lineWidth = 1.2;
      for (const n of NESTS) {
        const nx = n.nx * w;
        const ny = n.ny * h;
        const startY = h * 0.85;
        const steps = 14;
        for (let s = 0; s < steps; s += 1) {
          const t = s / steps;
          const cx = lerp(nx + Math.sin(t * 9) * 10, nx, t);
          const cy = lerp(startY, ny + 12, t);
          sctx.beginPath();
          sctx.moveTo(cx - 6, cy);
          sctx.lineTo(cx, cy - 3);
          sctx.lineTo(cx + 6, cy);
          sctx.stroke();
        }

        // nest mound
        const mound = sctx.createRadialGradient(nx, ny, 2, nx, ny, 26);
        mound.addColorStop(0, "rgba(150,52,34,0.9)");
        mound.addColorStop(0.6, "rgba(96,30,20,0.9)");
        mound.addColorStop(1, "rgba(60,18,12,0)");
        sctx.fillStyle = mound;
        sctx.beginPath();
        sctx.arc(nx, ny, 26, 0, Math.PI * 2);
        sctx.fill();
        // crater
        sctx.strokeStyle = "rgba(40,12,8,0.8)";
        sctx.lineWidth = 2;
        sctx.beginPath();
        sctx.arc(nx, ny, 9, 0, Math.PI * 2);
        sctx.stroke();
        // marker stake + flag
        sctx.strokeStyle = "rgba(220,110,70,0.8)";
        sctx.lineWidth = 1.6;
        sctx.beginPath();
        sctx.moveTo(nx + 20, ny - 4);
        sctx.lineTo(nx + 20, ny - 30);
        sctx.stroke();
        sctx.fillStyle = "rgba(230,120,70,0.85)";
        sctx.beginPath();
        sctx.moveTo(nx + 20, ny - 30);
        sctx.lineTo(nx + 32, ny - 26);
        sctx.lineTo(nx + 20, ny - 22);
        sctx.fill();

        // hatchlings scrambling to the sea
        if (n.hatchlings) {
          sctx.fillStyle = "rgba(210,95,60,0.9)";
          for (let k = 0; k < 5; k += 1) {
            const hx = nx + (k - 2) * 12 + Math.random() * 4;
            const hy = ny + 22 + k * 16;
            sctx.beginPath();
            sctx.ellipse(hx, hy, 4.5, 6, 0, 0, Math.PI * 2);
            sctx.fill();
            sctx.fillRect(hx - 6, hy - 1, 3, 2);
            sctx.fillRect(hx + 3, hy - 1, 3, 2);
          }
        }
      }

      // a bucket of gear, lower left
      sctx.strokeStyle = "rgba(180,70,45,0.7)";
      sctx.lineWidth = 1.6;
      sctx.beginPath();
      sctx.moveTo(w * 0.07, h * 0.74);
      sctx.lineTo(w * 0.075, h * 0.8);
      sctx.lineTo(w * 0.11, h * 0.8);
      sctx.lineTo(w * 0.115, h * 0.74);
      sctx.stroke();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      for (const c of [canvas, scene, mask]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintScene();
    };
    resize();
    window.addEventListener("resize", resize);

    const radius = () => Math.max(120, Math.min(w, h) * 0.22);

    const frame = () => {
      const R = radius();
      const torch = torchRef.current;

      // build the reveal mask
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (torch.active) {
        const g = mctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, R);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.6, "rgba(255,255,255,0.85)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        mctx.fillStyle = g;
        mctx.beginPath();
        mctx.arc(torch.x, torch.y, R, 0, Math.PI * 2);
        mctx.fill();
      }
      // found nests linger, dimly
      foundRef.current.forEach((isFound, i) => {
        if (!isFound) return;
        const nx = NESTS[i].nx * w;
        const ny = NESTS[i].ny * h;
        const g = mctx.createRadialGradient(nx, ny, 0, nx, ny, 60);
        g.addColorStop(0, "rgba(255,255,255,0.42)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        mctx.fillStyle = g;
        mctx.beginPath();
        mctx.arc(nx, ny, 60, 0, Math.PI * 2);
        mctx.fill();
      });
      // keep only scene where the mask is lit
      mctx.globalCompositeOperation = "source-in";
      mctx.drawImage(scene, 0, 0, mask.width, mask.height);
      mctx.globalCompositeOperation = "source-over";

      // compose main: darkness, ambient ghost, revealed scene, torch tint
      const target = complete ? 0.42 : 0.05;
      ambientRef.current = lerp(ambientRef.current, reduced ? 0.7 : target, 0.05);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#050202";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = ambientRef.current;
      ctx.drawImage(scene, 0, 0, mask.width, mask.height);
      ctx.globalAlpha = 1;

      if (!reduced) {
        ctx.drawImage(mask, 0, 0, mask.width, mask.height);
      } else {
        ctx.globalAlpha = 0.75;
        ctx.drawImage(scene, 0, 0, mask.width, mask.height);
        ctx.globalAlpha = 1;
      }

      // red torch cast + reticle
      if (torch.active && !reduced) {
        ctx.globalCompositeOperation = "lighter";
        const tint = ctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, R);
        tint.addColorStop(0, "rgba(255,60,34,0.16)");
        tint.addColorStop(0.7, "rgba(200,40,24,0.05)");
        tint.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tint;
        ctx.beginPath();
        ctx.arc(torch.x, torch.y, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        ctx.strokeStyle = "rgba(255,90,60,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(torch.x, torch.y, R * 0.96, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,140,110,0.8)";
        ctx.beginPath();
        ctx.arc(torch.x, torch.y, 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // pointer → torch + nest discovery
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      torchRef.current = { x, y, active: true };
      if (!movedRef.current) {
        movedRef.current = true;
        setMoved(true);
      }
      const R = radius() * 0.7;
      let changed = false;
      NESTS.forEach((n, i) => {
        if (foundRef.current[i]) return;
        const dx = n.nx * w - x;
        const dy = n.ny * h - y;
        if (Math.hypot(dx, dy) < R) {
          foundRef.current[i] = true;
          changed = true;
        }
      });
      if (changed) {
        setFound(foundRef.current.filter(Boolean).length);
      }
    };
    const onLeave = () => {
      torchRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, complete]);

  return (
    <div className="relative h-[88vh] min-h-[560px] overflow-hidden" style={{ background: "#050202" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" style={{ cursor: reduced ? "auto" : "none" }} />

      {/* counter */}
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[color:rgba(255,150,120,0.85)]">
        Nests found
        <span className="ml-3 text-[color:var(--paper)]">
          {displayFound} / {NESTS.length}
        </span>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[color:rgba(255,120,90,0.55)]">
        Night patrol · red light only
        <br />
        so the hatchlings aren&apos;t misled
      </div>

      {/* opening hint */}
      {!reduced && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: moved ? 0 : 1 }}
        >
          <div className="text-center">
            <div className="font-header text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] text-[color:rgba(240,220,215,0.9)]">
              It&apos;s pitch dark out here.
            </div>
            <div className="mt-4 font-mono text-[12px] uppercase tracking-[0.3em] text-[color:rgba(255,150,120,0.8)]">
              move your torch across the beach →
            </div>
          </div>
        </div>
      )}

      {/* closing CTA */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-14 text-center transition-all duration-700"
        style={{
          opacity: complete ? 1 : 0,
          transform: complete ? "translateY(0)" : "translateY(20px)",
          pointerEvents: complete ? "auto" : "none",
        }}
      >
        <p className="font-header text-[clamp(1.8rem,4.4vw,3.5rem)] uppercase leading-[0.95] text-[color:var(--paper)]">
          You found them in the dark.
        </p>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[color:rgba(240,220,215,0.75)]">
          So do we — 214 nights a season, someone walks this beach with a red
          light so the next generation makes it to the water.
        </p>
        <Button
          asChild
          className="donate-lava mt-6 h-auto rounded-full px-8 py-4 text-[15px] font-bold text-[var(--ink)]"
        >
          <Link href="/donate">Fund a night patrol — $100/mo</Link>
        </Button>
      </div>
    </div>
  );
}
