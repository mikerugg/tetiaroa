"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
} from "motion/react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { FastForwardIcon, RotateCcwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  CONVENTIONAL_COP,
  SWAC_COP,
  calculateLedger,
  type SwacCopy,
  type SwacLocale,
} from "./swac-content";
import styles from "./swac.module.css";

/** One real second of watching is two simulated hours of running. */
const TIME_SCALE = 2;
const MAX_LOAD_KW = 6000;
const MAX_DRUMS_DRAWN = 96;
const METER_TICKS = Array.from({ length: 24 }, (_, index) => index);

type TheMeterProps = {
  copy: SwacCopy["meter"];
  locale: SwacLocale;
};

export function TheMeter({ copy, locale }: TheMeterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [coolingKw, setCoolingKw] = useState(2500);
  const [showYear, setShowYear] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const conventionalDigits = useRef<HTMLSpanElement>(null);
  const swacDigits = useRef<HTMLSpanElement>(null);
  const conventionalDisc = useRef<SVGGElement>(null);
  const swacDisc = useRef<SVGGElement>(null);
  const simulated = useRef({ hours: 0, conventionalAngle: 0, swacAngle: 0 });

  const ledger = useMemo(() => calculateLedger(coolingKw), [coolingKw]);
  const conventionalPower = coolingKw / CONVENTIONAL_COP;
  const swacPower = coolingKw / SWAC_COP;
  const displayAnnual = showYear || Boolean(prefersReducedMotion);
  const numberLocale = locale === "fr" ? "fr-FR" : "en-US";

  const formatter = useMemo(
    () => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }),
    [numberLocale],
  );

  // The live meters run outside React: sixty state updates a second would buy
  // nothing but dropped frames.
  useAnimationFrame((_, delta) => {
    if (showYear || prefersReducedMotion || !isInView || document.hidden) {
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
    <section
      ref={sectionRef}
      aria-labelledby="meter-title"
      className={`${styles.meterSection} px-4 py-24 sm:px-6 lg:px-10 lg:py-32`}
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="relative mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
          <span className={styles.meterHeaderNode} aria-hidden="true" />
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {copy.eyebrow}
          </p>
          <h2
            id="meter-title"
            className="max-w-4xl font-header text-5xl leading-[0.86] text-foreground sm:text-7xl lg:text-8xl"
          >
            {copy.title}
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {copy.intro}
          </p>
        </header>

        <div className={`${styles.meterConsole} mx-auto mt-12 max-w-6xl`}>
          <div
            className={cn(
              styles.meterGraphic,
              showYear && styles.meterGraphicAnnual,
            )}
          >
            <div
              className={`${styles.meterControls} relative border-b border-border/70 p-4 sm:p-5`}
            >
              <span className={styles.loadJunction} aria-hidden="true" />
              <div
                className={`${styles.meterControlGrid} grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end`}
              >
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.loadLabel}
                    </span>
                    <span className="font-header text-3xl leading-none text-foreground sm:text-4xl">
                      <NumberFlow
                        value={coolingKw}
                        locales={numberLocale}
                        suffix=" kW"
                      />
                    </span>
                  </div>
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
                  />
                </div>

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
                  className={`${styles.meterPresets} grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto`}
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
            </div>

            <p className="sr-only">
              {copy.conventionalLabel}: {formatter.format(Math.round(conventionalPower))} kW. {copy.swacLabel}: {formatter.format(Math.round(swacPower))} kW.
            </p>

            <div
              className={cn(
                styles.raceStage,
                showYear && styles.raceStageAnnual,
                "relative grid min-h-0 grid-cols-2",
              )}
            >
              <span className={styles.raceFork} aria-hidden="true" />
              <MeterGauge
                tone="warm"
                label={copy.conventionalLabel}
                colour="var(--series-warm)"
                power={conventionalPower}
                digitsRef={conventionalDigits}
                discRef={conventionalDisc}
                kwhLabel={copy.kwhLabel}
                liveLabel={copy.liveLabel}
                annual={ledger.conventionalKwh}
                displayAnnual={displayAnnual}
                annualLabel={copy.annualLabel}
                reduced={Boolean(prefersReducedMotion)}
                numberLocale={numberLocale}
              />
              <MeterGauge
                tone="cold"
                label={copy.swacLabel}
                colour="var(--series-cold)"
                power={swacPower}
                digitsRef={swacDigits}
                discRef={swacDisc}
                kwhLabel={copy.kwhLabel}
                liveLabel={copy.liveLabel}
                annual={ledger.swacKwh}
                displayAnnual={displayAnnual}
                annualLabel={copy.annualLabel}
                reduced={Boolean(prefersReducedMotion)}
                numberLocale={numberLocale}
              />

              {showYear && (
                <motion.div
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 12 }
                  }
                  animate={
                    prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  }
                  className={`${styles.impactTray} col-span-2 grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-t border-border/70`}
                  aria-live="polite"
                >
                  <NumberFlowGroup>
                    <div
                      className={`${styles.impactStats} grid grid-cols-2 gap-px bg-border/70 lg:grid-cols-4`}
                    >
                      <StatTile
                        label={copy.reductionLabel}
                        value={ledger.reductionPercent}
                        suffix=" %"
                        fractionDigits={0}
                        numberLocale={numberLocale}
                      />
                      <StatTile
                        label={copy.dieselLabel}
                        value={ledger.litresDiesel}
                        suffix=" L"
                        fractionDigits={0}
                        numberLocale={numberLocale}
                      />
                      <StatTile
                        label={copy.drumsLabel}
                        value={ledger.drums}
                        fractionDigits={0}
                        numberLocale={numberLocale}
                      />
                      <StatTile
                        label={copy.co2Label}
                        value={ledger.tonnesCo2}
                        suffix=" t"
                        fractionDigits={1}
                        numberLocale={numberLocale}
                      />
                    </div>
                  </NumberFlowGroup>

                  <div
                    className={`${styles.impactDrums} flex min-h-0 flex-col justify-center gap-2 p-3 sm:p-4`}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.drumsLabel}
                    </p>
                    <div className={styles.drumGrid} aria-hidden="true">
                      {Array.from({ length: drumsDrawn }, (_, index) => (
                        <motion.span
                          key={index}
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, scale: 0.4 }
                          }
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : { opacity: 1, scale: 1 }
                          }
                          transition={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  delay: Math.min(index * 0.012, 1.1),
                                  duration: 0.3,
                                }
                          }
                          className={`${styles.drumCell} block rounded-[2px]`}
                          style={{ background: "var(--series-warm)" }}
                        />
                      ))}
                    </div>
                    {drumsRemaining > 0 && (
                      <p className="font-mono text-[10px] text-muted-foreground">
                        + {formatter.format(drumsRemaining)}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div
              className={`${styles.meterActions} flex flex-wrap items-center justify-center gap-3 border-t border-border/70 p-4`}
            >
              <Button
                type="button"
                variant="impact"
                size="lg"
                className={`${styles.meterAction} h-auto rounded-full px-5 py-3`}
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
                className={`${styles.meterAction} h-auto rounded-full px-5 py-3`}
                onClick={resetMeters}
              >
                <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
                {copy.resetLabel}
              </Button>
            </div>
          </div>
        </div>

        <details className="mx-auto mt-10 max-w-6xl border-t border-border pt-5">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {copy.annualLabel} · {copy.kwhLabel}
          </summary>
          <div className="overflow-x-auto">
            <table className="mt-4 min-w-[36rem] w-full text-left text-sm">
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
          </div>
        </details>

        <p className="mx-auto mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">
          {copy.caveat}
        </p>
      </div>
    </section>
  );
}

function MeterGauge({
  tone,
  label,
  colour,
  power,
  digitsRef,
  discRef,
  kwhLabel,
  liveLabel,
  annual,
  displayAnnual,
  annualLabel,
  reduced,
  numberLocale,
}: {
  tone: "warm" | "cold";
  label: string;
  colour: string;
  power: number;
  digitsRef: React.RefObject<HTMLSpanElement | null>;
  discRef: React.RefObject<SVGGElement | null>;
  kwhLabel: string;
  liveLabel: string;
  annual: number;
  displayAnnual: boolean;
  annualLabel: string;
  reduced: boolean;
  numberLocale: string;
}) {
  return (
    <article
      className={cn(
        styles.raceLane,
        tone === "warm" ? styles.raceLaneWarm : styles.raceLaneCold,
        "flex min-w-0 flex-col p-3 sm:p-5 lg:p-6",
      )}
    >
      <header
        className={`${styles.raceHeader} flex min-h-14 flex-col items-center justify-between gap-2 text-center sm:min-h-0 sm:flex-row sm:text-left`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: colour }}
            aria-hidden="true"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px] sm:tracking-[0.18em]">
            {label}
          </span>
        </span>
        <Badge variant="outline" className="font-mono text-[10px]">
          {displayAnnual ? annualLabel : liveLabel}
        </Badge>
      </header>

      <div
        className={`${styles.gaugeShell} relative mx-auto mt-3 grid size-[min(38vw,20vh)] place-items-center sm:mt-4 sm:size-[min(13rem,24vh)] lg:size-[min(14rem,24vh)]`}
      >
        <svg
          viewBox="0 0 80 80"
          className={`${styles.meterDial} absolute inset-0 size-full`}
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="37" fill="var(--background)" fillOpacity="0.38" />
          <circle
            cx="40"
            cy="40"
            r="37"
            fill="none"
            stroke={colour}
            strokeOpacity="0.28"
            strokeWidth="0.8"
          />
          {METER_TICKS.map((index) => (
            <line
              key={index}
              x1="40"
              y1="3"
              x2="40"
              y2={index % 3 === 0 ? "7" : "5.5"}
              stroke={index % 3 === 0 ? colour : "var(--border)"}
              strokeWidth={index % 3 === 0 ? "1.2" : "0.7"}
              opacity={index % 3 === 0 ? "0.72" : "0.55"}
              transform={`rotate(${index * 15} 40 40)`}
            />
          ))}
          <g ref={discRef}>
            <path
              d="M40 40 L40 6 A34 34 0 0 1 64 16 Z"
              fill={colour}
              opacity={reduced ? "0.08" : "0.2"}
            />
            <rect
              x="38.6"
              y="5"
              width="2.8"
              height="35"
              rx="1.4"
              fill={colour}
            />
          </g>
        </svg>

        <div className={`${styles.meterCore} relative flex size-[58%] min-w-0 flex-col items-center justify-center gap-1 rounded-full border border-border/70 text-center`}>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {kwhLabel}
          </span>
          {displayAnnual ? (
            <span
              className={`${styles.meterDigits} ${styles.meterDigitsAnnual} max-w-full font-header leading-none text-foreground`}
            >
              <NumberFlow
                value={Math.round(annual)}
                locales={numberLocale}
              />
            </span>
          ) : (
            <span
              ref={digitsRef}
              aria-label={`${label} ${kwhLabel}`}
              className={`${styles.meterDigits} max-w-full font-header text-[clamp(1.35rem,3vw,3rem)] leading-none text-foreground`}
            >
              0
            </span>
          )}
        </div>
      </div>

      <p
        className={`${styles.meterPower} mt-3 text-center font-mono text-xs text-foreground sm:mt-4 sm:text-sm`}
      >
        <NumberFlow
          value={Math.round(power)}
          locales={numberLocale}
          suffix=" kW"
        />
      </p>
    </article>
  );
}

function StatTile({
  label,
  value,
  suffix,
  fractionDigits,
  numberLocale,
}: {
  label: string;
  value: number;
  suffix?: string;
  fractionDigits: number;
  numberLocale: string;
}) {
  return (
    <div
      className={`${styles.statTile} flex min-w-0 flex-col gap-2 bg-background p-3 sm:p-4`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`${styles.statValue} min-w-0 font-header text-[clamp(1.35rem,4.5vw,3rem)] leading-none text-foreground`}
      >
        <NumberFlow
          value={value}
          locales={numberLocale}
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
