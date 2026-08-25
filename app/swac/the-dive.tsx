"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { ThermometerSnowflakeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MAX_DIVE_DEPTH,
  THERMOCLINE_BASE,
  THERMOCLINE_TOP,
  lightAtDepth,
  pressureAtDepth,
  temperatureAtDepth,
  type SwacCopy,
} from "./swac-content";
import styles from "./swac.module.css";

// Client-only: WebGL cannot be prerendered, and `ssr: false` is illegal in a
// Server Component, so the gate and the import both live in here.
const DiveScene3D = dynamic(() => import("./dive-scene-3d"), { ssr: false });

const THERMOCLINE_CARD_EXIT_DEPTH = 475;

/**
 * Whether this browser should be handed a 180 kB WebGL scene at all. This is a
 * read of an external system rather than React state, so it goes through
 * useSyncExternalStore: probing in an effect and calling setState would cause
 * exactly the cascading render the lint rule is there to prevent.
 *
 * The answer cannot change for the life of the document, so there is nothing
 * to subscribe to and the snapshot is cached after the first probe.
 */
const subscribeToNothing = () => () => {};

let sceneSupport: boolean | null = null;

function probeSceneSupport() {
  if (sceneSupport !== null) {
    return sceneSupport;
  }

  // Viewport width is the real proxy for "this is not a phone". Pointer type is
  // not: touchscreen laptops report a coarse pointer and would wrongly fall
  // back, and some desktop browsers report none at all.
  if (!window.matchMedia("(min-width: 1024px)").matches) {
    sceneSupport = false;
    return sceneSupport;
  }

  // Bail on devices advertising very little memory rather than pushing a whole
  // scene onto them.
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (typeof memory === "number" && memory < 4) {
    sceneSupport = false;
    return sceneSupport;
  }

  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();

  sceneSupport = Boolean(gl);
  return sceneSupport;
}

type TheDiveProps = {
  copy: SwacCopy["dive"];
};

export function TheDive({ copy }: TheDiveProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lagoonCardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const canRender3D = useSyncExternalStore(
    subscribeToNothing,
    probeSceneSupport,
    // The server has no GPU to ask, so it always renders the SVG column.
    () => false,
  );
  const [depth, setDepth] = useState(0);
  const lagoonCardInView = useInView(lagoonCardRef);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // A spring on the raw progress is what gives the descent weight — it lags
  // the scrollbar slightly and overshoots when you stop.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.55,
    restDelta: 0.0005,
  });

  const velocity = useVelocity(progress);

  // Each step occupies one viewport of the track, so step i sits centred at
  // progress i/(n-1). Pinning the real stop depths to those points is what
  // makes the readout agree with the prose beside it — 40 m on screen when the
  // reef-wall card is centred, not whatever a linear ramp would have said.
  const stopProgress = useMemo(
    () =>
      copy.stops.map((_, index) =>
        copy.stops.length < 2 ? 0 : index / (copy.stops.length - 1),
      ),
    [copy.stops],
  );
  const stopDepths = useMemo(
    () => copy.stops.map((stop) => stop.depth),
    [copy.stops],
  );
  const depthValue = useTransform(progress, stopProgress, stopDepths);

  // Sample the motion value into React state only when the displayed number
  // would actually change, so the HUD is readable rather than a blur.
  useMotionValueEvent(depthValue, "change", (value) => {
    const next = Math.round(value / 5) * 5;
    setDepth((current) => (current === next ? current : next));
  });

  // The SVG fallback paints the same ramp the shader does, keyed off real
  // depth rather than scroll position.
  const waterTop = useTransform(
    depthValue,
    [0, 40, 200, 400, MAX_DIVE_DEPTH],
    ["#1fb6a6", "#12849a", "#0a3f66", "#04203f", "#01070e"],
  );
  const waterBottom = useTransform(
    depthValue,
    [0, 40, 200, 400, MAX_DIVE_DEPTH],
    ["#0d6f80", "#0a4f68", "#062a48", "#02121f", "#01050a"],
  );
  const fallbackBackground = useMotionTemplate`linear-gradient(180deg, ${waterTop} 0%, ${waterBottom} 100%)`;

  const temperature = temperatureAtDepth(depth);
  const pressure = pressureAtDepth(depth);
  const light = lightAtDepth(depth) * 100;
  const inThermocline = depth >= THERMOCLINE_TOP && depth <= THERMOCLINE_BASE;

  return (
    <section id="descent" className={styles.diveSection}>
      <header className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-24 text-center sm:px-6 lg:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
          {copy.eyebrow}
        </p>
        <h2 className="font-header text-5xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
          {copy.title}
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {copy.intro}
        </p>
      </header>

      <div ref={trackRef} className={styles.diveTrack}>
        <div className={styles.diveSticky}>
          {canRender3D && !prefersReducedMotion ? (
            <div className={styles.diveCanvas}>
              <DiveScene3D depth={depthValue} velocity={velocity} />
            </div>
          ) : (
            <motion.div
              className={styles.diveColumn}
              style={{ background: fallbackBackground }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 400 800"
                preserveAspectRatio="xMidYMid slice"
                className="size-full"
              >
                <g opacity="0.5">
                  {Array.from({ length: 16 }, (_, i) => (
                    <line
                      key={i}
                      x1="0"
                      x2="400"
                      y1={i * 50}
                      y2={i * 50 + 6}
                      stroke="rgba(233,240,236,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                </g>
                <rect
                  x="262"
                  y="0"
                  width="17"
                  height="800"
                  fill="rgba(10,26,34,0.85)"
                  rx="8"
                />
                <rect
                  x="262"
                  y="0"
                  width="4"
                  height="800"
                  fill="rgba(233,240,236,0.09)"
                />
              </svg>
            </motion.div>
          )}

          <div className={styles.diveVignette} aria-hidden="true" />

          <div className={styles.diveHud}>
            <div className="flex flex-col items-end gap-3">
              <motion.div
                animate={{ opacity: inThermocline ? 1 : 0, y: inThermocline ? 0 : -8 }}
                transition={{ duration: 0.4 }}
              >
                <Badge variant="secondary" className="gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <ThermometerSnowflakeIcon className="size-3" aria-hidden="true" />
                  {copy.thermoclineLabel}
                </Badge>
              </motion.div>

              <NumberFlowGroup>
                <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-background/45 p-4 backdrop-blur-md sm:p-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      {copy.depthLabel}
                    </span>
                    <span className={cn(styles.hudReadout, "font-header text-5xl leading-none text-foreground sm:text-6xl")}>
                      <NumberFlow value={depth} suffix=" m" />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-2 border-t border-border pt-3">
                    <Readout label={copy.temperatureLabel}>
                      <NumberFlow
                        value={temperature}
                        format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }}
                        suffix=" °C"
                      />
                    </Readout>
                    <Readout label={copy.pressureLabel}>
                      <NumberFlow
                        value={pressure}
                        format={{ maximumFractionDigits: 0 }}
                        suffix=" bar"
                      />
                    </Readout>
                    <Readout label={copy.lightLabel}>
                      <NumberFlow
                        value={light}
                        format={{ maximumFractionDigits: 2 }}
                        suffix=" %"
                      />
                    </Readout>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.thermoclineLabel}
                      </span>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          animate={{ opacity: inThermocline ? 1 : 0.25 }}
                          style={{
                            width: `${Math.min(100, (depth / THERMOCLINE_BASE) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </NumberFlowGroup>
            </div>

            {/* Bottom right: the step cards own the left half of the frame. */}
            <p
              aria-hidden={!lagoonCardInView}
              className={cn(
                "self-end text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-opacity duration-200 motion-reduce:transition-none",
                lagoonCardInView ? "opacity-100" : "opacity-0",
              )}
            >
              {copy.instructions}
            </p>
          </div>

        </div>

        <div className={styles.diveSteps}>
          {copy.stops.map((stop) => {
            const hasPassedThermocline =
              stop.id === "thermocline" &&
              depth >= THERMOCLINE_CARD_EXIT_DEPTH;

            return (
              <article key={stop.id} className={styles.diveStep}>
                <motion.div
                  ref={stop.id === "surface" ? lagoonCardRef : undefined}
                  className={styles.diveStepCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{
                    opacity: hasPassedThermocline ? 0 : 1,
                    y: hasPassedThermocline ? -30 : 0,
                  }}
                  viewport={{ once: false, margin: "-35% 0px -35%" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={hasPassedThermocline}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                      {stop.eyebrow}
                    </span>
                    <span className="h-px flex-1 bg-border" aria-hidden="true" />
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {stop.readout}
                    </Badge>
                  </div>
                  <h3 className="mt-5 font-display text-4xl leading-[1.02] text-foreground sm:text-5xl">
                    {stop.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8">
                    {stop.body}
                  </p>
                </motion.div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <h3 className="font-header text-4xl leading-[0.95] text-foreground sm:text-6xl">
          {copy.payoffTitle}
        </h3>
        <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
          {copy.payoffBody}
        </p>
      </div>

      <p className="sr-only">{copy.visualDescription}</p>
    </section>
  );
}

function Readout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className={cn(styles.hudReadout, "font-mono text-sm text-foreground")}>
        {children}
      </span>
    </div>
  );
}
