"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPinIcon, XIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { GeologyCopy, MapHotspot } from "./geology-content";
import styles from "./geology.module.css";

type ModernAtollMapProps = {
  copy: GeologyCopy["map"];
};

export function ModernAtollMap({ copy }: ModernAtollMapProps) {
  const [activeId, setActiveId] = useState<MapHotspot["id"]>("lagoon");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const activeHotspot =
    copy.hotspots.find((hotspot) => hotspot.id === activeId) ?? copy.hotspots[0];

  const selectHotspot = (hotspot: MapHotspot) => {
    setActiveId(hotspot.id);
    if (isMobile) {
      setSheetOpen(true);
    }
  };

  return (
    <section className="bg-foreground px-4 py-24 text-background sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <header className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-background/55">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-4xl font-header text-5xl leading-[0.9] text-background sm:text-7xl lg:text-8xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-background/68 sm:text-lg">
            {copy.intro}
          </p>
        </header>

        <div className="mt-14 grid gap-7 md:grid-cols-[1.28fr_0.72fr]">
          <div className={styles.mapStage}>
            <Image
              src="/geology/tetiaroa-map.webp"
              alt={copy.imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, 66vw"
              className={styles.mapImage}
            />
            <div className={styles.mapWash} aria-hidden="true" />
            <p className={styles.mapInstructions}>{copy.instructions}</p>
            {copy.hotspots.map((hotspot) => (
              <Button
                key={hotspot.id}
                type="button"
                variant={hotspot.id === activeId ? "default" : "outline"}
                size="icon"
                className={cn(styles.mapHotspot, "rounded-full")}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onClick={() => selectHotspot(hotspot)}
                aria-label={hotspot.label}
                aria-pressed={hotspot.id === activeId}
              >
                <MapPinIcon data-icon="inline-start" aria-hidden="true" />
              </Button>
            ))}
          </div>

          <Card className="hidden border-background/15 bg-background/5 text-background md:flex">
            <CardHeader>
              <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/55">
                {activeHotspot.evidenceLabel}
              </CardDescription>
              <CardTitle className="font-display text-4xl leading-none text-background lg:text-5xl">
                {activeHotspot.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-7">
              <p className="text-base leading-7 text-background/68">
                {activeHotspot.description}
              </p>
              <div className="flex flex-col gap-3 border-t border-background/15 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-background/55">
                  {copy.motuTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {copy.motu.map((motu) => (
                    <Badge key={motu} variant="outline" className="border-background/20 text-background">
                      {motu}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
              {activeHotspot.evidenceLabel}
            </SheetDescription>
            <SheetTitle className="font-display text-4xl leading-none">
              {activeHotspot.title}
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
          <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-8">
            <p className="text-base leading-7 text-muted-foreground">
              {activeHotspot.description}
            </p>
            <div className="flex flex-col gap-3 border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {copy.motuTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {copy.motu.map((motu) => (
                  <Badge key={motu} variant="outline">
                    {motu}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
