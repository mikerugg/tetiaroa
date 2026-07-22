"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GeologyCopy } from "./geology-content";
import styles from "./geology.module.css";

type TahitiFlexureProps = {
  copy: GeologyCopy["flexure"];
  reconstructionLabel: string;
};

export function TahitiFlexure({ copy, reconstructionLabel }: TahitiFlexureProps) {
  const [loaded, setLoaded] = useState(true);

  return (
    <section className="bg-foreground px-4 py-24 text-background sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="h-auto border-background/20 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-background">
            {reconstructionLabel}
          </Badge>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-background/55">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-xl font-header text-5xl leading-[0.9] text-background sm:text-7xl lg:text-8xl">
            {copy.title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-background/70 sm:text-lg">
            {copy.intro}
          </p>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-background/55">
              {copy.controlLabel}
            </p>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              value={loaded ? "loaded" : "unloaded"}
              onValueChange={(value) => {
                if (value) {
                  setLoaded(value === "loaded");
                }
              }}
              aria-label={copy.controlLabel}
            >
              <ToggleGroupItem value="unloaded" className="border-background/20 text-background data-[state=on]:bg-background data-[state=on]:text-foreground">
                {copy.unloadedLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="loaded" className="border-background/20 text-background data-[state=on]:bg-background data-[state=on]:text-foreground">
                {copy.loadedLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <p className="max-w-xl text-sm leading-6 text-background/65" aria-live="polite">
            {loaded ? copy.descriptionLoaded : copy.descriptionUnloaded}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <figure className={styles.flexureFigure} data-loaded={loaded}>
            <svg
              viewBox="0 0 1000 600"
              role="img"
              aria-label={loaded ? copy.descriptionLoaded : copy.descriptionUnloaded}
            >
              <defs>
                <linearGradient id="flexure-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#74e7dd" />
                  <stop offset="1" stopColor="#0b6780" />
                </linearGradient>
                <linearGradient id="flexure-crust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e5c98f" />
                  <stop offset="1" stopColor="#8a6649" />
                </linearGradient>
                <filter id="flexure-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="11" />
                </filter>
              </defs>
              <rect width="1000" height="600" fill="#081b29" />
              <path d="M0 205 C220 196 425 210 600 204 C760 198 875 209 1000 201 L1000 380 L0 380 Z" fill="url(#flexure-water)" opacity="0.86" />
              <path className={styles.flexurePlate} d={loaded ? "M0 368 C135 350 250 392 405 430 C545 464 650 490 735 492 C835 496 905 390 1000 355 L1000 462 C915 488 860 552 750 575 C625 595 520 566 390 525 C250 470 130 451 0 454 Z" : "M0 375 C238 367 421 379 597 374 C760 370 888 378 1000 370 L1000 470 C790 476 611 468 430 473 C258 477 120 469 0 474 Z"} fill="url(#flexure-crust)" />
              <path className={styles.flexurePlateLine} d={loaded ? "M0 368 C135 350 250 392 405 430 C545 464 650 490 735 492 C835 496 905 390 1000 355" : "M0 375 C238 367 421 379 597 374 C760 370 888 378 1000 370"} />

              <g className={styles.tahitiLoad} opacity={loaded ? 1 : 0.18}>
                <ellipse cx="708" cy="459" rx="146" ry="30" fill="#020b12" opacity="0.44" filter="url(#flexure-shadow)" />
                <path d="M535 372 C572 349 610 305 650 240 C685 183 709 126 733 92 C760 142 779 196 811 249 C845 306 879 344 919 365 C842 383 777 393 708 393 C642 393 586 384 535 372 Z" fill="#2e3838" />
                <path d="M615 335 C649 294 678 248 705 196 C719 168 729 139 735 110" fill="none" stroke="#65726b" strokeWidth="7" />
              </g>

              <g className={styles.tetiaroaIsland}>
                <path d="M208 364 C233 352 255 326 275 287 C296 326 318 350 347 363 C300 371 254 372 208 364 Z" fill="#334742" />
                <path d="M190 355 C210 343 231 342 250 355 M303 355 C320 344 340 344 361 357" fill="none" stroke="#d6f0ac" strokeWidth="8" strokeLinecap="round" />
              </g>

              <g className={styles.flexureLabels}>
                <text className={styles.tetiaroaLabel} x="274" y="260" textAnchor="middle">{copy.tetiaroa}</text>
                <text x="733" y="72" textAnchor="middle">{copy.tahiti}</text>
                <text className={styles.moatLabel} x="475" y="425" textAnchor="middle">{copy.moat}</text>
                <text x="128" y="505">{copy.oceanicPlate}</text>
              </g>
              <g className={styles.loadArrow} opacity={loaded ? 1 : 0}>
                <path d="M733 264 V350" />
                <path d="m716 330 17 22 17-22" />
              </g>
            </svg>
          </figure>

          <Alert className="border-background/15 bg-background/5 text-background">
            <InfoIcon aria-hidden="true" />
            <AlertTitle className="font-mono text-[10px] uppercase tracking-[0.16em]">
              {copy.boundaryLabel}
            </AlertTitle>
            <AlertDescription className="text-background/65">
              {copy.caveat}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
}
