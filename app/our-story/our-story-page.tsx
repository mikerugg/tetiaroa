import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import { ourStoryCopy as copy } from "./our-story-content";
import { StoryChapterNav } from "./story-chapter-nav";
import { StoryHero } from "./story-hero";

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

const darkTheme = {
  "--background": "var(--ink)",
  "--foreground": "var(--paper)",
  "--card": "rgb(255 252 243 / 0.045)",
  "--card-foreground": "var(--paper)",
  "--muted": "rgb(255 252 243 / 0.08)",
  "--muted-foreground": "rgb(221 225 215 / 0.72)",
  "--border": "rgb(255 252 243 / 0.13)",
  "--primary": "var(--glow)",
  "--primary-foreground": "var(--ink)",
} as CSSProperties;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
      {children}
    </p>
  );
}

export function OurStoryPage() {
  const homeCopy = homeCopies.en;
  const toolbarCopy = {
    ...homeCopy.toolbar,
    storyHref: "/our-story",
    languageHref: "/fr#our-story",
    languageAriaLabel: "Lire le résumé de cette histoire en français",
  };

  return (
    <>
      <TopToolbar copy={toolbarCopy} />
      <main className="bg-background text-foreground">
        <StoryHero copy={copy.hero} />
        <StoryChapterNav chapters={copy.chapters} />

        <div style={paperTheme} className="bg-background text-foreground">
          <section id="inheritance" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
              <div className="flex flex-col gap-6">
                <Eyebrow>{copy.inheritance.eyebrow}</Eyebrow>
                <h2 className="max-w-3xl font-header text-6xl leading-[0.88] sm:text-8xl lg:text-9xl">
                  {copy.inheritance.title}
                </h2>
                <p className="max-w-2xl font-display text-3xl leading-tight text-primary sm:text-4xl">
                  {copy.inheritance.lead}
                </p>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {copy.inheritance.body}
                </p>
              </div>

              <figure className="relative min-h-[38rem] overflow-hidden rounded-[2rem] bg-muted shadow-2xl lg:min-h-[52rem]">
                <Image
                  src="https://www.tetiaroasociety.org/sites/default/files/styles/hero_sm_square/public/2017-03/honoura.png.webp?itok=L-GNowVe"
                  alt={copy.inheritance.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 1023px) 100vw, 56vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(7_16_14_/_0.84)_100%)]" aria-hidden="true" />
                <figcaption className="absolute inset-x-0 bottom-0 p-7 font-display text-2xl leading-tight text-white sm:p-9 sm:text-3xl">
                  {copy.inheritance.note}
                </figcaption>
              </figure>
            </div>
          </section>

          <Separator />

          <section id="idea" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="mx-auto max-w-[1500px]">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
                <div className="flex flex-col gap-6">
                  <Eyebrow>{copy.idea.eyebrow}</Eyebrow>
                  <h2 className="font-header text-6xl leading-[0.88] sm:text-8xl lg:text-9xl">
                    {copy.idea.title}
                  </h2>
                </div>
                <div className="flex flex-col gap-5 text-base leading-8 text-muted-foreground sm:text-lg">
                  <p className="font-display text-3xl leading-tight text-primary sm:text-4xl">
                    {copy.idea.lead}
                  </p>
                  <p>{copy.idea.body}</p>
                </div>
              </div>

              <figure className="relative mt-14 aspect-[2.05/1] min-h-[28rem] overflow-hidden rounded-[2rem] bg-muted shadow-2xl sm:min-h-0">
                <Image
                  src="/story/history-new-lagoon-witness.png"
                  alt={copy.idea.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover object-[68%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_16_14_/_0.75)_100%)]" aria-hidden="true" />
                <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 sm:bottom-7 sm:left-7 sm:text-xs">
                  {copy.idea.imageCaption}
                </figcaption>
              </figure>

              <blockquote className="mx-auto my-20 max-w-6xl text-center sm:my-28">
                <p className="font-display text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.98] text-foreground">
                  “{copy.idea.quote}”
                </p>
                <footer className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  — {copy.idea.quoteCredit}
                </footer>
              </blockquote>

              <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div className="flex flex-col gap-5">
                  <Eyebrow>{copy.handoff.eyebrow}</Eyebrow>
                  <h3 className="font-header text-6xl leading-[0.9] sm:text-7xl">
                    {copy.handoff.title}
                  </h3>
                  <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                    {copy.handoff.body}
                  </p>
                </div>
                <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                  {copy.handoff.timeline.map((entry) => (
                    <li key={entry.year} className="flex min-h-64 flex-col bg-background p-7 sm:p-8">
                      <p className="font-header text-5xl text-primary">{entry.year}</p>
                      <h4 className="mt-auto pt-8 font-display text-3xl leading-none">{entry.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </div>

        <div style={darkTheme} className="bg-background text-foreground">
          <section id="practice" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="mx-auto max-w-[1500px]">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
                <div className="flex flex-col gap-6">
                  <Eyebrow>{copy.practice.eyebrow}</Eyebrow>
                  <h2 className="font-header text-6xl leading-[0.85] sm:text-8xl lg:text-9xl">
                    {copy.practice.title}
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {copy.practice.intro}
                </p>
              </div>

              <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {copy.practice.items.map((item) => (
                  <Card key={item.number} className="min-h-[29rem] bg-card">
                    <CardHeader>
                      <p className="font-header text-5xl text-primary/55">{item.number}</p>
                      <CardTitle className="mt-10 font-display text-3xl leading-none font-normal">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-7">
                        {item.body}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button asChild variant="link" className="h-auto p-0 font-mono text-xs uppercase tracking-[0.12em]">
                        <Link href={item.href}>
                          {item.action}
                          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-20 grid overflow-hidden rounded-[2rem] border border-border lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[28rem] bg-muted lg:min-h-[42rem]">
                  <Image
                    src="/story/history-living-archive.png"
                    alt="Illustrative composition connecting Marlon Brando's vision with present-day research and education on Tetiaroa"
                    fill
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="object-cover object-[58%_center]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgb(7_16_14_/_0.42)_100%)]" aria-hidden="true" />
                </div>
                <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-16">
                  <Eyebrow>{copy.plan.eyebrow}</Eyebrow>
                  <h3 className="font-header text-6xl leading-[0.88] sm:text-7xl">
                    {copy.plan.title}
                  </h3>
                  <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                    {copy.plan.body}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">
                    {copy.plan.documentNote}
                  </p>
                  <Button asChild variant="outline" size="lg" className="h-auto w-fit rounded-full px-5 py-3">
                    <a href={copy.plan.documentHref} target="_blank" rel="noreferrer noopener">
                      <FileTextIcon data-icon="inline-start" aria-hidden="true" />
                      {copy.plan.documentLabel}
                      <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section id="horizon" className="overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="mx-auto max-w-[1500px]">
              <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
                <div className="flex flex-col gap-6">
                  <Eyebrow>{copy.horizon.eyebrow}</Eyebrow>
                  <h2 className="font-header text-6xl leading-[0.85] sm:text-8xl lg:text-9xl">
                    {copy.horizon.title}
                  </h2>
                  <p className="font-display text-3xl leading-tight text-primary sm:text-4xl">
                    {copy.horizon.lead}
                  </p>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {copy.horizon.body}
                  </p>
                </div>

                <div className="relative aspect-square max-h-[42rem] overflow-hidden rounded-full border border-primary/30 bg-[radial-gradient(circle,transparent_0_17%,rgb(143_201_201_/_0.08)_17.2%_18%,transparent_18.2%_37%,rgb(143_201_201_/_0.1)_37.2%_38%,transparent_38.2%_58%,rgb(143_201_201_/_0.12)_58.2%_59%,transparent_59.2%)]">
                  <div className="absolute inset-[34%] flex items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-center font-header text-3xl text-primary sm:text-5xl">
                    Tetiaroa
                  </div>
                  <p className="absolute left-1/2 top-[20%] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/75 sm:text-xs">
                    French Polynesia
                  </p>
                  <p className="absolute bottom-[14%] left-1/2 w-3/4 -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/75 sm:text-xs">
                    Island + coastal communities
                  </p>
                  <span className="absolute left-[21%] top-1/2 size-2 rounded-full bg-primary shadow-[0_0_20px_var(--primary)]" aria-hidden="true" />
                  <span className="absolute right-[15%] top-[43%] size-2 rounded-full bg-primary shadow-[0_0_20px_var(--primary)]" aria-hidden="true" />
                  <span className="absolute bottom-[23%] right-[29%] size-2 rounded-full bg-primary shadow-[0_0_20px_var(--primary)]" aria-hidden="true" />
                </div>
              </div>

              <ol className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
                {copy.horizon.steps.map((step, index) => (
                  <li key={step.label} className="flex min-h-80 flex-col bg-background p-8 sm:p-10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{step.label}</p>
                      <span className="font-header text-4xl text-primary/35">0{index + 1}</span>
                    </div>
                    <h3 className="mt-auto pt-12 font-display text-4xl leading-none">{step.title}</h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <div style={paperTheme} className="bg-background text-foreground">
          <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
            <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div className="flex flex-col gap-5">
                <Eyebrow>{copy.sources.eyebrow}</Eyebrow>
                <h2 className="font-header text-6xl leading-[0.9] sm:text-7xl">{copy.sources.title}</h2>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">{copy.sources.intro}</p>
              </div>
              <ol className="flex flex-col">
                {copy.sources.items.map((source, index) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex min-h-28 items-center gap-5 border-t border-border py-5 text-foreground transition-colors hover:text-primary last:border-b"
                    >
                      <span className="font-header text-4xl text-primary/45">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-medium leading-6">{source.label}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{source.note}</span>
                      </span>
                      <ExternalLinkIcon className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <section className="relative isolate min-h-[82svh] overflow-hidden">
          <Image
            src="/story/history-new-living-handoff.png"
            alt="Illustrative composition of Tetiaroa field research and education continuing Marlon Brando's ecological idea"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14_/_0.35)_0%,rgb(7_16_14_/_0.92)_100%)]" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[82svh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
            <Eyebrow>{copy.closing.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-header text-6xl leading-[0.86] text-foreground sm:text-8xl lg:text-9xl">
              {copy.closing.title}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg">
              {copy.closing.body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild variant="impact" size="lg" className="h-auto rounded-full px-5 py-3">
                <Link href="/impact">
                  {copy.closing.impactLabel}
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto rounded-full bg-background/30 px-5 py-3 backdrop-blur-sm">
                <Link href="/team">{copy.closing.teamLabel}</Link>
              </Button>
              <Button asChild variant="donate" size="lg" className="h-auto rounded-full px-5 py-3">
                <Link href="/donate">{copy.closing.donateLabel}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Separator />
      <SiteFooter copy={homeCopy.footer} />
    </>
  );
}
