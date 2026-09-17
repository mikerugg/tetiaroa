"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { BoxIcon, LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Spinner } from "@/components/ui/spinner";
import { honuCopy, honuParts } from "./honu-content";

const HonuModel = dynamic(() => import("./honu-model"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full items-center justify-center gap-3"
      role="status"
    >
      <Spinner />
      Loading Honu’s 3D model…
    </div>
  ),
});

export function HonuAnatomy() {
  const [selected, setSelected] = useState<string>(honuParts[0].id);
  const [view, setView] = useState("parts");
  const part = honuParts.find((item) => item.id === selected) ?? honuParts[0];
  const copy = honuCopy.anatomy;

  return (
    <section
      id="inside-honu"
      className="scroll-mt-36 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
      aria-labelledby="anatomy-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {copy.eyebrow}
            </p>
            <h2
              id="anatomy-title"
              className="mt-4 font-header text-6xl leading-none sm:text-7xl lg:text-8xl"
            >
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            {copy.body}
          </p>
        </div>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && setView(value)}
              variant="outline"
              aria-label="Vessel view"
              className="mb-5"
            >
              <ToggleGroupItem value="parts">Explore the parts</ToggleGroupItem>
              <ToggleGroupItem value="model">
                <BoxIcon aria-hidden="true" />
                Spin in 3D
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="relative rounded-3xl border border-border bg-[radial-gradient(ellipse_at_center,var(--secondary),transparent_70%)]">
              {view === "parts" ? (
                <div className="relative aspect-[1.28]">
                  <Image
                    src="/sub-render.webp"
                    alt="Honu’s dome, thrusters, robotic arms, and lights, with numbered markers"
                    fill
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    className="object-contain p-5 sm:p-8"
                  />
                  {honuParts.map((item) => (
                    <Button
                      key={item.id}
                      variant={item.id === selected ? "impact" : "outline"}
                      size="icon-lg"
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      aria-label={`Explore ${item.label.toLowerCase()}`}
                      aria-pressed={item.id === selected}
                      aria-controls="honu-part-detail"
                      onClick={() => setSelected(item.id)}
                    >
                      {item.number}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="h-[400px] sm:h-[490px]">
                  <HonuModel />
                </div>
              )}
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {view === "parts"
                ? copy.hint
                : "Drag to turn Honu. Zoom in for a closer look."}
            </p>
          </div>
          <div>
            <ToggleGroup
              type="single"
              value={selected}
              onValueChange={(value) => value && setSelected(value)}
              variant="outline"
              aria-label="Submersible parts"
              className="mb-7 flex-wrap"
            >
              {honuParts.map((item) => (
                <ToggleGroupItem
                  key={item.id}
                  value={item.id}
                  aria-label={`${item.number}: ${item.label}`}
                  aria-controls="honu-part-detail"
                >
                  {item.number}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div
              id="honu-part-detail"
              aria-live="polite"
              aria-atomic="true"
              className="min-h-[285px]"
            >
              <Badge variant="secondary">{part.label}</Badge>
              <h3 className="mt-4 max-w-sm font-header text-4xl leading-[1.05] sm:text-5xl">
                {part.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {part.body}
              </p>
              <p className="mt-6 flex gap-3 text-sm leading-6 text-primary">
                <LightbulbIcon
                  className="mt-1 size-4 shrink-0"
                  aria-hidden="true"
                />
                {part.question}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
