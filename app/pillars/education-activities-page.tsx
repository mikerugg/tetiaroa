import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, FishIcon, GiftIcon, LeafIcon, ShellIcon, WavesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { educationActivitiesCopy, getEducationActivitiesPath } from "./education-activities-content";
import { getPillarPath, type PillarLocale } from "./pillar-content";
import { paperVars, PillarChrome } from "./pillar-shared";

const themeIcons = [FishIcon, LeafIcon, ShellIcon];

export function EducationActivitiesPage({ locale }: { locale: PillarLocale }) {
  const copy = educationActivitiesCopy[locale];
  const contactHref = locale === "fr" ? "/fr/contact" : "/contact";
  const parentHref = getPillarPath(locale, "education-culture");

  return (
    <PillarChrome locale={locale} slug="education-culture" languageHref={getEducationActivitiesPath(locale === "fr" ? "en" : "fr")}>
      <section className="px-5 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <nav aria-label={copy.breadcrumbLabel} className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <Link href={parentHref} className="inline-flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
              <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
              {copy.parentLabel}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-foreground">{copy.title}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <div className="py-2 lg:py-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
              <h1 className="mt-5 whitespace-pre-line text-balance font-header text-6xl uppercase leading-[0.94] sm:text-8xl lg:text-[clamp(4.5rem,7vw,7rem)]">{copy.heroTitle}</h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">{copy.heroCopy}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="[--primary-foreground:var(--ink-light)]">
                  <a href="#lagoon-school">{copy.lagoonJump}<ArrowDownIcon data-icon="inline-end" aria-hidden="true" /></a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#junior-naturalist">{copy.passportJump}<ArrowDownIcon data-icon="inline-end" aria-hidden="true" /></a>
                </Button>
              </div>
            </div>
            <figure className="relative min-h-[380px] overflow-hidden rounded-md sm:min-h-[540px] lg:min-h-[640px]">
              <Image src="/pillars/education-culture/lakeside-students.jpg" alt={copy.heroImageAlt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-[62%_center]" preload />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-foreground sm:p-8">
                <span className="font-mono text-xs uppercase tracking-[0.15em]">{copy.heroCaption}</span>
                <WavesIcon className="size-9 shrink-0" strokeWidth={1} aria-hidden="true" />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="lagoon-school" className="scroll-mt-16 bg-background px-5 py-16 text-foreground md:px-8 lg:px-12 lg:py-24" style={paperVars}>
        <div className="mx-auto max-w-[1350px]">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">01 / {copy.lagoon.eyebrow}</p>
              <h2 className="mt-5 font-header text-6xl uppercase leading-none sm:text-8xl">{copy.lagoon.title}</h2>
              <Badge variant="secondary" className="mt-6">{copy.lagoon.partner}</Badge>
            </div>
            <div>
              <p className="max-w-xl text-balance font-display text-3xl leading-tight sm:text-4xl">{copy.lagoon.lead}</p>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">{copy.lagoon.copy}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button asChild variant="outline" size="lg"><Link href={contactHref}>{copy.lagoon.action}<ArrowRightIcon data-icon="inline-end" aria-hidden="true" /></Link></Button>
                <Button asChild variant="link"><a href={locale === "fr" ? "https://thebrando.com/fr/experiences/lagoon-school/" : "https://thebrando.com/categories/kids/"}>{copy.lagoon.partnerAction}<ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" /></a></Button>
              </div>
            </div>
          </div>
          <Separator className="my-10 lg:my-14" />
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {copy.lagoon.themes.map((theme, index) => {
              const Icon = themeIcons[index];
              return <div key={theme.title} className="flex items-start gap-4">
                <Icon className="mt-1 size-8 shrink-0 text-primary" strokeWidth={1.25} aria-hidden="true" />
                <div><h3 className="font-display text-2xl">{theme.title}</h3><p className="mt-2 max-w-sm leading-7 text-muted-foreground">{theme.copy}</p></div>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section id="junior-naturalist" className="scroll-mt-16 overflow-hidden px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1350px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">02 / {copy.passport.eyebrow}</p>
            <h2 className="mt-5 whitespace-pre-line font-header text-6xl uppercase leading-none sm:text-7xl">{copy.passport.title}</h2>
            <div className="relative mx-auto mt-12 flex max-w-sm items-center justify-center px-6 py-6 sm:py-10" aria-hidden="true">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative w-full -rotate-6 rounded-r-2xl rounded-l-sm border border-primary/40 bg-lagoon px-8 py-10 text-foreground shadow-[-8px_8px_0_var(--sand),-12px_12px_0_var(--lagoon),0_28px_55px_rgb(0_0_0_/_0.35)] sm:px-10 sm:py-12">
                <div className="absolute inset-y-0 left-3 border-l border-foreground/20" />
                <p className="text-center font-mono text-xs uppercase tracking-[0.25em]">{copy.passport.bookLabel}</p>
                <div className="mx-auto my-8 flex size-28 items-center justify-center rounded-full border border-foreground/60 ring-1 ring-foreground/20 ring-offset-8 ring-offset-lagoon"><LeafIcon className="size-14" strokeWidth={1} /></div>
                <p className="whitespace-pre-line text-center font-header text-5xl uppercase leading-none">{copy.passport.bookTitle}</p>
                <WavesIcon className="mx-auto mt-8 size-8" strokeWidth={1} />
                <p className="mt-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em]">{copy.passport.bookFooter}</p>
              </div>
            </div>
          </div>
          <div className="lg:pt-9">
            <p className="text-balance font-display text-3xl leading-tight sm:text-4xl">{copy.passport.lead}</p>
            <p className="mt-5 max-w-xl leading-8 text-muted-foreground">{copy.passport.copy}</p>
            <ol className="mt-10 flex flex-col gap-7">
              {copy.passport.steps.map((step, index) => <li key={step.title} className="flex gap-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/35 font-mono text-sm text-primary" aria-hidden="true">0{index + 1}</span>
                <div><h3 className="font-display text-2xl leading-tight">{step.title}</h3><p className="mt-2 max-w-lg leading-7 text-muted-foreground">{step.copy}</p></div>
              </li>)}
            </ol>
            <Separator className="my-9" />
            <div className="flex items-start gap-4">
              <GiftIcon className="mt-1 size-7 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
              <div><p className="font-display text-2xl text-primary">{copy.passport.reward}</p><p className="mt-2 max-w-lg leading-7 text-muted-foreground">{copy.passport.rewardCopy}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-16 text-foreground md:px-8 lg:px-12 lg:py-20" style={paperVars}>
        <div className="mx-auto grid max-w-[1350px] gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-20">
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{copy.visit.eyebrow}</p><h2 className="mt-5 text-balance font-display text-4xl leading-tight sm:text-5xl">{copy.visit.title}</h2></div>
          <div><p className="max-w-xl leading-8 text-muted-foreground">{copy.visit.copy}</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild variant="outline" size="lg"><Link href={contactHref}>{copy.visit.action}<ArrowRightIcon data-icon="inline-end" aria-hidden="true" /></Link></Button><Button asChild variant="link"><Link href={parentHref}>{copy.visit.back}</Link></Button></div></div>
        </div>
      </section>
    </PillarChrome>
  );
}
