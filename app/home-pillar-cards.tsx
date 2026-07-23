"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  LayoutGridIcon,
  ListIcon,
  MicroscopeIcon,
  NetworkIcon,
  RouteIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Pillar } from "./home-copy";

type PillarLayout = "horizontal" | "vertical" | "storyline";

type HomePillarCardsProps = {
  copy: string;
  eyebrow: string;
  items: readonly Pillar[];
  layoutLabel: string;
  horizontalLabel: string;
  verticalLabel: string;
  storylineLabel: string;
  title: string;
};

const pillarIcons = [MicroscopeIcon, BookOpenIcon, NetworkIcon] as const;

export function HomePillarCards({
  copy,
  eyebrow,
  items,
  layoutLabel,
  horizontalLabel,
  verticalLabel,
  storylineLabel,
  title,
}: HomePillarCardsProps) {
  const [layout, setLayout] = useState<PillarLayout>("storyline");

  function handleLayoutChange(value: string) {
    if (
      value === "horizontal" ||
      value === "vertical" ||
      value === "storyline"
    ) {
      setLayout(value);
    }
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
        <p
          className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/72"
          id="pillar-layout-label"
        >
          {layoutLabel}
        </p>
        <ToggleGroup
          aria-labelledby="pillar-layout-label"
          className="grid w-full grid-cols-3 rounded-lg bg-card/65 p-1 backdrop-blur-md sm:flex sm:w-fit"
          onValueChange={handleLayoutChange}
          spacing={0}
          type="single"
          value={layout}
          variant="outline"
        >
          <ToggleGroupItem
            className="h-9 min-w-0 gap-2 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] sm:px-4 sm:tracking-[0.11em]"
            value="horizontal"
          >
            <LayoutGridIcon
              className="hidden sm:block"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {horizontalLabel}
          </ToggleGroupItem>
          <ToggleGroupItem
            className="h-9 min-w-0 gap-2 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] sm:px-4 sm:tracking-[0.11em]"
            value="vertical"
          >
            <ListIcon
              className="hidden sm:block"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {verticalLabel}
          </ToggleGroupItem>
          <ToggleGroupItem
            className="h-9 min-w-0 gap-2 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] sm:px-4 sm:tracking-[0.11em]"
            value="storyline"
          >
            <RouteIcon
              className="hidden sm:block"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {storylineLabel}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <header
        className={cn(
          "grid gap-7",
          layout === "storyline"
            ? "mx-auto max-w-5xl text-center"
            : "lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] lg:items-end",
        )}
      >
        <div
          className={cn(
            "flex max-w-3xl flex-col gap-5",
            layout === "storyline" && "mx-auto items-center",
          )}
        >
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h2 className="font-header text-5xl uppercase leading-[0.92] text-foreground sm:text-7xl lg:text-8xl">
            {title}
          </h2>
        </div>
        <p
          className={cn(
            "max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8",
            layout === "storyline" && "mx-auto",
          )}
        >
          {copy}
        </p>
      </header>

      {layout === "storyline" ? (
        <div
          className="relative flex flex-col gap-12 py-2 lg:gap-20 lg:py-6"
          data-pillar-layout={layout}
        >
          <div
            className="absolute bottom-0 left-[1.375rem] top-0 w-px bg-gradient-to-b from-primary via-border to-transparent lg:left-1/2"
            aria-hidden="true"
          />
          {items.map((pillar, index) => {
            const PillarIcon = pillarIcons[index] ?? NetworkIcon;

            return (
              <div className="relative" key={pillar.title}>
                <span
                  className="absolute left-0 top-6 flex size-11 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg lg:left-1/2 lg:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <PillarIcon className="size-4" />
                </span>
                <Link
                  aria-label={pillar.cta}
                  className={cn(
                    "group ml-16 block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/70 lg:ml-0 lg:w-[calc(50%-3.25rem)]",
                    index % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto",
                  )}
                  href={pillar.href}
                >
                  <Card className="h-full gap-0 overflow-hidden rounded-xl border border-border border-t-primary/55 bg-card/80 py-0 text-card-foreground shadow-2xl ring-0 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:border-primary/55 group-hover:shadow-[0_32px_90px_rgb(0_0_0_/_0.34)]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-background">
                      <Image
                        src={pillar.image}
                        alt={pillar.alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                        sizes="(max-width: 1023px) 100vw, 42vw"
                      />
                      <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(2_14_22/.04)_30%,rgb(2_14_22/.84)_100%)]"
                        aria-hidden="true"
                      />
                      <span className="absolute bottom-4 right-5 font-header text-7xl leading-none text-white/92">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardHeader className="gap-4 px-6 pt-7 sm:px-8">
                      <CardTitle>
                        <h3 className="font-header text-3xl uppercase leading-[0.94] text-foreground sm:text-4xl">
                          {pillar.title}
                        </h3>
                      </CardTitle>
                      <CardDescription className="text-base leading-7 text-foreground/76">
                        {pillar.copy}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-2 sm:px-8">
                      <ul className="flex flex-col">
                        {pillar.areas.map((area, areaIndex) => (
                          <li
                            key={area}
                            className="grid grid-cols-[2rem_1fr] gap-3 border-t border-border py-3 text-sm leading-5 text-foreground/82 first:border-t-0"
                          >
                            <span className="font-mono text-[10px] tracking-[0.16em] text-primary">
                              {String(areaIndex + 1).padStart(2, "0")}
                            </span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto border-t border-border px-6 py-5 sm:px-8">
                      <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                        {pillar.cta}
                        <ArrowUpRightIcon
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-5",
            layout === "horizontal" && "md:grid-cols-2 lg:grid-cols-3",
          )}
          data-pillar-layout={layout}
        >
          {items.map((pillar, index) => {
            const PillarIcon = pillarIcons[index] ?? NetworkIcon;

            return (
              <Link
                aria-label={pillar.cta}
                className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/70"
                href={pillar.href}
                key={pillar.title}
              >
                <Card
                  className={cn(
                    "h-full gap-0 overflow-hidden rounded-xl border border-border bg-card/80 py-0 text-card-foreground shadow-2xl ring-0 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:border-primary/55 group-hover:shadow-[0_32px_90px_rgb(0_0_0_/_0.34)]",
                    layout === "vertical" &&
                      "lg:grid lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] lg:grid-rows-[auto_1fr_auto]",
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden bg-background",
                      layout === "vertical" &&
                        "lg:row-span-3 lg:aspect-auto lg:min-h-[360px]",
                    )}
                  >
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      sizes={
                        layout === "vertical"
                          ? "(max-width: 1023px) 100vw, 42vw"
                          : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      }
                    />
                    <div
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgb(2_14_22/.08)_20%,rgb(2_14_22/.82)_100%)]"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
                      <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-background/65 text-primary backdrop-blur-md">
                        <PillarIcon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="mr-12 font-header text-5xl leading-none text-white/90 sm:mr-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <CardHeader
                    className={cn(
                      "gap-4 px-6 pt-7 sm:px-7",
                      layout === "vertical" &&
                        "lg:col-start-2 lg:px-9 lg:pt-9",
                    )}
                  >
                    <CardTitle>
                      <h3
                        className={cn(
                          "font-header text-3xl uppercase leading-[0.94] text-foreground",
                          layout === "vertical" && "lg:text-4xl",
                        )}
                      >
                        {pillar.title}
                      </h3>
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base leading-7 text-foreground/76">
                      {pillar.copy}
                    </CardDescription>
                  </CardHeader>

                  <CardContent
                    className={cn(
                      "px-6 pb-2 sm:px-7",
                      layout === "vertical" && "lg:col-start-2 lg:px-9",
                    )}
                  >
                    <ul className="flex flex-col">
                      {pillar.areas.map((area, areaIndex) => (
                        <li
                          key={area}
                          className="grid grid-cols-[2rem_1fr] gap-3 border-t border-border py-3 text-sm leading-5 text-foreground/82 first:border-t-0"
                        >
                          <span className="font-mono text-[10px] tracking-[0.16em] text-primary">
                            {String(areaIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter
                    className={cn(
                      "mt-auto border-t border-border px-6 py-5 sm:px-7",
                      layout === "vertical" && "lg:col-start-2 lg:px-9",
                    )}
                  >
                    <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                      {pillar.cta}
                      <ArrowUpRightIcon
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
