"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import NumberFlow from "@number-flow/react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  calculateFeasibility,
  type FeasibilitySite,
  type SiteStatus,
  type SwacCopy,
} from "./swac-content";
import styles from "./swac.module.css";

/*
 * Status colours are three hues plus a fill-state. A fourth hue was tried and
 * dropped: every gold that sat inside the dark lightness band collapsed onto
 * the coral under deuteranopia (ΔE 0.2). "Candidate" is therefore a hollow
 * ring rather than a colour, which also happens to mean the right thing.
 */
const STATUS_STYLE: Record<
  SiteStatus,
  { colour: string; filled: boolean }
> = {
  operating: { colour: "var(--series-cold)", filled: true },
  freshwater: { colour: "var(--series-fresh)", filled: true },
  stalled: { colour: "var(--series-warm)", filled: true },
  candidate: { colour: "var(--muted-foreground)", filled: false },
};

type LandCollection = GeoPermissibleObjects;

type FeasibilityGlobeProps = {
  copy: SwacCopy["globe"];
};

export function FeasibilityGlobe({ copy }: FeasibilityGlobeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(stageRef, { once: true, margin: "220px" });

  const [land, setLand] = useState<LandCollection | null>(null);
  const [activeId, setActiveId] = useState(copy.sites[0]?.id ?? "");

  const rotation = useRef({ lambda: 150, phi: -12 });
  const spin = useRef({ lambda: 0, phi: 0 });
  const target = useRef<{ lambda: number; phi: number } | null>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const [distanceKm, setDistanceKm] = useState(4);
  const [demandKw, setDemandKw] = useState(2500);
  const [priceCents, setPriceCents] = useState(35);

  const feasibility = useMemo(
    () => calculateFeasibility(distanceKm, demandKw, priceCents / 100),
    [distanceKm, demandKw, priceCents],
  );
  const verdict = copy.verdicts[feasibility.verdict];

  const activeSite =
    copy.sites.find((site) => site.id === activeId) ?? copy.sites[0];

  const graticule = useMemo(() => geoGraticule10(), []);

  // The atlas is only worth fetching once the section is nearly on screen.
  useEffect(() => {
    if (!inView || land) {
      return;
    }
    let cancelled = false;
    fetch("/swac/world.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setLand(data as LandCollection);
        }
      })
      .catch(() => {
        // A globe without coastlines is still a usable list of sites.
      });
    return () => {
      cancelled = true;
    };
  }, [inView, land]);

  const flyTo = useCallback((site: FeasibilitySite) => {
    setActiveId(site.id);
    target.current = { lambda: -site.lon, phi: -site.lat };
  }, []);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let frame = 0;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const render = () => {
      frame = requestAnimationFrame(render);

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      if (size === 0) {
        return;
      }
      if (canvas.width !== size * ratio) {
        canvas.width = size * ratio;
        canvas.height = size * ratio;
      }

      const state = rotation.current;

      if (target.current) {
        // Ease toward the chosen site, taking the short way round.
        let delta = target.current.lambda - state.lambda;
        delta = ((delta + 180) % 360) - 180;
        state.lambda += delta * 0.09;
        state.phi += (target.current.phi - state.phi) * 0.09;
        if (Math.abs(delta) < 0.35) {
          state.lambda = target.current.lambda;
          state.phi = target.current.phi;
          target.current = null;
        }
      } else if (!dragging.current) {
        // Carry the throw, then drift.
        state.lambda += spin.current.lambda + 0.045;
        state.phi += spin.current.phi;
        spin.current.lambda *= 0.94;
        spin.current.phi *= 0.94;
      }

      state.phi = Math.max(-82, Math.min(82, state.phi));

      const projection = geoOrthographic()
        .translate([size / 2, size / 2])
        .scale(size / 2 - 6)
        .rotate([state.lambda, state.phi]);
      const path = geoPath(projection, context);

      context.save();
      context.scale(ratio, ratio);
      context.clearRect(0, 0, size, size);

      const gradient = context.createRadialGradient(
        size * 0.38,
        size * 0.32,
        size * 0.05,
        size * 0.5,
        size * 0.5,
        size * 0.55,
      );
      gradient.addColorStop(0, "rgba(31, 96, 112, 0.85)");
      gradient.addColorStop(1, "rgba(3, 16, 24, 0.96)");

      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = gradient;
      context.fill();

      context.beginPath();
      path(graticule);
      context.strokeStyle = "rgba(233, 240, 236, 0.07)";
      context.lineWidth = 0.6;
      context.stroke();

      if (land) {
        context.beginPath();
        path(land);
        context.fillStyle = "rgba(233, 240, 236, 0.13)";
        context.fill();
        context.strokeStyle = "rgba(233, 240, 236, 0.22)";
        context.lineWidth = 0.6;
        context.stroke();
      }

      context.beginPath();
      path({ type: "Sphere" });
      context.strokeStyle = "rgba(89, 232, 220, 0.28)";
      context.lineWidth = 1;
      context.stroke();

      const centre: [number, number] = [-state.lambda, -state.phi];
      const computed = getComputedStyle(document.documentElement);

      for (const site of copy.sites) {
        // Skip anything on the far side of the planet.
        if (geoDistance([site.lon, site.lat], centre) > Math.PI / 2) {
          continue;
        }
        const point = projection([site.lon, site.lat]);
        if (!point) {
          continue;
        }

        const style = STATUS_STYLE[site.status];
        const colour = computed
          .getPropertyValue(style.colour.replace("var(", "").replace(")", ""))
          .trim() || "#e9f0ec";
        const isActive = site.id === activeSite?.id;
        const radius = isActive ? 7 : 4.5;

        if (isActive) {
          context.beginPath();
          context.arc(point[0], point[1], radius + 5, 0, Math.PI * 2);
          context.strokeStyle = colour;
          context.globalAlpha = 0.45;
          context.lineWidth = 1.5;
          context.stroke();
          context.globalAlpha = 1;
        }

        context.beginPath();
        context.arc(point[0], point[1], radius, 0, Math.PI * 2);
        if (style.filled) {
          context.fillStyle = colour;
          context.fill();
          context.strokeStyle = "rgba(2, 9, 15, 0.9)";
          context.lineWidth = 1.5;
          context.stroke();
        } else {
          context.strokeStyle = colour;
          context.lineWidth = 2;
          context.stroke();
        }
      }

      context.restore();
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [inView, land, graticule, copy.sites, activeSite?.id]);

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

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-5">
            <div
              ref={stageRef}
              className={styles.globeStage}
              onPointerDown={(event) => {
                dragging.current = true;
                target.current = null;
                lastPointer.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!dragging.current) {
                  return;
                }
                const dx = event.clientX - lastPointer.current.x;
                const dy = event.clientY - lastPointer.current.y;
                lastPointer.current = { x: event.clientX, y: event.clientY };
                rotation.current.lambda += dx * 0.32;
                rotation.current.phi -= dy * 0.32;
                spin.current = { lambda: dx * 0.32, phi: -dy * 0.32 };
              }}
              onPointerUp={(event) => {
                dragging.current = false;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => {
                dragging.current = false;
              }}
            >
              <canvas
                ref={canvasRef}
                className={styles.globeCanvas}
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {(
                Object.keys(copy.statusLabels) as SiteStatus[]
              ).map((status) => (
                <span key={status} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      !STATUS_STYLE[status].filled && "border-2 bg-transparent",
                    )}
                    style={
                      STATUS_STYLE[status].filled
                        ? { background: STATUS_STYLE[status].colour }
                        : { borderColor: STATUS_STYLE[status].colour }
                    }
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.statusLabels[status]}
                  </span>
                </span>
              ))}
            </div>

            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {copy.instructions}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {activeSite && (
                <motion.div
                  key={activeSite.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="border border-border bg-card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            !STATUS_STYLE[activeSite.status].filled &&
                              "border-2 bg-transparent",
                          )}
                          style={
                            STATUS_STYLE[activeSite.status].filled
                              ? { background: STATUS_STYLE[activeSite.status].colour }
                              : { borderColor: STATUS_STYLE[activeSite.status].colour }
                          }
                          aria-hidden="true"
                        />
                        {copy.statusLabels[activeSite.status]} · {activeSite.region}
                      </CardDescription>
                      <CardTitle className="font-display text-4xl leading-none text-foreground">
                        {activeSite.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-base leading-7 text-muted-foreground">
                      {activeSite.note}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="flex flex-wrap gap-2"
              role="listbox"
              aria-label={copy.title}
            >
              {copy.sites.map((site) => {
                const isActive = site.id === activeSite?.id;
                return (
                  <button
                    key={site.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => flyTo(site)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        !STATUS_STYLE[site.status].filled && "border-2 bg-transparent",
                      )}
                      style={
                        STATUS_STYLE[site.status].filled
                          ? { background: STATUS_STYLE[site.status].colour }
                          : { borderColor: STATUS_STYLE[site.status].colour }
                      }
                      aria-hidden="true"
                    />
                    {site.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- the calculator */}

        <div className="mt-20 grid gap-10 border-t border-border pt-16 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <h3 className="font-header text-4xl leading-[0.92] text-foreground sm:text-5xl">
                {copy.calculatorTitle}
              </h3>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {copy.calculatorIntro}
              </p>
            </div>

            <CalculatorField
              label={copy.distanceLabel}
              value={`${distanceKm} km`}
            >
              <Slider
                min={1}
                max={150}
                step={1}
                value={[distanceKm]}
                onValueChange={([value]) => setDistanceKm(value ?? 1)}
                aria-label={copy.distanceLabel}
              />
            </CalculatorField>

            <CalculatorField label={copy.demandLabel} value={`${demandKw} kW`}>
              <Slider
                min={100}
                max={20000}
                step={100}
                value={[demandKw]}
                onValueChange={([value]) => setDemandKw(value ?? 100)}
                aria-label={copy.demandLabel}
              />
            </CalculatorField>

            <CalculatorField
              label={copy.priceLabel}
              value={`${(priceCents / 100).toFixed(2)} / kWh`}
            >
              <Slider
                min={5}
                max={80}
                step={1}
                value={[priceCents]}
                onValueChange={([value]) => setPriceCents(value ?? 5)}
                aria-label={copy.priceLabel}
              />
            </CalculatorField>
          </div>

          <div className="flex flex-col gap-5" aria-live="polite">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              <CalcStat
                label={copy.capitalLabel}
                value={feasibility.capitalCost / 1_000_000}
                fractionDigits={1}
                suffix=" M"
              />
              <CalcStat
                label={copy.savingsLabel}
                value={feasibility.annualSavings / 1_000_000}
                fractionDigits={2}
                suffix=" M"
              />
              <CalcStat
                label={copy.paybackLabel}
                value={
                  Number.isFinite(feasibility.paybackYears)
                    ? Math.min(feasibility.paybackYears, 999)
                    : 999
                }
                fractionDigits={1}
                suffix={` ${copy.yearsLabel}`}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={feasibility.verdict}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26 }}
              >
                <Card className="border border-border bg-card">
                  <CardHeader>
                    <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      {copy.paybackLabel}
                    </CardDescription>
                    <CardTitle className="font-display text-3xl leading-tight text-foreground">
                      {verdict.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-base leading-7 text-muted-foreground">
                    {verdict.body}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <p className="text-sm leading-6 text-muted-foreground">
              {copy.caveat}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorField({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-sm text-foreground">{value}</span>
      </div>
      {children}
    </div>
  );
}

function CalcStat({
  label,
  value,
  fractionDigits,
  suffix,
}: {
  label: string;
  value: number;
  fractionDigits: number;
  suffix: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-header text-3xl leading-none text-foreground sm:text-4xl">
        <NumberFlow
          value={value}
          format={{
            maximumFractionDigits: fractionDigits,
            minimumFractionDigits: fractionDigits,
          }}
          suffix={suffix}
        />
      </span>
    </div>
  );
}

export { STATUS_STYLE };
