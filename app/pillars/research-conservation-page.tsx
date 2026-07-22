import Image from "next/image";
import { ArrowDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pillarContent, type PillarLocale } from "./pillar-content";
import { LivingAtollScan, type AtollScanZone } from "./living-atoll-scan";
import { paperVars, PillarChrome, PillarEndMatter } from "./pillar-shared";

const zoneLabels = {
  en: [
    { label: "Motu / remove pressure", coordinate: "land · habitat · biosecurity" },
    { label: "Lagoon / read response", coordinate: "waterline · nursery · nesting" },
    { label: "Reef / test what comes next", coordinate: "outer edge · adaptation · data" },
  ],
  fr: [
    { label: "Motu / lever la pression", coordinate: "terre · habitat · biosécurité" },
    { label: "Lagon / lire la réponse", coordinate: "rivage · nurserie · ponte" },
    { label: "Récif / tester la suite", coordinate: "bord externe · adaptation · données" },
  ],
} as const;

export function ResearchConservationPage({ locale }: { locale: PillarLocale }) {
  const slug = "research-conservation";
  const copy = pillarContent[locale][slug];
  const zones: AtollScanZone[] = copy.efforts.map((effort, index) => ({
    ...zoneLabels[locale][index],
    title: effort.title,
    copy: effort.copy,
    details: effort.details,
    media: copy.media[index],
  }));

  return (
    <PillarChrome locale={locale} slug={slug}>
      <section className="relative min-h-[94svh] overflow-hidden pt-14 md:pt-16">
        <Image
          src={copy.heroImage}
          alt={copy.heroImageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.26),rgb(7_16_14/.16)_35%,rgb(7_16_14/.88)_100%),linear-gradient(90deg,rgb(7_16_14/.8),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(143_201_201/.1)_1px,transparent_1px),linear-gradient(90deg,rgb(143_201_201/.1)_1px,transparent_1px)] bg-[size:84px_84px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[calc(94svh-3.5rem)] max-w-[1600px] flex-col justify-end px-5 pb-10 md:min-h-[calc(94svh-4rem)] md:px-8 md:pb-16 lg:px-12">
          <Badge variant="outline" className="mb-5 h-auto w-fit bg-background/30 px-3 py-1.5 font-mono uppercase tracking-[0.16em] text-primary backdrop-blur-md">
            {copy.eyebrow}
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <h1 className="max-w-5xl text-balance font-header text-6xl uppercase leading-[0.9] sm:text-8xl lg:text-[8.5rem]">
              {copy.heroTitle}
            </h1>
            <div className="border-l border-primary/50 pl-6">
              <p className="font-display text-2xl leading-snug sm:text-3xl">{copy.heroCopy}</p>
              <Button asChild variant="outline" className="mt-6">
                <a href="#scan">
                  {locale === "fr" ? "Lancer le scan" : "Begin the scan"}
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-14 text-foreground md:px-8 lg:px-12 lg:py-20" style={paperVars}>
        <div className="mx-auto grid max-w-[1450px] gap-8 md:grid-cols-[150px_minmax(0,1fr)_minmax(260px,0.55fr)] md:items-end">
          <span className="font-header text-8xl text-primary/30">{copy.number}</span>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">{copy.introTitle}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.introCopy}</p>
          </div>
          <p className="border-l-2 border-primary pl-5 font-display text-2xl leading-snug">{copy.principle}</p>
        </div>
      </section>

      <section id="scan" className="relative px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1450px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Living Atoll Scan</p>
          <h2 className="mt-3 max-w-4xl font-header text-5xl uppercase leading-none sm:text-7xl">{copy.mediaTitle}</h2>
          <div className="mt-10">
            <LivingAtollScan zones={zones} />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-popover px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1250px] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.7fr)] lg:items-end">
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">{copy.bridgeTitle}</h2>
          <p className="text-lg leading-8 text-muted-foreground">{copy.bridgeCopy}</p>
        </div>
      </section>

      <PillarEndMatter locale={locale} slug={slug} />
    </PillarChrome>
  );
}
