"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { ArrowRightIcon, MoveHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  INTAKE_DEPTH,
  depthAtDistance,
  slopeProfiles,
  type Alternative,
  type SwacCopy,
} from "./swac-content";
import styles from "./swac.module.css";

/*
 * Both profiles share one horizontal scale — that is the entire argument, and
 * splitting them across a wipe would hide half of it at all times. The depth
 * axis stops at 1000 m because nothing below the intake is relevant here.
 */
const MAX_KM = 150;
const MAX_M = 1000;
/* A wide band, not a square: the plot has to sit inside one viewport
   alongside its header and readouts. */
const PLOT = { left: 74, right: 980, top: 24, bottom: 268 };

const xScale = (km: number) =>
  PLOT.left + (Math.min(km, MAX_KM) / MAX_KM) * (PLOT.right - PLOT.left);
const yScale = (metres: number) =>
  PLOT.top + (Math.min(metres, MAX_M) / MAX_M) * (PLOT.bottom - PLOT.top);

/** Walks a profile until it leaves the plotted depth range. */
function buildProfilePath(profile: (typeof slopeProfiles)["atoll"]) {
  const commands: string[] = [];
  const points = profile.points;

  for (let i = 0; i < points.length; i += 1) {
    const [km, metres] = points[i];

    if (metres > MAX_M) {
      // Interpolate the exact crossing so the line leaves through the floor
      // rather than stopping short of it.
      const [prevKm, prevM] = points[i - 1] ?? [0, 0];
      const t = (MAX_M - prevM) / (metres - prevM);
      const crossKm = prevKm + t * (km - prevKm);
      commands.push(`L ${xScale(crossKm)} ${yScale(MAX_M)}`);
      break;
    }

    commands.push(`${i === 0 ? "M" : "L"} ${xScale(km)} ${yScale(metres)}`);
  }

  return commands.join(" ");
}

type TheSlopeProps = {
  copy: SwacCopy["slope"];
};

export function TheSlope({ copy }: TheSlopeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrubKm, setScrubKm] = useState(24);
  const [activeAlternative, setActiveAlternative] = useState<Alternative["id"]>(
    "swac",
  );

  const atollPath = useMemo(() => buildProfilePath(slopeProfiles.atoll), []);
  const shelfPath = useMemo(() => buildProfilePath(slopeProfiles.shelf), []);

  const atollDepth = depthAtDistance(slopeProfiles.atoll, scrubKm);
  const shelfDepth = depthAtDistance(slopeProfiles.shelf, scrubKm);

  const updateFromPointer = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const rect = stage.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    // Map the pointer through the same viewBox padding the plot uses.
    const viewX = ratio * 1000;
    const km =
      ((viewX - PLOT.left) / (PLOT.right - PLOT.left)) * MAX_KM;
    setScrubKm(Math.min(MAX_KM, Math.max(0, km)));
  }, []);

  const alternative =
    copy.alternatives.find((item) => item.id === activeAlternative) ??
    copy.alternatives[0];

  const scrubX = xScale(scrubKm);

  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <header className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-3xl font-header text-5xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {copy.intro}
          </p>
        </header>

        <div
          ref={stageRef}
          className={cn(styles.slopeStage, "mt-12")}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event.clientX);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              updateFromPointer(event.clientX);
            }
          }}
          onPointerUp={(event) =>
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        >
          <svg
            viewBox="0 0 1000 330"
            role="img"
            aria-label={copy.visualDescription}
            className={styles.slopeSvg}
          >
            <title>{copy.title}</title>
            <desc>{copy.visualDescription}</desc>

            <defs>
              <linearGradient id="slope-sea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a5f70" stopOpacity="0.55" />
                <stop offset="1" stopColor="#02090f" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            <rect
              x={PLOT.left}
              y={PLOT.top}
              width={PLOT.right - PLOT.left}
              height={PLOT.bottom - PLOT.top}
              fill="url(#slope-sea)"
            />

            {/* Depth gridlines, recessive. */}
            {[0, 250, 500, 750, 1000].map((metres) => (
              <g key={metres}>
                <line
                  x1={PLOT.left}
                  x2={PLOT.right}
                  y1={yScale(metres)}
                  y2={yScale(metres)}
                  stroke="rgba(233,240,236,0.08)"
                  strokeWidth="1"
                />
                <text
                  x={PLOT.left - 10}
                  y={yScale(metres) + 4}
                  textAnchor="end"
                  className="fill-[rgba(233,240,236,0.42)] font-mono text-[11px]"
                >
                  {metres} m
                </text>
              </g>
            ))}

            {/* Distance ticks. */}
            {[0, 25, 50, 75, 100, 125, 150].map((km) => (
              <text
                key={km}
                x={xScale(km)}
                y={PLOT.bottom + 22}
                textAnchor="middle"
                className="fill-[rgba(233,240,236,0.42)] font-mono text-[11px]"
              >
                {km} km
              </text>
            ))}

            {/* The line that matters. */}
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={yScale(INTAKE_DEPTH)}
              y2={yScale(INTAKE_DEPTH)}
              stroke="var(--series-cold)"
              strokeWidth="1.5"
              strokeDasharray="7 6"
            />
            {/* Parked mid-plot: both ends of this line carry crossing markers. */}
            <text
              x={(PLOT.left + PLOT.right) / 2}
              y={yScale(INTAKE_DEPTH) - 12}
              textAnchor="middle"
              className="fill-[var(--series-cold)] font-mono text-[12px]"
            >
              {copy.depthMarker}
            </text>

            <path
              d={shelfPath}
              fill="none"
              stroke="var(--series-warm)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d={atollPath}
              fill="none"
              stroke="var(--series-cold)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Where each profile crosses the intake depth. */}
            {(
              [
                ["atoll", slopeProfiles.atoll.distanceToDepthKm, "var(--series-cold)"],
                ["shelf", slopeProfiles.shelf.distanceToDepthKm, "var(--series-warm)"],
              ] as const
            ).map(([id, km, colour]) => (
              <g key={id}>
                <circle
                  cx={xScale(km)}
                  cy={yScale(INTAKE_DEPTH)}
                  r="6"
                  fill={colour}
                  stroke="#02090f"
                  strokeWidth="2"
                />
                <text
                  x={xScale(km)}
                  y={yScale(INTAKE_DEPTH) + 26}
                  textAnchor={id === "atoll" ? "start" : "end"}
                  className="fill-[rgba(233,240,236,0.8)] font-mono text-[12px]"
                >
                  {km} km
                </text>
              </g>
            ))}

            {/* Scrubber. */}
            <line
              x1={scrubX}
              x2={scrubX}
              y1={PLOT.top}
              y2={PLOT.bottom}
              stroke="rgba(233,240,236,0.55)"
              strokeWidth="1"
            />
          </svg>

          <div
            className={styles.slopeHandle}
            style={{ left: `${(scrubX / 1000) * 100}%` }}
          >
            <span className={styles.slopeGrip}>
              <MoveHorizontalIcon className="size-4" aria-hidden="true" />
            </span>
          </div>

          <p className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {copy.dragLabel}
          </p>
        </div>

        {/* Live readout: at this distance, how deep is each seabed? */}
        <div
          className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
          aria-live="polite"
        >
          <div className="flex flex-col gap-1 bg-background p-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {copy.pipeLabel}
            </span>
            <span className="font-header text-4xl leading-none text-foreground">
              <NumberFlow
                value={scrubKm}
                format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }}
                suffix=" km"
              />
            </span>
          </div>
          <SlopeReadout
            label={copy.atollLabel}
            caption={copy.atollCaption}
            depth={atollDepth}
            colour="var(--series-cold)"
          />
          <SlopeReadout
            label={copy.shelfLabel}
            caption={copy.shelfCaption}
            depth={shelfDepth}
            colour="var(--series-warm)"
          />
        </div>

        <div className="mt-6">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-auto rounded-full px-5 py-3"
          >
            <Link href={copy.geologyHref}>
              {copy.geologyLabel}
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* ------------------------------------------------ the alternatives */}

        <div className="mt-24 border-t border-border pt-16 lg:mt-32 lg:pt-24">
          <header className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {copy.alternativesEyebrow}
              </p>
              <h3 className="max-w-2xl font-header text-4xl leading-[0.92] text-foreground sm:text-6xl">
                {copy.alternativesTitle}
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {copy.alternativesIntro}
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label={copy.geographyLabel}
            >
              {copy.alternatives.map((item) => {
                const isActive = item.id === alternative.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setActiveAlternative(item.id)}
                    className={cn(
                      "relative flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                      isActive
                        ? "border-primary/60 bg-primary/5"
                        : "border-border hover:border-primary/35",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="slope-alternative-marker"
                        className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-base leading-6 text-foreground">
                        {item.geography}
                      </span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {item.technology}
                      </span>
                    </span>
                    <ArrowRightIcon
                      className={cn(
                        "size-4 shrink-0 transition-opacity",
                        isActive ? "opacity-100 text-primary" : "opacity-30",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={alternative.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="border border-border bg-card">
                  <CardHeader>
                    <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      {copy.technologyLabel}
                    </CardDescription>
                    <CardTitle className="font-display text-4xl leading-none text-foreground">
                      {alternative.technology}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <p className="text-lg leading-8 text-foreground/85">
                      {alternative.summary}
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">
                      {alternative.detail}
                    </p>

                    <div className="flex flex-col gap-2 border-t border-border pt-5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.remainingLabel}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="h-3 flex-1 overflow-hidden rounded-[4px] bg-muted">
                          <motion.div
                            className="h-full rounded-[4px]"
                            style={{ background: "var(--series-warm)" }}
                            initial={false}
                            animate={{
                              width: `${alternative.remainingEnergy * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 140, damping: 24 }}
                          />
                        </div>
                        <span className="w-16 text-right font-mono text-xs text-foreground">
                          {Math.round(alternative.remainingEnergy * 100)} %
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border pt-5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.exampleLabel}
                      </span>
                      <Badge variant="secondary" className="w-fit max-w-full whitespace-normal py-1 text-left font-mono text-[11px]">
                        {alternative.example}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlopeReadout({
  label,
  caption,
  depth,
  colour,
}: {
  label: string;
  caption: string;
  depth: number;
  colour: string;
}) {
  const beyondPlot = depth >= MAX_M;

  return (
    <div className="flex flex-col gap-1 bg-background p-5">
      <span className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: colour }}
          aria-hidden="true"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </span>
      <span className="font-header text-4xl leading-none text-foreground">
        {beyondPlot ? (
          `> ${MAX_M} m`
        ) : (
          <NumberFlow value={Math.round(depth)} suffix=" m" />
        )}
      </span>
      <span className="text-xs leading-5 text-muted-foreground">{caption}</span>
    </div>
  );
}
