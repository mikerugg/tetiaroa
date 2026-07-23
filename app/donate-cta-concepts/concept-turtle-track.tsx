"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { clamp01, usePrefersReducedMotion } from "./concept-utils";

// One continuous loop: hatch on Teti'aroa, out into the Pacific, and home again
// to the same sand ~25 years later. Waypoints sit roughly on the path so the
// travelling ping lights each one as it passes.
const PATH_D =
  "M 205 358 C 300 300 380 250 470 232 C 590 208 720 210 812 292 " +
  "C 880 355 780 415 690 452 C 560 505 430 520 380 486 " +
  "C 300 430 215 400 205 358 Z";

type Waypoint = {
  at: number;
  x: number;
  y: number;
  title: string;
  sub: string;
};

const WAYPOINTS: Waypoint[] = [
  { at: 0.03, x: 205, y: 358, title: "Hatched", sub: "Teti'aroa — the night of her release" },
  { at: 0.2, x: 470, y: 232, title: "The lost years", sub: "one hatchling, alone in the open Pacific" },
  { at: 0.42, x: 812, y: 292, title: "Feeding grounds", sub: "2,600 km from the sand she was born on" },
  { at: 0.62, x: 690, y: 452, title: "Still pinging", sub: "the tag outlasts every battery we feared" },
  { at: 0.82, x: 380, y: 486, title: "She turns back", sub: "the same current, running in reverse" },
  { at: 0.98, x: 205, y: 358, title: "Home", sub: "her own nest, the same beach" },
];

const CURRENTS = [
  "M -40 180 C 220 120 520 150 780 90 C 940 60 1040 120 1080 90",
  "M -40 300 C 260 250 480 360 760 300 C 940 260 1040 330 1080 300",
  "M -40 430 C 200 380 520 470 800 430 C 960 405 1040 460 1080 440",
  "M -40 540 C 260 500 500 560 780 520 C 940 495 1040 545 1080 530",
];

export function ConceptTurtleTrack() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drawnRef = useRef<SVGPathElement | null>(null);
  const pingRef = useRef<SVGGElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const capTitleRef = useRef<HTMLDivElement | null>(null);
  const capSubRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const yearsRef = useRef<HTMLSpanElement | null>(null);
  const kmRef = useRef<HTMLSpanElement | null>(null);
  const depthRef = useRef<HTMLSpanElement | null>(null);
  const wpIndexRef = useRef(-1);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      return;
    }

    const wrap = wrapRef.current;
    const drawn = drawnRef.current;
    const ping = pingRef.current;
    if (!wrap || !drawn || !ping) {
      return;
    }

    const length = drawn.getTotalLength();
    drawn.style.strokeDasharray = String(length);
    const waypointEls = Array.from(
      wrap.querySelectorAll<SVGGElement>("[data-wp]"),
    );

    let queued = false;

    const update = () => {
      queued = false;
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = clamp01(span > 0 ? -rect.top / span : 0);

      drawn.style.strokeDashoffset = String(length * (1 - p));
      const pt = drawn.getPointAtLength(p * length);
      ping.setAttribute("transform", `translate(${pt.x} ${pt.y})`);

      if (titleRef.current) {
        titleRef.current.style.opacity = String(clamp01(1 - p * 7));
      }

      const endIn = clamp01((p - 0.9) / 0.07);
      if (ctaRef.current) {
        ctaRef.current.style.opacity = String(endIn);
        ctaRef.current.style.transform = `translateY(${(1 - endIn) * 18}px)`;
        ctaRef.current.style.pointerEvents = endIn > 0.5 ? "auto" : "none";
      }
      if (captionRef.current) {
        captionRef.current.style.opacity = String(clamp01(1 - endIn * 1.4));
      }

      for (const el of waypointEls) {
        const at = Number(el.dataset.at);
        el.style.opacity = String(clamp01((p - at) * 26));
      }

      if (yearsRef.current) yearsRef.current.textContent = Math.round(p * 25).toString();
      if (kmRef.current) kmRef.current.textContent = Math.round(p * 7400).toLocaleString();
      if (depthRef.current) {
        const depth = 4 + Math.round(Math.abs(Math.sin(p * 9)) * 86);
        depthRef.current.textContent = depth.toString();
      }

      let active = 0;
      for (let i = 0; i < WAYPOINTS.length; i += 1) {
        if (p >= WAYPOINTS[i].at) active = i;
      }
      if (active !== wpIndexRef.current) {
        wpIndexRef.current = active;
        if (capTitleRef.current) capTitleRef.current.textContent = WAYPOINTS[active].title;
        if (capSubRef.current) capSubRef.current.textContent = WAYPOINTS[active].sub;
      }
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
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={reduced ? "relative" : "relative h-[520vh] overflow-clip"}
      style={{ background: "var(--ink)" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1000 620"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="tt-ocean" cx="42%" cy="52%" r="80%">
              <stop offset="0%" stopColor="#0d2a2e" />
              <stop offset="55%" stopColor="#08191d" />
              <stop offset="100%" stopColor="#040d10" />
            </radialGradient>
            <filter id="tt-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="620" fill="url(#tt-ocean)" />

          {/* graticule */}
          <g stroke="rgba(127,214,214,0.10)" strokeWidth="0.6">
            {[100, 250, 400, 550, 700, 850, 950].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="620" />
            ))}
            {[90, 210, 330, 450, 570].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} />
            ))}
          </g>

          {/* drifting currents */}
          <g fill="none" stroke="rgba(127,214,214,0.16)" strokeWidth="1.1">
            {CURRENTS.map((d, i) => (
              <path key={d} d={d} strokeDasharray="4 18">
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-44"
                  dur={`${3.4 + i * 0.6}s`}
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </g>

          {/* bathymetric shelf around the atoll */}
          <g
            fill="none"
            stroke="rgba(255,180,84,0.22)"
            strokeWidth="0.8"
            strokeDasharray="2 6"
          >
            <ellipse cx="205" cy="358" rx="46" ry="34" />
            <ellipse cx="205" cy="358" rx="74" ry="55" />
            <ellipse cx="205" cy="358" rx="108" ry="80" opacity="0.6" />
          </g>

          {/* faint full route */}
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(127,214,214,0.22)"
            strokeWidth="1.4"
            strokeDasharray="3 9"
          />

          {/* travelled route */}
          <path
            ref={drawnRef}
            d={PATH_D}
            fill="none"
            stroke="var(--glow)"
            strokeWidth="2.6"
            strokeLinecap="round"
            filter="url(#tt-glow)"
            style={
              reduced
                ? undefined
                : { strokeDasharray: 4000, strokeDashoffset: 4000 }
            }
          />

          {/* origin atoll */}
          <g>
            <circle cx="205" cy="358" r="9" fill="none" stroke="var(--flame)" strokeWidth="1.6" />
            <circle cx="205" cy="358" r="3" fill="var(--flame)" />
            <text
              x="205"
              y="392"
              textAnchor="middle"
              className="font-mono"
              fontSize="12"
              letterSpacing="2"
              fill="rgba(255,214,170,0.85)"
            >
              TETI&apos;AROA
            </text>
          </g>

          {/* waypoints */}
          {WAYPOINTS.slice(1, 5).map((wp) => (
            <g
              key={wp.title}
              data-wp
              data-at={wp.at}
              style={{ opacity: reduced ? 1 : 0 }}
            >
              <circle cx={wp.x} cy={wp.y} r="4" fill="var(--glow)" />
              <circle cx={wp.x} cy={wp.y} r="10" fill="none" stroke="var(--glow)" strokeWidth="0.8" opacity="0.5" />
              <line x1={wp.x} y1={wp.y - 16} x2={wp.x} y2={wp.y - 6} stroke="rgba(127,214,214,0.6)" strokeWidth="0.8" />
              <text
                x={wp.x}
                y={wp.y - 22}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                letterSpacing="1.5"
                fill="rgba(230,246,246,0.92)"
              >
                {wp.title.toUpperCase()}
              </text>
            </g>
          ))}

          {/* travelling ping */}
          <g ref={pingRef} transform="translate(205 358)">
            {!reduced && (
              <circle r="10" fill="none" stroke="var(--glow)" strokeWidth="1.4">
                <animate attributeName="r" values="8;30;8" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r="6" fill="var(--glow)" filter="url(#tt-glow)" />
            <circle r="2.4" fill="#eafffb" />
          </g>
        </svg>

        {/* corner console label */}
        <div className="pointer-events-none absolute right-5 top-5 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-[color:rgba(127,214,214,0.6)]">
          Tetiaroa Society
          <br />
          Sea Turtle Telemetry
        </div>

        {/* live telemetry HUD */}
        <div className="pointer-events-none absolute left-5 top-5 w-[230px] rounded-lg border border-[color:rgba(127,214,214,0.22)] bg-[color:rgba(4,13,16,0.55)] p-4 font-mono text-[11px] tracking-[0.12em] text-[color:rgba(220,240,240,0.9)] backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--glow)]">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-[color:var(--glow)]" />
            Live · Argos uplink
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[color:rgba(220,240,240,0.5)]">TAG</span>
              <span>96 · C. mydas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:rgba(220,240,240,0.5)]">ELAPSED</span>
              <span>
                <span ref={yearsRef}>0</span> yr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:rgba(220,240,240,0.5)]">DISTANCE</span>
              <span>
                <span ref={kmRef}>0</span> km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:rgba(220,240,240,0.5)]">DEPTH</span>
              <span>
                <span ref={depthRef}>4</span> m
              </span>
            </div>
          </div>
        </div>

        {/* opening title */}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-x-0 top-[26%] px-6 text-center"
          style={{ opacity: reduced ? 0 : 1 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[color:var(--glow)]">
            Argos Tag 96 — Green Sea Turtle
          </div>
          <h3 className="font-header mx-auto mt-4 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] uppercase leading-[0.92] text-[color:var(--paper)]">
            Follow one turtle home
          </h3>
          <p className="font-display mx-auto mt-4 max-w-[46ch] text-[clamp(1rem,1.6vw,1.35rem)] italic text-[color:rgba(220,240,240,0.72)]">
            Tagged the night she hatched. Twenty-five years of pings, plotted.
            Scroll to travel with her.
          </p>
        </div>

        {/* moving caption */}
        <div
          ref={captionRef}
          className="pointer-events-none absolute inset-x-0 bottom-[13vh] px-6 text-center"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          <div
            ref={capTitleRef}
            className="font-header text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-none text-[color:var(--paper)]"
          >
            {reduced ? "Home" : ""}
          </div>
          <div
            ref={capSubRef}
            className="font-display mx-auto mt-2 max-w-[42ch] text-[clamp(1rem,1.8vw,1.5rem)] italic text-[color:rgba(220,240,240,0.75)]"
          >
            {reduced ? "her own nest, the same beach" : ""}
          </div>
        </div>

        {/* closing CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-[12vh] flex flex-col items-center px-6 text-center"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          <p className="font-display max-w-[24ch] text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.15] text-[color:var(--paper)]">
            One in a thousand hatchlings lives to see this beach again.
          </p>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[color:rgba(220,240,240,0.7)]">
            Every turtle we know by name, we know because someone paid for the
            tag.
          </p>
          <Button
            asChild
            className="donate-lava mt-6 h-auto rounded-full px-8 py-4 text-[15px] font-bold text-[var(--ink)]"
          >
            <Link href="/donate">Tag the next hatchling — $75</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
