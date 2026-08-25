"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { FastForwardIcon, RotateCcwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CONVENTIONAL_COP,
  SWAC_COP,
  calculateLedger,
  type SwacCopy,
} from "./swac-content";
import styles from "./swac.module.css";

/** One real second of watching is two simulated hours of running. */
const TIME_SCALE = 2;
const MAX_LOAD_KW = 6000;
const MAX_DRUMS_DRAWN = 96;

type TheMeterProps = {
  copy: SwacCopy["meter"];
};

export function TheMeter({ copy }: TheMeterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [coolingKw, setCoolingKw] = useState(2500);
  const [showYear, setShowYear] = useState(false);

  const conventionalDigits = useRef<HTMLSpanElement>(null);
  const swacDigits = useRef<HTMLSpanElement>(null);
  const conventionalDisc = useRef<SVGGElement>(null);
  const swacDisc = useRef<SVGGElement>(null);
  const simulated = useRef({ hours: 0, conventionalAngle: 0, swacAngle: 0 });

  const ledger = useMemo(() => calculateLedger(coolingKw), [coolingKw]);
  const conventionalPower = coolingKw / CONVENTIONAL_COP;
  const swacPower = coolingKw / SWAC_COP;

  const formatter = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
    [],
  );

  // The live meters run outside React: sixty state updates a second would buy
  // nothing but dropped frames.
  useAnimationFrame((_, delta) => {
    if (showYear || prefersReducedMotion) {
      return;
    }

    const state = simulated.current;
    const seconds = Math.min(delta, 100) / 1000;
    state.hours += seconds * TIME_SCALE;

    if (conventionalDigits.current) {
      conventionalDigits.current.textContent = formatter.format(
        conventionalPower * state.hours,
      );
    }
    if (swacDigits.current) {
      swacDigits.current.textContent = formatter.format(swacPower * state.hours);
    }

    // Disc speed is the whole point: one spins about seven times faster.
    const reference = MAX_LOAD_KW / CONVENTIONAL_COP;
    state.conventionalAngle +=
      seconds * (conventionalPower / reference) * 900;
    state.swacAngle += seconds * (swacPower / reference) * 900;

    conventionalDisc.current?.setAttribute(
      "transform",
      `rotate(${state.conventionalAngle % 360} 40 40)`,
    );
    swacDisc.current?.setAttribute(
      "transform",
      `rotate(${state.swacAngle % 360} 40 40)`,
    );
  });

  const resetMeters = () => {
    simulated.current = { hours: 0, conventionalAngle: 0, swacAngle: 0 };
    if (conventionalDigits.current) conventionalDigits.current.textContent = "0";
    if (swacDigits.current) swacDigits.current.textContent = "0";
    setShowYear(false);
  };

  const drumsDrawn = Math.min(MAX_DRUMS_DRAWN, Math.round(ledger.drums));
  const drumsRemaining = Math.max(0, Math.round(ledger.drums) - drumsDrawn);

  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
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

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {copy.loadLabel}
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            spacing={0}
            value={
              copy.presets.find((preset) => preset.kw === coolingKw)?.id ?? ""
            }
            onValueChange={(value) => {
              const preset = copy.presets.find((item) => item.id === value);
              if (preset) {
                setCoolingKw(preset.kw);
                resetMeters();
              }
            }}
            aria-label={copy.loadLabel}
            className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4"
          >
            {copy.presets.map((preset) => (
              <ToggleGroupItem
                key={preset.id}
                value={preset.id}
                className="w-full min-w-0 font-mono text-xs"
              >
                {preset.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Slider
            min={10}
            max={MAX_LOAD_KW}
            step={10}
            value={[coolingKw]}
            onValueChange={([value]) => {
              setCoolingKw(value ?? 10);
              resetMeters();
            }}
            aria-label={copy.loadLabel}
            className="flex-1"
          />
          <span className="min-w-24 text-right font-mono text-sm text-foreground">
            <NumberFlow value={coolingKw} suffix=" kW" />
          </span>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <MeterCard
            label={copy.conventionalLabel}
            colour="var(--series-warm)"
            power={conventionalPower}
            digitsRef={conventionalDigits}
            discRef={conventionalDisc}
            kwhLabel={copy.kwhLabel}
            liveLabel={copy.liveLabel}
            annual={ledger.conventionalKwh}
            showYear={showYear}
            annualLabel={copy.annualLabel}
            formatter={formatter}
            reduced={Boolean(prefersReducedMotion)}
          />
          <MeterCard
            label={copy.swacLabel}
            colour="var(--series-cold)"
            power={swacPower}
            digitsRef={swacDigits}
            discRef={swacDisc}
            kwhLabel={copy.kwhLabel}
            liveLabel={copy.liveLabel}
            annual={ledger.swacKwh}
            showYear={showYear}
            annualLabel={copy.annualLabel}
            formatter={formatter}
            reduced={Boolean(prefersReducedMotion)}
          />
        </div>

        {/* Two bars, one scale, a 2px surface gap between them. */}
        <div className="mt-8 flex flex-col gap-2">
          <ComparisonBar
            label={copy.conventionalLabel}
            colour="var(--series-warm)"
            value={ledger.conventionalKwh}
            max={ledger.conventionalKwh}
            formatter={formatter}
            unit={copy.kwhLabel}
          />
          <ComparisonBar
            label={copy.swacLabel}
            colour="var(--series-cold)"
            value={ledger.swacKwh}
            max={ledger.conventionalKwh}
            formatter={formatter}
            unit={copy.kwhLabel}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="impact"
            size="lg"
            className="h-auto rounded-full px-5 py-3"
            onClick={() => setShowYear(true)}
            disabled={showYear}
          >
            <FastForwardIcon data-icon="inline-start" aria-hidden="true" />
            {copy.raceLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-auto rounded-full px-5 py-3"
            onClick={resetMeters}
          >
            <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
            {copy.resetLabel}
          </Button>
        </div>

        <AnimatePresence>
          {showYear && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <NumberFlowGroup>
                <div
                  className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
                  aria-live="polite"
                >
                  <StatTile
                    label={copy.reductionLabel}
                    value={ledger.reductionPercent}
                    suffix=" %"
                    fractionDigits={0}
                  />
                  <StatTile
                    label={copy.dieselLabel}
                    value={ledger.litresDiesel}
                    suffix=" L"
                    fractionDigits={0}
                  />
                  <StatTile
                    label={copy.drumsLabel}
                    value={ledger.drums}
                    fractionDigits={0}
                  />
                  <StatTile
                    label={copy.co2Label}
                    value={ledger.tonnesCo2}
                    suffix=" t"
                    fractionDigits={1}
                  />
                </div>
              </NumberFlowGroup>

              <div className="mt-6 flex flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {copy.drumsLabel}
                </p>
                <div className={styles.drumGrid} aria-hidden="true">
                  {Array.from({ length: drumsDrawn }, (_, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: Math.min(index * 0.012, 1.1),
                        duration: 0.3,
                      }}
                      className="block h-4 rounded-[2px]"
                      style={{ background: "var(--series-warm)" }}
                    />
                  ))}
                </div>
                {drumsRemaining > 0 && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    + {formatter.format(drumsRemaining)}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <details className="mt-10 border-t border-border pt-5">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy.annualLabel} · {copy.kwhLabel}
          </summary>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em]">
                  {copy.loadLabel}
                </th>
                <th scope="col" className="py-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em]">
                  {copy.conventionalLabel}
                </th>
                <th scope="col" className="py-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em]">
                  {copy.swacLabel}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-foreground">
              {copy.presets.map((preset) => {
                const row = calculateLedger(preset.kw);
                return (
                  <tr key={preset.id} className="border-b border-border/60">
                    <th scope="row" className="py-2 font-normal">
                      {preset.label}
                    </th>
                    <td className="py-2">
                      {formatter.format(row.conventionalKwh)}
                    </td>
                    <td className="py-2">{formatter.format(row.swacKwh)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </details>

        <p className="mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">
          {copy.caveat}
        </p>
      </div>
    </section>
  );
}

function MeterCard({
  label,
  colour,
  power,
  digitsRef,
  discRef,
  kwhLabel,
  liveLabel,
  annual,
  showYear,
  annualLabel,
  formatter,
  reduced,
}: {
  label: string;
  colour: string;
  power: number;
  digitsRef: React.RefObject<HTMLSpanElement | null>;
  discRef: React.RefObject<SVGGElement | null>;
  kwhLabel: string;
  liveLabel: string;
  annual: number;
  showYear: boolean;
  annualLabel: string;
  formatter: Intl.NumberFormat;
  reduced: boolean;
}) {
  return (
    <div className={styles.meterPanel}>
      <div className="flex items-start justify-between gap-4 p-5 sm:p-7">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: colour }}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </span>
          </span>
          <span className="font-mono text-sm text-foreground">
            <NumberFlow
              value={Math.round(power)}
              suffix=" kW"
            />
          </span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          {showYear ? annualLabel : liveLabel}
        </Badge>
      </div>

      <div className="flex items-center gap-5 px-5 pb-6 sm:px-7">
        {/* A kilowatt-hour meter's spinning disc. Speed is the whole message. */}
        <svg viewBox="0 0 80 80" className="size-16 shrink-0" aria-hidden="true">
          <circle cx="40" cy="40" r="35" fill="rgba(233,240,236,0.04)" />
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <g ref={discRef}>
            <path
              d="M40 40 L40 7 A33 33 0 0 1 62 15 Z"
              fill={reduced ? "var(--border)" : colour}
              opacity="0.22"
            />
            <rect
              x="37.5"
              y="6"
              width="5"
              height="34"
              rx="2.5"
              fill={reduced ? "var(--border)" : colour}
            />
          </g>
          <circle cx="40" cy="40" r="5" fill="var(--background)" />
          <circle
            cx="40"
            cy="40"
            r="5"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
          />
        </svg>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {kwhLabel}
          </span>
          {showYear ? (
            <span className={`${styles.meterDigits} font-header text-4xl leading-none text-foreground sm:text-5xl`}>
              <NumberFlow value={Math.round(annual)} />
            </span>
          ) : (
            <span
              ref={digitsRef}
              className={`${styles.meterDigits} font-header text-4xl leading-none text-foreground sm:text-5xl`}
            >
              {reduced ? formatter.format(annual) : "0"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  colour,
  value,
  max,
  formatter,
  unit,
}: {
  label: string;
  colour: string;
  value: number;
  max: number;
  formatter: Intl.NumberFormat;
  unit: string;
}) {
  const width = max <= 0 ? 0 : (value / max) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="w-40 shrink-0 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div className="h-3 flex-1 overflow-hidden rounded-[4px] bg-muted">
        <motion.div
          className="h-full rounded-[4px]"
          style={{ background: colour }}
          animate={{ width: `${width}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </div>
      <span className="w-32 shrink-0 text-right font-mono text-xs text-foreground">
        {formatter.format(value)} {unit}
      </span>
    </div>
  );
}

function StatTile({
  label,
  value,
  suffix,
  fractionDigits,
}: {
  label: string;
  value: number;
  suffix?: string;
  fractionDigits: number;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-5 sm:p-6">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-header text-4xl leading-none text-foreground sm:text-5xl">
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
