import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SwacCopy } from "./swac-content";
import styles from "./swac.module.css";

type WhatIsSwacProps = {
  copy: SwacCopy["basics"];
};

/*
 * The thirty-second version. Deliberately static: a reader who has just arrived
 * needs the shape of the idea at a glance.
 */
export function WhatIsSwac({ copy }: WhatIsSwacProps) {
  return (
    <section
      id="what-is-swac"
      className="bg-background px-4 pt-24 pb-0 sm:px-6 lg:px-10 lg:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {copy.eyebrow}
            </p>
            <h2 className="font-header text-5xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {copy.definition}
          </p>
        </header>

        <figure className={`${styles.basicsPanel} mt-10`}>
          <svg
            viewBox="0 0 1000 327"
            role="img"
            aria-label={copy.diagramLabel}
            className={styles.basicsSvg}
          >
            <title>{copy.title}</title>
            <desc>{copy.diagramLabel}</desc>

            <defs>
              <linearGradient id="basics-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#12657a" stopOpacity="0.5" />
                <stop offset="0.55" stopColor="#062b40" stopOpacity="0.85" />
                <stop offset="1" stopColor="#01121c" />
              </linearGradient>
              <linearGradient id="basics-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0a2230" />
                <stop offset="1" stopColor="#123a48" />
              </linearGradient>
              <linearGradient id="basics-rock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1d3a33" />
                <stop offset="1" stopColor="#0a1a1c" />
              </linearGradient>
            </defs>

            <rect width="1000" height="94" fill="url(#basics-sky)" />
            <rect y="94" width="1000" height="233" fill="url(#basics-water)" />

            {/* Sea surface */}
            <path
              d="M0 94 C 140 90, 250 98, 400 94 C 545 90, 650 98, 1000 94"
              fill="none"
              stroke="rgba(89, 232, 220, 0.5)"
              strokeWidth="1.75"
            />
            <text
              x="24"
              y="83"
              className="fill-[rgba(233,240,236,0.55)] font-mono text-[13px]"
            >
              {copy.seaLabel}
            </text>

            {/* The island flank, falling away to the left. */}
            <path
              d="M1000 327 L1000 58 L820 58 C 776 62, 740 75, 700 94 C 604 148, 452 226, 286 267 C 190 291, 96 304, 0 312 L0 327 Z"
              fill="url(#basics-rock)"
            />
            <path
              d="M820 58 C 776 62, 740 75, 700 94 C 604 148, 452 226, 286 267 C 190 291, 96 304, 0 312"
              fill="none"
              stroke="rgba(233, 240, 236, 0.34)"
              strokeWidth="1.75"
            />

            {/* Cold seawater in */}
            <path
              className={`${styles.flowPipe} ${styles.flowPipeReverse}`}
              d="M726 58 L726 82 C 650 110, 558 143, 470 163 C 356 194, 252 238, 196 260"
              stroke="var(--series-cold)"
              strokeWidth="4.5"
            />
            <circle cx="196" cy="260" r="12" fill="none" stroke="var(--series-cold)" strokeWidth="3" />
            <circle cx="196" cy="260" r="4" fill="var(--series-cold)" />

            {/* Warmed seawater out, returned to shallower water */}
            <path
              className={`${styles.flowPipe} ${styles.flowPipeSlow}`}
              d="M788 58 L788 100 C 724 132, 600 174, 470 194"
              stroke="var(--series-warm)"
              strokeWidth="4.5"
            />
            <g stroke="var(--series-warm)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M470 188 L450 182" />
              <path d="M470 194 L448 194" />
              <path d="M470 200 L450 206" />
            </g>

            {/* Closed freshwater usage loop to the buildings */}
            <path
              className={styles.flowPipe}
              d="M808 30 L884 30"
              stroke="var(--series-cold)"
              strokeWidth="4"
              opacity="0.8"
            />
            <path
              className={styles.flowPipe}
              d="M884 46 L808 46"
              stroke="var(--series-warm)"
              strokeWidth="4"
              opacity="0.65"
            />

            {/* Optional deep-water branch for the Ecostation wet lab */}
            <path
              className={`${styles.flowPipe} ${styles.flowPipeSlow}`}
              d="M806 54 C 818 65, 822 80, 834 100"
              stroke="var(--series-cold)"
              strokeWidth="3"
              opacity="0.55"
            />

            {/* Plant, at the shoreline where it belongs */}
            <g>
              <rect
                x="712"
                y="16"
                width="94"
                height="42"
                rx="7"
                fill="rgba(4, 26, 34, 0.96)"
                stroke="rgba(89, 232, 220, 0.55)"
                strokeWidth="1.5"
              />
              {Array.from({ length: 5 }, (_, index) => (
                <line
                  key={index}
                  x1={726 + index * 16}
                  x2={726 + index * 16}
                  y1="24"
                  y2="50"
                  stroke={index % 2 === 0 ? "var(--series-cold)" : "var(--series-warm)"}
                  strokeWidth="2.5"
                  opacity="0.8"
                />
              ))}
            </g>

            {/* Buildings */}
            <g fill="rgba(233, 240, 236, 0.14)" stroke="rgba(233,240,236,0.34)" strokeWidth="1.25">
              <path d="M888 42 L914 18 L940 42 L940 58 L888 58 Z" />
              <path d="M934 46 L954 30 L974 46 L974 58 L934 58 Z" />
            </g>

            {/* Ecostation wet lab, supplied by an optional deep-water branch */}
            <g fill="rgba(89, 232, 220, 0.1)" stroke="rgba(89,232,220,0.48)" strokeWidth="1.25">
              <path d="M824 100 L850 80 L876 100 L876 120 L824 120 Z" />
              <path d="M842 120 L842 106 L858 106 L858 120" fill="rgba(4,26,34,0.7)" />
              <path d="M832 110 H838 M862 110 H868" />
            </g>

            {/* Labels */}
            <g className="fill-[rgba(233,240,236,0.66)] font-mono text-[13px]">
              {/* Clear of the seabed line, which passes just above this. */}
              <text x="196" y="310" textAnchor="middle">
                {copy.depthLabel}
              </text>
              <text x="759" y="12" textAnchor="middle">
                {copy.plantLabel}
              </text>
              <text x="931" y="12" textAnchor="middle">
                {copy.buildingsLabel}
              </text>
              <text x="850" y="136" textAnchor="middle">
                <tspan x="850">{copy.wetLabOptionalLabel}</tspan>
                <tspan x="850" dy="14">
                  {copy.wetLabLabel}
                </tspan>
              </text>
            </g>

            {/* Flow key, sitting in the empty water */}
            <g className="font-mono text-[13px]">
              <circle cx="40" cy="142" r="5" fill="var(--series-cold)" />
              <text x="56" y="147" className="fill-[rgba(233,240,236,0.7)]">
                {copy.coldLabel}
              </text>
              <circle cx="40" cy="166" r="5" fill="var(--series-warm)" />
              <text x="56" y="171" className="fill-[rgba(233,240,236,0.7)]">
                {copy.warmLabel}
              </text>
              <circle cx="40" cy="190" r="5" fill="var(--series-cold)" opacity="0.6" />
              <text x="56" y="195" className="fill-[rgba(233,240,236,0.7)]">
                {copy.chilledLabel}
              </text>
              <circle cx="40" cy="214" r="5" fill="var(--series-warm)" opacity="0.65" />
              <text x="56" y="219" className="fill-[rgba(233,240,236,0.7)]">
                {copy.warmedFreshLabel}
              </text>
            </g>

            {/* Step markers, keyed to the numbered list below */}
            {(
              [
                ["01", 150, 236],
                ["02", 759, 76],
                ["03", 914, 76],
                ["04", 560, 158],
              ] as const
            ).map(([number, x, y]) => (
              <g key={number}>
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="rgba(4, 20, 28, 0.95)"
                  stroke="var(--series-cold)"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="fill-[var(--series-cold)] font-mono text-[13px]"
                >
                  {number}
                </text>
              </g>
            ))}
          </svg>
          <figcaption className="sr-only">{copy.diagramLabel}</figcaption>
        </figure>

        <ol className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step) => (
            <li key={step.id} className="flex flex-col gap-3 bg-background p-4">
              <span className="font-header text-3xl leading-none text-primary/45">
                {step.number}
              </span>
              <h3 className="font-display text-2xl leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-5 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className={`${styles.savingsBridgeFrame} mx-auto mt-12 max-w-4xl`}>
          <Card className={`${styles.savingsBridgeCard} gap-0 rounded-[2rem] py-0`}>
            <CardHeader className="justify-items-center gap-4 px-6 pt-8 pb-5 text-center sm:px-10 sm:pt-10">
              <div className="relative grid size-44 place-items-center sm:size-52">
                <span
                  className={`${styles.statOrbit} absolute inset-0 rounded-full border border-primary/20`}
                  aria-hidden="true"
                />
                <CardTitle className="relative flex flex-col items-center gap-1 text-center">
                  <span className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-primary">
                    {copy.statPrefix}
                  </span>
                  <span className="font-header text-8xl leading-none tracking-[-0.04em] text-foreground sm:text-9xl">
                    {copy.statValue}
                  </span>
                </CardTitle>
              </div>
              <CardDescription className="max-w-xl text-center">
                <span className="text-base leading-6 text-muted-foreground sm:text-lg">
                  {copy.statLabel}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6 sm:px-10">
              <div
                className="mx-auto grid max-w-md grid-cols-10 gap-2"
                aria-hidden="true"
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      styles.energyCell,
                      index === 0 ? styles.energyUsed : styles.energySaved,
                    )}
                  />
                ))}
              </div>
            </CardContent>

            <CardFooter className="justify-center border-t border-border/60 px-6 py-4">
              <div
                className="flex w-full max-w-sm items-center gap-3"
                aria-hidden="true"
              >
                <span className="size-2 rounded-full bg-[var(--series-warm)]" />
                <span className={styles.energyFlow} />
                <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
