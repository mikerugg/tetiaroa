import Image from "next/image";
import { ArrowDownIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pillarContent, type PillarLocale } from "./pillar-content";
import { PillarMediaFrame } from "./pillar-media-frame";
import { paperVars, PillarChrome, PillarEndMatter } from "./pillar-shared";

const dayCopy = {
  en: {
    title: "A day on Tetiaroa",
    prompt: "Come learn where the lesson is alive.",
    action: "Start the day",
    chapters: [
      { time: "07:10", label: "Arrive + notice" },
      { time: "10:30", label: "Question + investigate" },
      { time: "15:40", label: "Connect + carry forward" },
    ],
    closingLabel: "What stays with you",
  },
  fr: {
    title: "Une journée à Tetiaroa",
    prompt: "Venez apprendre là où la leçon vit.",
    action: "Commencer la journée",
    chapters: [
      { time: "07:10", label: "Arriver + observer" },
      { time: "10:30", label: "Questionner + enquêter" },
      { time: "15:40", label: "Relier + transmettre" },
    ],
    closingLabel: "Ce que l’on emporte",
  },
} as const;

export function EducationCulturePage({ locale }: { locale: PillarLocale }) {
  const slug = "education-culture";
  const copy = pillarContent[locale][slug];
  const day = dayCopy[locale];

  return (
    <PillarChrome locale={locale} slug={slug}>
      <section className="bg-background px-5 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
          <div className="pb-2 lg:pb-10">
            <Badge variant="outline" className="mb-6 h-auto px-3 py-1.5 font-mono uppercase tracking-[0.16em] text-primary">
              {copy.eyebrow}
            </Badge>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {day.prompt}
            </p>
            <h1 className="mt-4 text-balance font-header text-6xl uppercase leading-[0.88] sm:text-8xl lg:text-[8rem]">
              {day.title}
            </h1>
            <p className="mt-7 max-w-xl font-display text-2xl leading-snug text-foreground/80 sm:text-3xl">
              {copy.heroCopy}
            </p>
            <Button asChild className="mt-8" variant="outline">
              <a href="#day">
                {day.action}
                <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <figure className="relative min-h-[58svh] overflow-hidden rounded-md sm:min-h-[68svh] lg:min-h-[78svh]">
            <Image
              src={copy.heroImage}
              alt={copy.heroImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_16_14/.76)_100%)]" aria-hidden="true" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 sm:p-7">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/80">
                Tetiaroa · 17°00′S 149°34′W
              </span>
              <span className="font-header text-5xl text-white/80">02</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="day" className="bg-background text-foreground" style={paperVars}>
        <div className="sticky top-14 border-y border-border bg-background/90 px-5 py-4 backdrop-blur-md md:top-16 md:px-8 lg:px-12">
          <ol className="mx-auto grid max-w-[1450px] grid-cols-3 gap-3">
            {day.chapters.map((chapter, index) => (
              <li key={chapter.time} className="flex items-center gap-3">
                <span className="font-header text-2xl text-primary sm:text-3xl">{chapter.time}</span>
                <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground md:block">
                  {chapter.label}
                </span>
                {index < day.chapters.length - 1 ? <span className="ml-auto hidden h-px flex-1 bg-border lg:block" aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto max-w-[1450px] px-5 py-14 md:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[160px_minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-end">
            <span className="font-header text-8xl text-primary/25">{copy.number}</span>
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">{copy.introTitle}</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.introCopy}</p>
            </div>
            <p className="border-l-2 border-primary pl-5 font-display text-2xl leading-snug">{copy.principle}</p>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1500px] flex-col px-5 pb-20 md:px-8 lg:gap-24 lg:px-12 lg:pb-32">
          {copy.efforts.map((effort, index) => {
            const chapter = day.chapters[index];
            const isEven = index % 2 === 0;

            return (
              <article
                key={effort.title}
                className="grid border-t border-border py-12 lg:grid-cols-12 lg:items-center lg:gap-10 lg:border-0 lg:py-0"
              >
                <PillarMediaFrame
                  media={copy.media[index]}
                  className={cn(
                    "min-h-[360px] sm:min-h-[520px] lg:col-span-7 lg:min-h-[680px]",
                    !isEven && "lg:col-start-6",
                  )}
                  priority={index === 0}
                />
                <div
                  className={cn(
                    "pt-8 lg:col-span-4 lg:pt-0",
                    isEven
                      ? "lg:col-start-9"
                      : "lg:col-start-1 lg:row-start-1",
                  )}
                >
                  <div className="flex items-end justify-between gap-5 border-b border-border pb-5">
                    <div>
                      <p className="font-header text-6xl leading-none text-primary">{chapter.time}</p>
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{chapter.label}</p>
                    </div>
                    <span className="font-header text-4xl text-primary/25">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-balance font-display text-4xl leading-tight">{effort.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{effort.copy}</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {effort.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 md:px-8 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgb(143_201_201/.16),transparent_38%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1250px] gap-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:items-end">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{day.closingLabel}</p>
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
