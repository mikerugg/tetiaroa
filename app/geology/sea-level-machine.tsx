"use client";

import { useState } from "react";
import { WavesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GeologyCopy } from "./geology-content";
import styles from "./geology.module.css";

type SeaLevelMachineProps = {
  copy: GeologyCopy["seaLevel"];
};

const waterLines = [180, 430, 300, 180] as const;

export function SeaLevelMachine({ copy }: SeaLevelMachineProps) {
  const presentIndex = copy.periods.length - 1;
  const [periodIndex, setPeriodIndex] = useState(presentIndex);
  const period = copy.periods[periodIndex] ?? copy.periods[presentIndex];
  const waterLine = waterLines[periodIndex] ?? waterLines[presentIndex];

  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <header className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
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

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-stretch">
          <div className={styles.seaLevelPanel} data-period={periodIndex}>
            <figure>
              <svg
                viewBox="0 0 1000 600"
                role="img"
                aria-label={copy.visualDescription}
                className={styles.seaLevelDiagram}
              >
                <title>{period.title}</title>
                <desc>{copy.visualDescription}</desc>
                <defs>
                  <linearGradient id="sea-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#102534" />
                    <stop offset="1" stopColor="#496d73" />
                  </linearGradient>
                  <linearGradient id="sea-water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4de3d4" stopOpacity="0.86" />
                    <stop offset="1" stopColor="#07344a" stopOpacity="0.96" />
                  </linearGradient>
                  <linearGradient id="sea-limestone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#eadcae" />
                    <stop offset="1" stopColor="#8b725b" />
                  </linearGradient>
                </defs>
                <rect width="1000" height="600" fill="url(#sea-sky)" />
                <path d="M0 433 C174 407 302 422 437 414 C606 403 745 416 1000 384 L1000 600 L0 600 Z" fill="#22272b" />

                <g className={styles.earlyLagoon} opacity={periodIndex === 0 ? 1 : 0}>
                  <path d="M65 430 L65 255 C90 205 120 180 165 178 C215 180 250 230 285 270 C345 330 655 330 715 270 C750 230 785 180 835 178 C880 180 910 205 935 255 L935 430 Z" fill="url(#sea-limestone)" />
                  <path d="M65 255 C90 205 120 180 165 178 C215 180 250 230 285 270 C345 330 655 330 715 270 C750 230 785 180 835 178 C880 180 910 205 935 255" className={styles.terrainEdge} />
                </g>

                <g className={styles.karstTerrain} opacity={periodIndex === 0 ? 0 : 1}>
                  <path d="M80 415 C95 330 112 238 148 205 C180 185 214 254 250 309 C292 361 344 381 392 359 C438 338 466 305 500 298 C534 305 562 338 608 359 C656 381 708 361 750 309 C786 254 820 185 852 205 C888 238 905 330 920 415 Z" fill="url(#sea-limestone)" />
                  <path d="M80 415 C95 330 112 238 148 205 C180 185 214 254 250 309 C292 361 344 381 392 359 C438 338 466 305 500 298 C534 305 562 338 608 359 C656 381 708 361 750 309 C786 254 820 185 852 205 C888 238 905 330 920 415" className={styles.terrainEdge} />
                </g>

                <g className={styles.modernSediment} opacity={periodIndex === 3 ? 1 : 0}>
                  <path d="M250 309 C292 361 344 381 392 359 C425 344 447 320 466 305 L470 318 C447 335 426 356 395 371 C344 394 288 373 244 320 Z" />
                  <path d="M530 318 L534 305 C553 320 575 344 608 359 C656 381 708 361 750 309 L756 320 C712 373 656 394 605 371 C574 356 553 335 530 318 Z" />
                </g>

                <g className={styles.karstVoids} opacity={periodIndex === 1 ? 1 : periodIndex === 2 ? 0.72 : periodIndex === 3 ? 0.3 : 0}>
                  <ellipse cx="304" cy="384" rx="26" ry="30" />
                  <ellipse cx="500" cy="366" rx="24" ry="34" />
                  <ellipse cx="696" cy="384" rx="26" ry="30" />
                  <path d="M336 368 C350 342 366 341 382 361 M618 361 C634 341 650 342 664 368" />
                </g>

                <rect
                  className={styles.seaWater}
                  x="0"
                  y={waterLine}
                  width="1000"
                  height={600 - waterLine}
                  fill="url(#sea-water)"
                />
                <path
                  className={styles.seaWaterLine}
                  d={`M0 ${waterLine} C155 ${waterLine - 8} 278 ${waterLine + 7} 420 ${waterLine} C566 ${waterLine - 8} 732 ${waterLine + 7} 1000 ${waterLine - 1}`}
                />

                <g className={styles.warmAtollMotu} opacity={periodIndex === 0 ? 1 : 0}>
                  <path d="M112 180 C128 162 148 155 170 158 C190 160 202 169 216 180 Z" />
                  <path d="M784 180 C798 169 810 160 830 158 C852 155 872 162 888 180 Z" />
                </g>

                <g className={styles.warmLagoonSediment} opacity={periodIndex === 0 ? 1 : 0}>
                  <path d="M285 270 C345 330 655 330 715 270" />
                </g>

                <g className={styles.returningCoral} opacity={periodIndex === 2 ? 1 : 0}>
                  <path d="M265 330 V309 M265 320 L253 310 M265 316 L277 304" />
                  <path d="M735 330 V309 M735 320 L723 304 M735 316 L747 310" />
                </g>

                <g className={styles.modernLagoon} opacity={periodIndex === 3 ? 1 : 0}>
                  <path className={styles.modernReefCap} d="M120 224 C130 195 142 180 160 180 C178 180 192 197 205 234 C185 209 170 202 154 204 C141 206 131 214 120 224 Z" />
                  <path className={styles.modernReefCap} d="M795 234 C808 197 822 180 840 180 C858 180 870 195 880 224 C869 214 859 206 846 204 C830 202 815 209 795 234 Z" />
                  <path className={styles.modernMotu} d="M112 180 C128 162 148 155 170 158 C190 160 202 169 216 180 Z" />
                  <path className={styles.modernMotu} d="M784 180 C798 169 810 160 830 158 C852 155 872 162 888 180 Z" />
                  <path d="M250 309 V278 M250 294 L234 278 M250 289 L267 270" />
                  <path d="M500 298 V269 M500 283 L485 268 M500 279 L516 260" />
                  <path d="M750 309 V278 M750 294 L734 278 M750 289 L767 270" />
                </g>

                <g className={styles.seaLabels}>
                  <text x="48" y={Math.max(waterLine + 34, 54)}>{copy.sea}</text>
                  <text x="720" y={periodIndex === 1 ? 398 : 444}>{copy.reef}</text>
                  <text x="350" y="334" opacity={periodIndex === 1 ? 1 : 0}>{copy.karst}</text>
                </g>
              </svg>
              <figcaption className="sr-only">{copy.visualDescription}</figcaption>
            </figure>

            <div className="flex flex-col gap-5 border-t border-border p-5 sm:p-7">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.controlLabel}
                </span>
                <Badge variant="secondary" className="h-auto max-w-full whitespace-normal py-1 font-mono text-[10px] sm:text-xs">
                  {period.value > 0 ? `+${period.value}` : period.value} m · {copy.metresLabel}
                </Badge>
              </div>
              <Slider
                min={0}
                max={copy.periods.length - 1}
                step={1}
                value={[periodIndex]}
                onValueChange={([value]) => setPeriodIndex(value ?? 0)}
                aria-label={copy.controlLabel}
              />
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={0}
                value={String(periodIndex)}
                onValueChange={(value) => {
                  if (value) {
                    setPeriodIndex(Number(value));
                  }
                }}
                aria-label={copy.controlLabel}
                className="grid w-full grid-cols-2 sm:grid-cols-4"
              >
                {copy.periods.map((item, index) => (
                  <ToggleGroupItem
                    key={item.short}
                    value={String(index)}
                    className="w-full min-w-0 font-mono text-xs"
                  >
                    {item.short}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <Card className="border border-border bg-card">
            <CardHeader>
              <WavesIcon className="mb-4 text-primary" aria-hidden="true" />
              <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                {period.date}
              </CardDescription>
              <CardTitle className="font-display text-4xl leading-none text-foreground sm:text-5xl">
                {period.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-7 text-muted-foreground" aria-live="polite">
              {period.body}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
