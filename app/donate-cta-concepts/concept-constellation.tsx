"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrefersReducedMotion } from "./concept-utils";

type Gift = {
  id: number;
  name: string;
  city: string;
  amount: number;
  when: string;
  you?: boolean;
};

type Star = {
  nx: number;
  ny: number;
  r: number;
  warm: number; // 0 cool → 1 warm
  phase: number;
  speed: number;
};

type Ignition = {
  nx: number;
  ny: number;
  warm: number;
  age: number;
  you?: boolean;
  label?: string;
};

const NAMES = [
  "Make", "Hina", "Teva", "Claire", "Noa", "Sofia", "Léa", "Marcus",
  "Aria", "Kai", "Elena", "Tom", "Vaite", "Rima", "Owen", "Mara",
  "Jonas", "Poe", "Nina", "Théo", "Ana", "Liam", "Moana", "Ines",
];
const CITIES = [
  "Pape'ete", "Berlin", "Auckland", "Lyon", "Kyoto", "Oslo", "Lisbon",
  "Denver", "Bristol", "Cape Town", "Montréal", "Seoul", "Austin", "Perth",
];
const AMOUNTS = [25, 25, 25, 50, 50, 100, 100, 150, 250, 500];

// deterministic seed so server and client render the same first frame
const INITIAL_FEED: Gift[] = [
  { id: -1, name: "Hina", city: "Pape'ete", amount: 100, when: "1 min ago" },
  { id: -2, name: "Claire", city: "Lyon", amount: 50, when: "3 min ago" },
  { id: -3, name: "Noa", city: "Auckland", amount: 25, when: "6 min ago" },
  { id: -4, name: "Jonas", city: "Berlin", amount: 250, when: "9 min ago" },
  { id: -5, name: "Aria", city: "Bristol", amount: 50, when: "12 min ago" },
];

let idSeed = 1;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
function makeGift(you = false): Gift {
  return {
    id: idSeed++,
    name: you ? "You" : pick(NAMES),
    city: you ? "Teti'aroa" : pick(CITIES),
    amount: pick(AMOUNTS),
    when: "just now",
    you,
  };
}

export function ConceptConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const ambientRef = useRef<Star[]>([]);
  const ignitionsRef = useRef<Ignition[]>([]);
  const shootRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number } | null>(null);
  const reduced = usePrefersReducedMotion();

  const [feed, setFeed] = useState<Gift[]>(INITIAL_FEED);
  const [count, setCount] = useState(12847);
  const [sum, setSum] = useState(486210);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // stable across renders — only touches refs and stable state setters
  const igniteGift = useCallback((gift: Gift) => {
    ignitionsRef.current.push({
      nx: 0.08 + Math.random() * 0.84,
      ny: 0.06 + Math.random() * 0.82,
      warm: gift.you ? 1 : Math.random(),
      age: 0,
      you: gift.you,
      label: gift.you ? "You" : undefined,
    });
    setFeed((prev) => [gift, ...prev].slice(0, 6));
    setCount((c) => c + 1);
    setSum((s) => s + gift.amount);
  }, []);

  function addYourLight() {
    const amt = Math.max(1, Number.parseInt(amount || "50", 10) || 50);
    igniteGift({ ...makeGift(true), name: name.trim() || "You", amount: amt });
    setName("");
    setAmount("");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // seed the sky (client-only; canvas is never server-rendered)
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 84 }, () => ({
        nx: Math.random(),
        ny: Math.random() * 0.92,
        r: 1.1 + Math.random() * 1.9,
        warm: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.4,
      }));
      ambientRef.current = Array.from({ length: 200 }, () => ({
        nx: Math.random(),
        ny: Math.random(),
        r: 0.4 + Math.random() * 0.9,
        warm: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 2,
      }));
    }

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

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

    const color = (warm: number, a: number) => {
      // cool cyan (var --glow ~ #9fd8d0) → warm flame (#ffcf9a)
      const r = Math.round(159 + warm * 96);
      const g = Math.round(216 - warm * 8);
      const b = Math.round(208 - warm * 54);
      return `rgba(${r},${g},${b},${a})`;
    };

    const drawStar = (x: number, y: number, r: number, warm: number, a: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = color(warm, a * 0.14);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color(warm, a);
      ctx.fill();
    };

    let last = performance.now();
    let nextIgnite = 1500;
    let nextShoot = 4000;

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const t = now / 1000;

      // background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#03080b");
      bg.addColorStop(0.6, "#061318");
      bg.addColorStop(1, "#0a2024");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // milky band
      const band = ctx.createLinearGradient(0, h * 0.1, w, h * 0.7);
      band.addColorStop(0, "rgba(127,214,214,0)");
      band.addColorStop(0.5, "rgba(127,214,214,0.06)");
      band.addColorStop(1, "rgba(127,214,214,0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, 0, w, h);

      // ambient field
      for (const s of ambientRef.current) {
        const tw = reduced ? 0.7 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        drawStar(s.nx * w, s.ny * h, s.r, s.warm, 0.5 * tw);
      }

      // donor stars
      for (const s of starsRef.current) {
        const tw = reduced ? 0.9 : 0.65 + 0.35 * Math.sin(t * s.speed + s.phase);
        drawStar(s.nx * w, s.ny * h, s.r, s.warm, 0.95 * tw);
      }

      // ignitions
      const survivors: Ignition[] = [];
      for (const ig of ignitionsRef.current) {
        ig.age += dt / 1000;
        const x = ig.nx * w;
        const y = ig.ny * h;
        const life = ig.you ? 2.6 : 2;
        const k = ig.age / life;

        if (!reduced && k < 1) {
          // constellation lines to nearest donor stars
          const near = starsRef.current
            .map((s) => ({ s, d: (s.nx - ig.nx) ** 2 + (s.ny - ig.ny) ** 2 }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 3);
          ctx.strokeStyle = color(ig.warm, (1 - k) * 0.4);
          ctx.lineWidth = 0.6;
          for (const { s } of near) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(s.nx * w, s.ny * h);
            ctx.stroke();
          }
          // expanding ripple
          ctx.beginPath();
          ctx.arc(x, y, k * (ig.you ? 90 : 60), 0, Math.PI * 2);
          ctx.strokeStyle = color(ig.warm, (1 - k) * 0.7);
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        const flare = ig.you ? 5.5 : 3.6;
        drawStar(x, y, flare * (reduced ? 1 : 1 + (1 - Math.min(1, k)) * 1.4), ig.warm, 1);

        if (ig.you && ig.label) {
          ctx.font = "600 12px ui-monospace, monospace";
          ctx.fillStyle = color(1, Math.max(0.35, 1 - k * 0.5));
          ctx.textAlign = "center";
          ctx.fillText(ig.label.toUpperCase(), x, y - 16);
        }

        if (ig.age >= life) {
          starsRef.current.push({
            nx: ig.nx,
            ny: ig.ny,
            r: ig.you ? 2.6 : 1.8,
            warm: ig.warm,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 1.4,
          });
        } else {
          survivors.push(ig);
        }
      }
      ignitionsRef.current = survivors;

      // shooting star
      if (!reduced) {
        nextShoot -= dt;
        if (nextShoot <= 0 && !shootRef.current) {
          nextShoot = 6000 + Math.random() * 6000;
          shootRef.current = {
            x: Math.random() * w * 0.7,
            y: Math.random() * h * 0.4,
            vx: 5 + Math.random() * 3,
            vy: 1.6 + Math.random() * 1.4,
            life: 1,
          };
        }
        const sh = shootRef.current;
        if (sh) {
          sh.x += sh.vx * (dt / 16);
          sh.y += sh.vy * (dt / 16);
          sh.life -= dt / 900;
          const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
          g.addColorStop(0, `rgba(234,255,251,${Math.max(0, sh.life)})`);
          g.addColorStop(1, "rgba(234,255,251,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
          ctx.stroke();
          if (sh.life <= 0 || sh.x > w) shootRef.current = null;
        }
      }

      // auto trickle of new gifts
      if (!reduced) {
        nextIgnite -= dt;
        if (nextIgnite <= 0) {
          nextIgnite = 2400 + Math.random() * 2600;
          igniteGift(makeGift());
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, igniteGift]);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#03080b" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* counter, top-right */}
      <div className="pointer-events-none absolute right-6 top-6 text-right">
        <div className="font-header text-[clamp(1.8rem,3vw,2.75rem)] leading-none text-[color:var(--paper)]">
          {count.toLocaleString()}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:rgba(127,214,214,0.7)]">
          lights and counting
        </div>
        <div className="mt-3 font-mono text-[11px] tracking-[0.1em] text-[color:rgba(220,240,240,0.55)]">
          ${sum.toLocaleString()} lit this month
        </div>
      </div>

      {/* live feed, bottom-right */}
      <div className="pointer-events-none absolute bottom-8 right-6 w-[260px] max-[720px]:hidden">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:rgba(127,214,214,0.6)]">
          Lit in the last hour
        </div>
        <ul className="flex flex-col gap-2">
          {feed.map((g, i) => (
            <li
              key={g.id}
              className="flex items-center gap-2.5 font-mono text-[12px] tracking-[0.04em]"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <span
                className="inline-block size-2 flex-none rounded-full"
                style={{
                  background: g.you ? "var(--flame)" : "var(--glow)",
                  boxShadow: `0 0 10px ${g.you ? "rgba(255,180,84,0.8)" : "rgba(127,214,214,0.7)"}`,
                }}
              />
              <span className={g.you ? "text-[color:var(--flame)]" : "text-[color:rgba(230,246,246,0.9)]"}>
                {g.name}, {g.city}
              </span>
              <span className="ml-auto text-[color:rgba(220,240,240,0.5)]">${g.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* editorial + form, lower-left */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-14 pt-40 sm:px-12">
        <div className="max-w-[36rem]">
          <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[color:var(--glow)]">
            The night sky over Teti&apos;aroa
          </div>
          <h3 className="font-header mt-4 text-[clamp(2rem,4.6vw,4rem)] uppercase leading-[0.94] text-[color:var(--paper)]">
            Every light is
            <br />
            someone who
            <br />
            <span className="text-[color:var(--flame)]">paid attention.</span>
          </h3>
          <p className="font-display mt-4 max-w-[44ch] text-[clamp(1rem,1.6vw,1.3rem)] italic text-[color:rgba(220,240,240,0.75)]">
            Not a progress bar. A sky — one star for every gift that keeps this
            atoll watched over. Add yours, and name it.
          </p>

          <div className="mt-7 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:rgba(220,240,240,0.55)]">
                Name your light
              </span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous is fine"
                className="w-[190px] bg-[color:rgba(4,13,16,0.6)] font-mono text-[14px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:rgba(220,240,240,0.55)]">
                Amount
              </span>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="$50"
                className="w-[110px] bg-[color:rgba(4,13,16,0.6)] font-mono text-[14px]"
              />
            </label>
            <Button
              type="button"
              onClick={addYourLight}
              className="donate-lava h-auto rounded-full px-7 py-3.5 text-[15px] font-bold text-[var(--ink)]"
            >
              Add your light
            </Button>
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-[color:rgba(220,240,240,0.45)]">
            Prototype — your star ignites in the sky above. Real gift flows to
            the donate page.
          </p>
        </div>
      </div>
    </div>
  );
}
