"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PillarMedia } from "./pillar-content";
import { PillarMediaFrame } from "./pillar-media-frame";

export type AtollScanZone = {
  label: string;
  coordinate: string;
  title: string;
  copy: string;
  details: [string, string, string];
  media: PillarMedia;
};

export function LivingAtollScan({ zones }: { zones: AtollScanZone[] }) {
  const [activeZone, setActiveZone] = useState(0);
  const zoneRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.scanIndex);
          setActiveZone(index);
        }
      },
      { rootMargin: "-30% 0px -35%", threshold: [0.15, 0.4, 0.7] },
    );

    zoneRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.72fr)] lg:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-24 h-[calc(100svh-8rem)] min-h-[620px] overflow-hidden rounded-md border border-border bg-popover">
          {zones.map((zone, index) => (
            <div
              key={zone.label}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                index === activeZone ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <PillarMediaFrame
                media={zone.media}
                className="absolute inset-0 rounded-none"
                showCaption={false}
                priority={index === 0}
              />
            </div>
          ))}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(143_201_201/.12)_1px,transparent_1px),linear-gradient(90deg,rgb(143_201_201/.12)_1px,transparent_1px)] bg-[size:72px_72px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-8 rounded-full border border-primary/40 [box-shadow:0_0_0_1px_rgb(7_16_14/.35),0_0_90px_rgb(143_201_201/.16)_inset]"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-background/55 p-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary backdrop-blur-md">
            <span>Atoll scan / {String(activeZone + 1).padStart(2, "0")}</span>
            <span>{zones[activeZone]?.coordinate}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgb(7_16_14/.92)_38%)] px-6 pb-6 pt-20">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {zones[activeZone]?.label}
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">
              {zones[activeZone]?.title}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {zones.map((zone, index) => (
                <div
                  key={zone.label}
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    index <= activeZone ? "bg-primary" : "bg-muted",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        {zones.map((zone, index) => (
          <article
            key={zone.label}
            ref={(node) => {
              zoneRefs.current[index] = node;
            }}
            data-scan-index={index}
            className="flex min-h-[72svh] flex-col justify-center border-b border-border py-16 last:border-b-0 lg:min-h-[78svh]"
          >
            <PillarMediaFrame
              media={zone.media}
              className="mb-8 min-h-72 lg:hidden"
              priority={index === 0}
            />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {zone.label}
                </p>
                <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {zone.coordinate}
                </p>
              </div>
              <span className="font-header text-6xl text-primary/25">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-8 text-balance font-display text-4xl leading-tight sm:text-5xl">
              {zone.title}
            </h3>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {zone.copy}
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {zone.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {detail}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
