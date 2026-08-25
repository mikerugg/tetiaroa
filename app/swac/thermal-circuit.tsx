"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame } from "motion/react";
import NumberFlow from "@number-flow/react";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  calculateCircuit,
  temperatureToRamp,
  type LoopNode,
  type SwacCopy,
} from "./swac-content";
import styles from "./swac.module.css";

/*
 * Temperature is a diverging encoding, so it gets two hues and a neutral
 * midpoint rather than a straight two-stop lerp — a direct teal-to-coral
 * interpolation passes through a muddy olive exactly where the reader is
 * looking hardest. These are the validated --series-* tokens from globals.css.
 */
const COLD = [22, 169, 156] as const;
const NEUTRAL = [217, 206, 175] as const;
const WARM = [226, 74, 43] as const;

function rampToColour(ramp: number, alpha = 1) {
  const t = Math.min(1, Math.max(0, ramp));
  const [from, to, local] =
    t < 0.5 ? [COLD, NEUTRAL, t / 0.5] : [NEUTRAL, WARM, (t - 0.5) / 0.5];
  const channels = from.map((value, i) =>
    Math.round(value + (to[i] - value) * local),
  );
  return `rgba(${channels.join(", ")}, ${alpha})`;
}

/** The four legs of the circuit, in draw order. */
const LEGS = [
  {
    id: "cold",
    d: "M18 356 C 76 320, 156 248, 282 192",
    particles: 7,
    direction: 1,
  },
  {
    id: "warm",
    d: "M348 196 C 520 240, 770 262, 992 344",
    particles: 7,
    direction: 1,
  },
  {
    id: "supply",
    d: "M320 144 C 404 114, 618 90, 736 94",
    particles: 6,
    direction: 1,
  },
  {
    id: "return",
    d: "M744 122 C 620 150, 430 166, 326 166",
    particles: 6,
    direction: 1,
  },
  {
    id: "tap",
    d: "M300 198 C 420 220, 604 232, 734 234",
    particles: 3,
    direction: 1,
  },
] as const;

type LegId = (typeof LEGS)[number]["id"];

type ThermalCircuitProps = {
  copy: SwacCopy["circuit"];
};

export function ThermalCircuit({ copy }: ThermalCircuitProps) {
  const [load, setLoad] = useState(0.55);
  const [activeId, setActiveId] = useState<LoopNode["id"] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathRefs = useRef<Partial<Record<LegId, SVGPathElement | null>>>({});
  const particleRefs = useRef<Partial<Record<LegId, Array<SVGCircleElement | null>>>>(
    {},
  );

  const circuit = useMemo(() => calculateCircuit(load), [load]);

  const legColours = useMemo(
    () => ({
      cold: rampToColour(temperatureToRamp(circuit.seawaterIn)),
      warm: rampToColour(temperatureToRamp(circuit.seawaterOut)),
      supply: rampToColour(temperatureToRamp(circuit.supplyTemp)),
      return: rampToColour(temperatureToRamp(circuit.returnTemp)),
      tap: rampToColour(temperatureToRamp(circuit.seawaterIn)),
    }),
    [circuit],
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Walk the particles along their paths by mutating the DOM directly. Doing
  // this in React state would re-render the whole circuit sixty times a second
  // for no benefit.
  useAnimationFrame((time) => {
    for (const leg of LEGS) {
      const path = pathRefs.current[leg.id];
      const circles = particleRefs.current[leg.id];
      if (!path || !circles) {
        continue;
      }

      const length = path.getTotalLength();
      if (length === 0) {
        continue;
      }

      const speed = 0.00006 + circuit.flowRate * 0.00013;

      circles.forEach((circle, index) => {
        if (!circle) {
          return;
        }
        const phase = (time * speed + index / leg.particles) % 1;
        const point = path.getPointAtLength(phase * length);
        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
      });
    }
  });

  const activeNode = copy.nodes.find((node) => node.id === activeId) ?? null;

  const selectNode = (node: LoopNode) => {
    setActiveId(node.id);
    if (isMobile) {
      setSheetOpen(true);
    }
  };

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

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.32fr_0.68fr] lg:items-start">
          <div className={styles.circuitPanel}>
            <div className="relative">
              <svg
                viewBox="0 0 1000 380"
                role="img"
                aria-label={copy.visualDescription}
                className={styles.circuitSvg}
              >
                <title>{copy.title}</title>
                <desc>{copy.visualDescription}</desc>

                <defs>
                  <radialGradient id="swac-plant-glow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#59e8dc" stopOpacity="0.24" />
                    <stop offset="1" stopColor="#59e8dc" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Sea and shore, so the diagram sits somewhere real. */}
                <path
                  d="M0 212 C 150 204, 280 218, 420 212 L 420 380 L 0 380 Z"
                  fill="rgba(9, 38, 52, 0.55)"
                />
                <path
                  d="M0 212 C 150 204, 280 218, 420 212"
                  stroke="rgba(89, 232, 220, 0.24)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="315" cy="170" r="140" fill="url(#swac-plant-glow)" />

                {/* Casings first, so the live pipes sit inside them. */}
                {LEGS.map((leg) => (
                  <path key={`casing-${leg.id}`} className={styles.circuitCasing} d={leg.d} />
                ))}

                {LEGS.map((leg) => (
                  <path
                    key={leg.id}
                    ref={(element) => {
                      pathRefs.current[leg.id] = element;
                    }}
                    className={styles.circuitPipe}
                    d={leg.d}
                    stroke={legColours[leg.id]}
                    strokeWidth={leg.id === "tap" ? 3 : 5}
                    strokeDasharray={leg.id === "tap" ? "10 8" : undefined}
                    opacity={0.85}
                  />
                ))}

                {LEGS.map((leg) =>
                  Array.from({ length: leg.particles }, (_, index) => (
                    <circle
                      key={`${leg.id}-${index}`}
                      ref={(element) => {
                        const list = particleRefs.current[leg.id] ?? [];
                        list[index] = element;
                        particleRefs.current[leg.id] = list;
                      }}
                      className={styles.circuitParticle}
                      r={leg.id === "tap" ? 3 : 4.5}
                      fill={legColours[leg.id]}
                    />
                  )),
                )}

                {/* The exchanger: the only place the two waters meet. */}
                <g>
                  <rect
                    x="282"
                    y="142"
                    width="66"
                    height="58"
                    rx="9"
                    fill="rgba(6, 26, 34, 0.95)"
                    stroke="rgba(89, 232, 220, 0.45)"
                    strokeWidth="1.5"
                  />
                  {Array.from({ length: 7 }, (_, index) => (
                    <line
                      key={index}
                      className={styles.exchangerPlate}
                      x1={290 + index * 8}
                      x2={290 + index * 8}
                      y1="150"
                      y2="192"
                      stroke={index % 2 === 0 ? legColours.cold : legColours.return}
                      strokeWidth="2.5"
                      opacity={0.5 + circuit.load * 0.4}
                    />
                  ))}
                </g>

                <g className="fill-[rgba(233,240,236,0.5)] font-mono text-[13px]">
                  <text x="62" y="372">{copy.seawaterInLabel}</text>
                  <text x="978" y="372" textAnchor="end">
                    {copy.seawaterOutLabel}
                  </text>
                  <text x="470" y="76">{copy.supplyLabel}</text>
                  <text x="470" y="194">{copy.returnLabel}</text>
                </g>

                {/* Buildings on the loop. */}
                <g fill="rgba(233, 240, 236, 0.14)" stroke="rgba(233,240,236,0.3)">
                  <path d="M688 94 L716 66 L744 94 L744 120 L688 120 Z" />
                  <path d="M752 102 L780 78 L808 102 L808 120 L752 120 Z" />
                </g>

                {/* Ecostation, on the deep line rather than the chilled loop. */}
                <g fill="rgba(89, 232, 220, 0.12)" stroke="rgba(89,232,220,0.42)">
                  <path d="M712 218 L740 198 L768 218 L768 250 L712 250 Z" />
                </g>
              </svg>

              {copy.nodes.map((node, index) => {
                const isActive = node.id === activeId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={cn(
                      styles.circuitNode,
                      "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-colors",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/45 bg-background/80 text-primary hover:border-primary",
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={() => selectNode(node)}
                    aria-pressed={isActive}
                    aria-label={node.label}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="circuit-node-ring"
                        className="absolute inset-[-6px] rounded-full border border-primary/70"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="font-mono text-[10px]" aria-hidden="true">
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-5 border-t border-border p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.loadLabel}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.loadHint}
                </span>
              </div>

              <Slider
                min={0}
                max={100}
                step={1}
                value={[Math.round(load * 100)]}
                onValueChange={([value]) => setLoad((value ?? 0) / 100)}
                aria-label={copy.loadLabel}
              />

              <ToggleGroup
                type="single"
                variant="outline"
                spacing={0}
                value={load <= 0.34 ? "low" : load >= 0.85 ? "high" : ""}
                onValueChange={(value) => {
                  if (value === "low") setLoad(0.15);
                  if (value === "high") setLoad(1);
                }}
                aria-label={copy.loadLabel}
                className="grid w-full grid-cols-2"
              >
                <ToggleGroupItem value="low" className="w-full min-w-0 font-mono text-xs">
                  {copy.lowLoad}
                </ToggleGroupItem>
                <ToggleGroupItem value="high" className="w-full min-w-0 font-mono text-xs">
                  {copy.highLoad}
                </ToggleGroupItem>
              </ToggleGroup>

              <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-border pt-5 sm:grid-cols-3">
                <TempReadout
                  label={copy.seawaterInLabel}
                  value={circuit.seawaterIn}
                  colour={legColours.cold}
                />
                <TempReadout
                  label={copy.supplyLabel}
                  value={circuit.supplyTemp}
                  colour={legColours.supply}
                />
                <TempReadout
                  label={copy.returnLabel}
                  value={circuit.returnTemp}
                  colour={legColours.return}
                />
                <TempReadout
                  label={copy.seawaterOutLabel}
                  value={circuit.seawaterOut}
                  colour={legColours.warm}
                />
                <TempReadout
                  label={copy.deltaLabel}
                  value={circuit.buildingDelta}
                  colour="rgba(233,240,236,0.72)"
                  suffix=" K"
                />
              </dl>
            </div>
          </div>

          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="border border-border bg-card">
                    <CardHeader>
                      <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                        {activeNode.spec}
                      </CardDescription>
                      <CardTitle className="font-display text-4xl leading-none text-foreground">
                        {activeNode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-base leading-7 text-muted-foreground">
                      {activeNode.body}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border border-dashed border-border bg-card/40">
                    <CardHeader>
                      <CardTitle className="font-display text-3xl leading-tight text-muted-foreground">
                        {copy.loadHint}
                      </CardTitle>
                      <CardDescription className="sr-only">
                        {copy.visualDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {copy.nodes.map((node) => (
                        <Badge
                          key={node.id}
                          variant="outline"
                          className="font-mono text-[10px]"
                        >
                          {node.label}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[80svh] rounded-t-2xl border-border bg-popover"
        >
          <SheetHeader>
            <SheetDescription className="font-mono text-[10px] uppercase tracking-[0.18em]">
              {activeNode?.spec}
            </SheetDescription>
            <SheetTitle className="font-display text-4xl leading-none">
              {activeNode?.title}
            </SheetTitle>
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-4 top-4"
                aria-label={copy.closeLabel}
              >
                <XIcon data-icon="inline-start" aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="overflow-y-auto px-4 pb-8">
            <p className="text-base leading-7 text-muted-foreground">
              {activeNode?.body}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function TempReadout({
  label,
  value,
  colour,
  suffix = " °C",
}: {
  label: string;
  value: number;
  colour: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="flex items-center gap-2 font-mono text-sm text-foreground">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: colour }}
          aria-hidden="true"
        />
        <NumberFlow
          value={value}
          format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }}
          suffix={suffix}
        />
      </dd>
    </div>
  );
}
