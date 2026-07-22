import Image from "next/image";
import { ArrowDownIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pillarContent, type PillarLocale } from "./pillar-content";
import { PillarMediaFrame } from "./pillar-media-frame";
import { PillarChrome, PillarEndMatter } from "./pillar-shared";

const labCopy = {
  en: {
    title: "Island Innovation Lab",
    action: "Enter the lab",
    pipeline: [
      { number: "01", label: "Input", value: "Island constraints" },
      { number: "02", label: "Process", value: "Test + adapt" },
      { number: "03", label: "Output", value: "Evidence that travels" },
    ],
    project: "Live project",
    status: ["Network active", "Field test", "Open exchange"],
    bridgeLabel: "A useful result",
  },
  fr: {
    title: "Laboratoire d’innovation insulaire",
    action: "Entrer dans le labo",
    pipeline: [
      { number: "01", label: "Entrée", value: "Contraintes insulaires" },
      { number: "02", label: "Processus", value: "Tester + adapter" },
      { number: "03", label: "Sortie", value: "Des preuves qui voyagent" },
    ],
    project: "Projet actif",
    status: ["Réseau actif", "Test de terrain", "Échange ouvert"],
    bridgeLabel: "Un résultat utile",
  },
} as const;

export function CommunityGlobalImpactPage({ locale }: { locale: PillarLocale }) {
  const slug = "community-global-impact";
  const copy = pillarContent[locale][slug];
  const lab = labCopy[locale];

  return (
    <PillarChrome locale={locale} slug={slug}>
      <section className="relative min-h-[96svh] overflow-hidden pt-14 md:pt-16">
        <Image src={copy.heroImage} alt={copy.heroImageAlt} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(7_16_14/.93)_0%,rgb(7_16_14/.64)_48%,rgb(7_16_14/.18)_100%),linear-gradient(180deg,transparent_55%,rgb(7_16_14/.9)_100%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(143_201_201/.12)_1px,transparent_1px),linear-gradient(90deg,rgb(143_201_201/.12)_1px,transparent_1px)] bg-[size:64px_64px]" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[calc(96svh-3.5rem)] max-w-[1600px] flex-col justify-between px-5 py-10 md:min-h-[calc(96svh-4rem)] md:px-8 lg:px-12 lg:py-14">
          <div className="flex items-center justify-between gap-5">
            <Badge variant="outline" className="h-auto bg-background/35 px-3 py-1.5 font-mono uppercase tracking-[0.16em] text-primary backdrop-blur-md">
              {copy.eyebrow}
            </Badge>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">Lab / 17°00′S</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Tetiaroa Society presents</p>
              <h1 className="mt-4 max-w-6xl text-balance font-header text-6xl uppercase leading-[0.86] sm:text-8xl lg:text-[8.5rem]">{lab.title}</h1>
            </div>
            <div className="border-l border-primary/50 pl-6">
              <p className="font-display text-2xl leading-snug sm:text-3xl">{copy.heroCopy}</p>
              <Button asChild variant="outline" className="mt-6">
                <a href="#lab">
                  {lab.action}
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="lab" className="border-y border-border bg-popover px-5 py-10 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1450px] md:grid-cols-3">
          {lab.pipeline.map((stage) => (
            <div key={stage.number} className="grid grid-cols-[52px_1fr] gap-4 border-b border-border py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <span className="font-header text-4xl text-primary/35">{stage.number}</span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">{stage.label}</p>
                <p className="mt-2 font-display text-2xl">{stage.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[160px_minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-end">
          <span className="font-header text-8xl text-primary/25">{copy.number}</span>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">{copy.introTitle}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.introCopy}</p>
          </div>
          <p className="border-l-2 border-primary pl-5 font-display text-2xl leading-snug">{copy.principle}</p>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-[linear-gradient(180deg,var(--popover),var(--background))] px-5 py-16 md:px-8 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(143_201_201/.07)_1px,transparent_1px),linear-gradient(90deg,rgb(143_201_201/.07)_1px,transparent_1px)] bg-[size:72px_72px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1450px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{copy.effortsIntro}</p>
          <h2 className="mt-3 max-w-4xl font-header text-5xl uppercase leading-none sm:text-7xl">{copy.effortsTitle}</h2>

          <div className="mt-12 flex flex-col gap-12 lg:gap-20">
            {copy.efforts.map((effort, index) => (
              <article key={effort.title} className="overflow-hidden rounded-md border border-border bg-card/70 backdrop-blur-sm">
                <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
                  <PillarMediaFrame media={copy.media[index]} className="min-h-[330px] rounded-none sm:min-h-[500px] lg:min-h-[620px]" priority={index === 0} />
                  <div className="flex flex-col p-6 sm:p-9 lg:p-10">
                    <div className="flex items-center justify-between gap-5 border-b border-border pb-5 font-mono text-[0.65rem] uppercase tracking-[0.16em]">
                      <span className="text-primary">{lab.project} / 0{index + 1}</span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                        {lab.status[index]}
                      </span>
                    </div>
                    <h3 className="mt-8 text-balance font-display text-4xl leading-tight sm:text-5xl">{effort.title}</h3>
                    <p className="mt-5 text-base leading-7 text-muted-foreground">{effort.copy}</p>
                    <ul className="mt-auto flex flex-col gap-3 pt-10">
                      {effort.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 border-t border-border pt-3 text-sm">
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1250px] gap-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:items-end">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{lab.bridgeLabel}</p>
          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-6xl">{copy.bridgeTitle}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.bridgeCopy}</p>
          </div>
        </div>
      </section>

      <PillarEndMatter locale={locale} slug={slug} />
    </PillarChrome>
  );
}
