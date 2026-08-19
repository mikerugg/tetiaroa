import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon, ArrowRightIcon, ConstructionIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { homeCopies } from "@/app/home-copy";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import {
  getStationPath,
  getStationsToolbarCopy,
  stationSlugs,
  stations,
  stationsIndexCopy as copy,
} from "./stations-content";

const paperTheme = {
  "--background": "var(--paper)",
  "--foreground": "var(--ink)",
  "--card": "rgb(255 252 243 / 0.9)",
  "--card-foreground": "var(--ink)",
  "--muted": "rgb(7 16 14 / 0.07)",
  "--muted-foreground": "rgb(7 16 14 / 0.68)",
  "--border": "rgb(7 16 14 / 0.16)",
  "--primary": "var(--lagoon)",
  "--primary-foreground": "var(--paper)",
  "--secondary": "rgb(31 107 110 / 0.12)",
  "--secondary-foreground": "var(--lagoon)",
} as CSSProperties;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
      {children}
    </p>
  );
}

export function StationsIndexPage() {
  const homeCopy = homeCopies.en;

  return (
    <>
      <TopToolbar copy={getStationsToolbarCopy("en")} />
      <main className="bg-background text-foreground">
        <section
          className="relative isolate min-h-[92svh] overflow-hidden"
          aria-label={copy.title}
        >
          <Image
            src={copy.heroImage}
            alt={copy.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_14_17_/_0.5)_0%,rgb(3_14_17_/_0.32)_42%,rgb(3_14_17_/_0.95)_100%)]"
            aria-hidden="true"
          />
          {/* Keeps the headline and intro legible over the canopy. */}
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgb(3_14_17_/_0.72)_0%,rgb(3_14_17_/_0.35)_46%,transparent_78%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:px-12">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h1 className="mt-5 max-w-5xl font-header text-[clamp(4rem,12vw,12rem)] leading-[0.78] tracking-[-0.02em]">
              {copy.title}
              <span className="mt-3 block max-w-[19ch] font-display text-[0.34em] font-normal italic leading-[1.15] text-primary">
                {copy.titleAccent}
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-foreground/85 sm:text-lg sm:leading-8">
              {copy.intro}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-full px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-primary-foreground!"
              >
                <a href="#work">
                  {copy.heroPrimaryCta}
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="donate"
                size="lg"
                className="h-auto rounded-full px-5 py-3 font-semibold"
              >
                <Link href="/donate">{copy.heroDonateCta}</Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {copy.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-header text-5xl leading-none sm:text-6xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div style={paperTheme} className="bg-background text-foreground">
          <section id="stations" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto flex max-w-[1450px] flex-col gap-12">
            <div className="flex flex-col gap-4">
              <Eyebrow>{copy.listEyebrow}</Eyebrow>
              <h2 className="max-w-3xl font-header text-4xl leading-[0.92] sm:text-6xl">
                {copy.listTitle}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {copy.listIntro}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {stationSlugs.map((slug) => {
                const station = stations[slug];

                return (
                  <Card
                    key={slug}
                    className="group overflow-hidden rounded-2xl pt-0 transition-shadow duration-300 hover:shadow-2xl"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={station.cardImage}
                        alt={station.cardImageAlt}
                        fill
                        sizes="(max-width: 1023px) 92vw, 46vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit font-mono">
                        {copy.openBadge}
                      </Badge>
                      <CardTitle className="mt-3 font-header text-4xl leading-none tracking-normal sm:text-5xl">
                        {station.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {station.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-7 text-muted-foreground">
                        {station.cardSummary}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        size="lg"
                        className="text-primary-foreground!"
                      >
                        <Link href={getStationPath(slug)}>
                          {copy.cardCta}
                          <ArrowRightIcon
                            data-icon="inline-end"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}

              <Card className="flex flex-col justify-center rounded-2xl border-dashed">
                <CardHeader>
                  <ConstructionIcon
                    className="size-6 text-primary"
                    aria-hidden="true"
                  />
                  <Badge variant="outline" className="mt-3 w-fit font-mono">
                    {copy.futureBadge}
                  </Badge>
                  <CardTitle className="mt-3 font-header text-4xl leading-none tracking-normal sm:text-5xl">
                    {copy.futureTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-7 text-muted-foreground">
                    {copy.futureCopy}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          </section>

        </div>

        <section id="work" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="mx-auto flex max-w-[1450px] flex-col gap-14">
              <div className="flex flex-col gap-5">
                <Eyebrow>{copy.workEyebrow}</Eyebrow>
                <h2 className="max-w-4xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                  {copy.workTitle}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {copy.workIntro}
                </p>
              </div>

              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {copy.work.map((item) => (
                  <article key={item.title} className="group flex flex-col gap-5">
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="font-header text-3xl leading-none tracking-normal transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-base leading-7 text-muted-foreground">
                        {item.copy}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
        </section>

        <div style={paperTheme} className="bg-background text-foreground">
          <section id="engage" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="mx-auto flex max-w-[1450px] flex-col gap-14">
              <div className="flex flex-col gap-5">
                <Eyebrow>{copy.engageEyebrow}</Eyebrow>
                <h2 className="max-w-3xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                  {copy.engageTitle}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {copy.engageIntro}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {copy.engage.map((route) => (
                  <Card
                    key={route.title}
                    className="flex h-full flex-col rounded-xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <CardTitle className="font-header text-4xl leading-none tracking-normal">
                        {route.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-base leading-7 text-muted-foreground">
                        {route.copy}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        variant={route.variant}
                        size="lg"
                        className={
                          route.variant === "default"
                            ? "text-primary-foreground!"
                            : undefined
                        }
                      >
                        <Link href={route.href}>
                          {route.cta}
                          <ArrowRightIcon
                            data-icon="inline-end"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter copy={homeCopy.footer} />
    </>
  );
}
