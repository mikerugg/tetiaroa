import type { SwacCopy } from "./swac-content";
import styles from "./swac.module.css";

type WhatIsSwacProps = {
  copy: SwacCopy["basics"];
};

/*
 * The thirty-second version. Deliberately static and deliberately simpler than
 * the interactive circuit further down the page: a reader who has just arrived
 * needs the shape of the idea, not a simulator.
 */
export function WhatIsSwac({ copy }: WhatIsSwacProps) {
  return (
    <section id="what-is-swac" className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
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

        <figure className={`${styles.basicsPanel} mt-14`}>
          <svg
            viewBox="0 0 1000 424"
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

            <rect width="1000" height="130" fill="url(#basics-sky)" />
            <rect y="130" width="1000" height="294" fill="url(#basics-water)" />

            {/* Sea surface */}
            <path
              d="M0 130 C 140 124, 250 136, 400 130 C 545 124, 650 136, 1000 130"
              fill="none"
              stroke="rgba(89, 232, 220, 0.5)"
              strokeWidth="1.75"
            />
            <text
              x="24"
              y="118"
              className="fill-[rgba(233,240,236,0.55)] font-mono text-[13px]"
            >
              {copy.seaLabel}
            </text>

            {/* The island flank, falling away to the left. */}
            <path
              d="M1000 424 L1000 78 L820 78 C 776 82, 740 100, 700 130 C 604 200, 452 300, 286 348 C 190 376, 96 392, 0 400 L0 424 Z"
              fill="url(#basics-rock)"
            />
            <path
              d="M820 78 C 776 82, 740 100, 700 130 C 604 200, 452 300, 286 348 C 190 376, 96 392, 0 400"
              fill="none"
              stroke="rgba(233, 240, 236, 0.34)"
              strokeWidth="1.75"
            />

            {/* Cold seawater in */}
            <path
              className={`${styles.flowPipe} ${styles.flowPipeReverse}`}
              d="M726 78 L726 126 C 660 172, 440 280, 196 336"
              stroke="var(--series-cold)"
              strokeWidth="4.5"
            />
            <circle cx="196" cy="336" r="12" fill="none" stroke="var(--series-cold)" strokeWidth="3" />
            <circle cx="196" cy="336" r="4" fill="var(--series-cold)" />

            {/* Warmed seawater out, returned at matched depth */}
            <path
              className={`${styles.flowPipe} ${styles.flowPipeSlow}`}
              d="M788 78 L788 136 C 724 178, 600 226, 470 254"
              stroke="var(--series-warm)"
              strokeWidth="4.5"
            />
            <g stroke="var(--series-warm)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M470 246 L450 240" />
              <path d="M470 254 L448 254" />
              <path d="M470 262 L450 268" />
            </g>

            {/* Closed chilled-water loop to the buildings */}
            <path
              className={styles.flowPipe}
              d="M808 42 L884 42"
              stroke="var(--series-cold)"
              strokeWidth="4"
              opacity="0.8"
            />
            <path
              className={`${styles.flowPipe} ${styles.flowPipeReverse}`}
              d="M884 62 L808 62"
              stroke="var(--series-cold)"
              strokeWidth="4"
              opacity="0.45"
            />

            {/* Plant, at the shoreline where it belongs */}
            <g>
              <rect
                x="712"
                y="26"
                width="94"
                height="52"
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
                  y1="36"
                  y2="68"
                  stroke={index % 2 === 0 ? "var(--series-cold)" : "var(--series-warm)"}
                  strokeWidth="2.5"
                  opacity="0.8"
                />
              ))}
            </g>

            {/* Buildings */}
            <g fill="rgba(233, 240, 236, 0.14)" stroke="rgba(233,240,236,0.34)" strokeWidth="1.25">
              <path d="M888 56 L914 28 L940 56 L940 78 L888 78 Z" />
              <path d="M934 62 L954 42 L974 62 L974 78 L934 78 Z" />
            </g>

            {/* Labels */}
            <g className="fill-[rgba(233,240,236,0.66)] font-mono text-[13px]">
              {/* Clear of the seabed line, which passes just above this. */}
              <text x="196" y="398" textAnchor="middle">
                {copy.depthLabel}
              </text>
              <text x="759" y="18" textAnchor="middle">
                {copy.plantLabel}
              </text>
              <text x="931" y="18" textAnchor="middle">
                {copy.buildingsLabel}
              </text>
            </g>

            {/* Flow key, sitting in the empty water */}
            <g className="font-mono text-[13px]">
              <circle cx="40" cy="192" r="5" fill="var(--series-cold)" />
              <text x="56" y="197" className="fill-[rgba(233,240,236,0.7)]">
                {copy.coldLabel}
              </text>
              <circle cx="40" cy="222" r="5" fill="var(--series-warm)" />
              <text x="56" y="227" className="fill-[rgba(233,240,236,0.7)]">
                {copy.warmLabel}
              </text>
              <circle cx="40" cy="252" r="5" fill="var(--series-cold)" opacity="0.6" />
              <text x="56" y="257" className="fill-[rgba(233,240,236,0.7)]">
                {copy.chilledLabel}
              </text>
            </g>

            {/* Step markers, keyed to the numbered list below */}
            {(
              [
                ["01", 150, 306],
                ["02", 759, 100],
                ["03", 846, 96],
                ["04", 470, 222],
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

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step) => (
            <li key={step.id} className="flex flex-col gap-3 bg-background p-6">
              <span className="font-header text-3xl leading-none text-primary/45">
                {step.number}
              </span>
              <h3 className="font-display text-2xl leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 flex flex-wrap items-baseline gap-4 border-t border-border pt-8">
          <span className="font-header text-6xl leading-none text-foreground sm:text-7xl">
            {copy.statValue}
          </span>
          <span className="max-w-md text-base leading-6 text-muted-foreground">
            {copy.statLabel}
          </span>
        </p>
      </div>
    </section>
  );
}
