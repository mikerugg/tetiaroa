import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  MicroscopeIcon,
  NetworkIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Pillar } from "./home-copy";

type HomePillarCardsProps = {
  copy: string;
  eyebrow: string;
  items: readonly Pillar[];
  title: string;
};

const pillarIcons = [MicroscopeIcon, BookOpenIcon, NetworkIcon] as const;

export function HomePillarCards({
  copy,
  eyebrow,
  items,
  title,
}: HomePillarCardsProps) {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <header className="grid gap-7 lg:mx-auto lg:max-w-5xl lg:text-center">
        <div className="flex max-w-3xl flex-col gap-5 lg:mx-auto lg:items-center">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h2 className="font-header text-5xl uppercase leading-[0.92] text-foreground sm:text-7xl lg:text-8xl">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8 lg:mx-auto">
          {copy}
        </p>
      </header>

      <div
        className="relative flex flex-col gap-12 py-2 lg:gap-20 lg:py-6"
        data-pillar-layout="storyline"
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
                <Card className="h-full gap-0 overflow-hidden rounded-xl border border-border border-t-primary/55 bg-background/85 py-0 text-card-foreground shadow-2xl ring-0 transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:border-primary/55 group-hover:shadow-[0_32px_90px_rgb(0_0_0_/_0.34)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      sizes="(max-width: 1023px) 100vw, 42vw"
                    />
                    <div
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_76%,rgb(2_14_22/.82)_100%)]"
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
    </div>
  );
}
