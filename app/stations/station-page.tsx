import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  CalendarClockIcon,
  ExternalLinkIcon,
  InfoIcon,
  MegaphoneIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import { ENGLISH_STATIONS_PATH } from "@/app/language-links";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { StationApplicationForm } from "./apply/station-application-form";
import { stationApplicationCopy } from "./apply/apply-copy";
import { StationGallery } from "./station-gallery";
import {
  getStationsToolbarCopy,
  stations,
  stationsIndexCopy,
  type StationSlug,
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

export function StationPage({ slug }: { slug: StationSlug }) {
  const station = stations[slug];
  const homeCopy = homeCopies.en;
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  return (
    <>
      <TopToolbar copy={getStationsToolbarCopy("en")} />
      <main className="bg-background text-foreground">
        <section
          className="relative isolate min-h-[92svh] overflow-hidden"
          aria-label={station.name}
        >
          <Image
            src={station.heroImage}
            alt={station.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_14_17_/_0.55)_0%,rgb(3_14_17_/_0.4)_38%,rgb(3_14_17_/_0.94)_100%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:px-12">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mb-8 h-auto w-fit rounded-full bg-background/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm"
            >
              <Link href={ENGLISH_STATIONS_PATH}>
                <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
                {stationsIndexCopy.eyebrow}
              </Link>
            </Button>

            <Eyebrow>{station.eyebrow}</Eyebrow>
            <h1 className="mt-5 max-w-5xl font-header text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.02em] text-foreground">
              {station.name}
            </h1>
            <p className="mt-6 max-w-3xl font-display text-2xl leading-tight text-primary sm:text-3xl">
              {station.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/85 sm:text-lg sm:leading-8">
              {station.summary}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-full px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-primary-foreground!"
              >
                <a href="#apply">
                  Apply to visit
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-auto rounded-full bg-background/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] backdrop-blur-sm"
              >
                <a href="#facilities">Facilities</a>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 sm:grid-cols-3 lg:grid-cols-5">
              {station.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {fact.label}
                  </dt>
                  <dd className="font-header text-3xl leading-none text-foreground sm:text-4xl">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div style={paperTheme} className="bg-background text-foreground">
          <section id="origin" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
              <div className="flex flex-col gap-6">
                <Eyebrow>{station.location}</Eyebrow>
                <h2 className="max-w-2xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                  {station.originTitle}
                </h2>
                <p className="max-w-2xl font-display text-2xl leading-tight text-primary sm:text-3xl">
                  {station.originLead}
                </p>
                {station.originBody.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <figure className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-muted shadow-2xl lg:aspect-[3/4]">
                <Image
                  src={station.originImage.src}
                  alt={station.originImage.alt}
                  fill
                  sizes="(max-width: 1023px) 92vw, 40vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_16_14_/_0.82)_100%)]"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 font-display text-xl leading-tight text-white sm:p-8 sm:text-2xl">
                  {station.originImage.caption}
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        <section id="work" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto flex max-w-[1450px] flex-col gap-14">
            <div className="flex flex-col gap-5">
              <Eyebrow>{station.workEyebrow}</Eyebrow>
              <h2 className="max-w-3xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                {station.workTitle}
              </h2>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {station.workIntro}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {station.workAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <Card key={area.title} className="h-full rounded-xl">
                    <CardHeader>
                      <Icon
                        className="size-6 text-primary"
                        aria-hidden="true"
                      />
                      <CardTitle className="mt-3 font-header text-2xl leading-none tracking-normal">
                        {area.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {area.copy}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <div style={paperTheme} className="bg-background text-foreground">
          <section
            id="facilities"
            className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
          >
            <div className="mx-auto flex max-w-[1450px] flex-col gap-14">
              <div className="flex flex-col gap-5">
                <Eyebrow>{station.facilitiesEyebrow}</Eyebrow>
                <h2 className="max-w-4xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                  {station.facilitiesTitle}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {station.facilitiesIntro}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {station.facilities.map((facility) => {
                  const Icon = facility.icon;

                  return (
                    <Card key={facility.title} className="h-full rounded-xl">
                      <CardHeader>
                        <Icon
                          className="size-6 text-primary"
                          aria-hidden="true"
                        />
                        <CardTitle className="mt-3 font-header text-3xl leading-none tracking-normal">
                          {facility.title}
                        </CardTitle>
                        <CardDescription>{facility.copy}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <Separator />
                        <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                          {facility.items.map((item) => (
                            <li key={item} className="flex gap-2.5">
                              <span
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <section id="gallery" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto flex max-w-[1450px] flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h2 className="max-w-3xl font-header text-5xl leading-[0.9] sm:text-7xl">
                {station.galleryTitle}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {station.galleryIntro}
              </p>
            </div>
            <StationGallery
              images={station.gallery}
              label={station.galleryTitle}
            />
          </div>
        </section>

        <section id="atoll" className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
          <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <figure className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-muted">
              <Image
                src={station.atollImage.src}
                alt={station.atollImage.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 44vw"
                className="object-cover"
              />
            </figure>

            <div className="flex flex-col gap-6">
              <Eyebrow>{station.atollEyebrow}</Eyebrow>
              <h2 className="max-w-2xl font-header text-5xl leading-[0.9] sm:text-6xl lg:text-7xl">
                {station.atollTitle}
              </h2>
              {station.atollBody.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              <Alert>
                <InfoIcon aria-hidden="true" />
                <AlertTitle>Signed on arrival</AlertTitle>
                <AlertDescription>{station.atollNote}</AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        <div style={paperTheme} className="bg-background text-foreground">
          <section id="apply" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="mx-auto flex max-w-[1450px] flex-col gap-14">
              <div className="flex flex-col gap-5">
                <Eyebrow>{station.applyEyebrow}</Eyebrow>
                <h2 className="max-w-3xl font-header text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
                  {station.applyTitle}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {station.applyIntro}
                </p>
                <Alert className="max-w-3xl">
                  <CalendarClockIcon aria-hidden="true" />
                  <AlertTitle>Plan on a long runway</AlertTitle>
                  <AlertDescription>{station.applyLeadTime}</AlertDescription>
                </Alert>
              </div>

              <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {station.steps.map((step, index) => (
                  <li key={step.title}>
                    <Card className="h-full rounded-xl">
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit font-mono">
                          Step {String(index + 1).padStart(2, "0")}
                        </Badge>
                        <CardTitle className="mt-3 font-header text-3xl leading-none tracking-normal">
                          {step.title}
                        </CardTitle>
                        <CardDescription>{step.copy}</CardDescription>
                      </CardHeader>
                      {step.detail || step.action ? (
                        <CardContent className="flex flex-col gap-4">
                          {step.detail ? (
                            <>
                              <Separator />
                              <p className="text-sm leading-6 text-muted-foreground">
                                {step.detail}
                              </p>
                            </>
                          ) : null}
                          {step.action ? (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-fit"
                            >
                              <a
                                href={step.action.href}
                                target={
                                  step.action.external ? "_blank" : undefined
                                }
                                rel={
                                  step.action.external
                                    ? "noreferrer noopener"
                                    : undefined
                                }
                              >
                                {step.action.label}
                                {step.action.external ? (
                                  <ExternalLinkIcon
                                    data-icon="inline-end"
                                    aria-hidden="true"
                                  />
                                ) : null}
                              </a>
                            </Button>
                          ) : null}
                        </CardContent>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ol>

              <div className="grid gap-5 lg:grid-cols-2">
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="font-header text-4xl leading-none tracking-normal">
                      {station.ratesTitle}
                    </CardTitle>
                    <CardDescription>{station.ratesIntro}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <dl className="flex flex-col">
                      {station.rates.map((rate) => (
                        <div
                          key={rate.audience}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border py-4 first:border-t-0 first:pt-0"
                        >
                          <dt className="flex flex-col gap-1">
                            <span className="text-base leading-6 text-foreground">
                              {rate.audience}
                            </span>
                            {rate.note ? (
                              <span className="text-sm leading-5 text-muted-foreground">
                                {rate.note}
                              </span>
                            ) : null}
                          </dt>
                          <dd className="flex items-baseline gap-2">
                            <span className="font-header text-4xl leading-none text-primary">
                              {rate.rate}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {rate.unit}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <Separator />
                    <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
                      {station.ratesFootnotes.map((note) => (
                        <li key={note.slice(0, 40)} className="flex gap-2.5">
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardHeader>
                    <MegaphoneIcon
                      className="size-6 text-primary"
                      aria-hidden="true"
                    />
                    <CardTitle className="mt-3 font-header text-4xl leading-none tracking-normal">
                      {station.policyTitle}
                    </CardTitle>
                    <CardDescription>{station.policyBody}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                      {station.policyItems.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Separator />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {station.policyNote}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(360px,1fr)] lg:items-start lg:gap-16">
                <div className="flex flex-col gap-5">
                  <h3 className="font-header text-5xl leading-[0.9] sm:text-6xl">
                    {stationApplicationCopy.title}
                  </h3>
                  <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {stationApplicationCopy.description}
                  </p>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    {stationApplicationCopy.managerNote}
                  </p>
                </div>

                <Card className="rounded-xl">
                  <CardContent className="pt-6">
                    <StationApplicationForm
                      slug={slug}
                      turnstileSiteKey={turnstileSiteKey}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter copy={homeCopy.footer} />
    </>
  );
}
