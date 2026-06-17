import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { PeopleDirectory } from "./people-directory";
import { cohorts, people } from "./people-data";

export const metadata: Metadata = {
  title: "People Option 1 | Tetiaroa Society",
  description:
    "A leadership-atlas prototype for the Tetiaroa Society people page.",
};

const heroImage =
  "https://www.tetiaroasociety.org/sites/default/files/styles/hero_lg_xtall/public/2026-03/TSTeam2026March.jpg.webp?itok=t8YPphBY";

const cohortCopy = {
  "On-island team":
    "The people who keep the Ecostation, patrols, guide program, education work, and day-to-day field operations moving.",
  "Board of Directors":
    "Governance and long-range stewardship for a society built around research, restoration, education, and culture.",
  "Scientific Advisory Board":
    "Researchers and advisors who help turn Tetiaroa into a serious living laboratory for island resilience.",
};

const stats = [
  { value: "17", label: "On-island team" },
  { value: "19", label: "Board members" },
  { value: "21", label: "Scientific advisors" },
];

export default function PeopleOptionOnePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-[92svh] overflow-hidden pt-14 text-[#f4f1ea] md:pt-16">
        <Image
          src={heroImage}
          alt="Tetiaroa Society team gathered at the field station"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,10,0.5)_0%,rgba(3,12,10,0.12)_35%,rgba(3,12,10,0.52)_62%,#07100e_100%),linear-gradient(90deg,rgba(3,12,10,0.78)_0%,rgba(3,12,10,0.28)_48%,rgba(3,12,10,0.18)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-3.5rem)] max-w-[1600px] flex-col justify-end px-5 pb-8 md:min-h-[calc(92svh-4rem)] md:px-8 md:pb-20 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
            <div>
              <p className="max-w-[20rem] font-mono text-[0.7rem] uppercase leading-6 tracking-[0.2em] text-[#8fc9c9]">
                17 deg 00&apos; 18&quot; S / 149 deg 34&apos; 13&quot; W
              </p>
              <h1 className="mt-6 max-w-6xl font-depth text-[clamp(3.75rem,10vw,11.5rem)] uppercase text-[#f4f1ea]">
                The people keeping Tetiaroa alive.
              </h1>
            </div>

            <Card className="rounded-md shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-display text-[1.8rem] leading-[1.04] md:text-4xl">
                  A leadership directory for the whole stewardship network.
                </CardTitle>
                <CardDescription className="text-sm leading-6 md:leading-7">
                  Option 1 keeps the clarity of a Gates-style leadership page:
                  featured leaders first, cohorts next, then a searchable index
                  with profile links and enough context to understand each role.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" size="lg">
                  <a href="#directory">
                    Explore the atlas
                    <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07100e] px-5 py-16 md:px-8 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(255,180,84,0.14),transparent_30%),radial-gradient(circle_at_8%_60%,rgba(91,232,212,0.1),transparent_34%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#8fc9c9]">
              Cohort map
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,5vw,5.25rem)] leading-[0.98] text-[#f4f1ea]">
              One society, three kinds of stewardship.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#cfd5d0]/76">
              The current page already has these groups. This version gives each
              one a job in the story: field operators, institutional stewards,
              and scientific advisors.
            </p>
          </div>

          <div className="grid gap-4">
            {cohorts.map((cohort, index) => {
              const count = people.filter((person) => person.cohort === cohort).length;

              return (
                <Card
                  key={cohort}
                  size="sm"
                  className="rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardDescription className="font-depth text-7xl leading-none opacity-20 md:text-8xl">
                      0{index + 1}
                    </CardDescription>
                    <CardTitle className="font-display text-3xl leading-none md:text-4xl">
                      {cohort}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                      {cohortCopy[cohort]}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary">{count} people</Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />
      <section className="bg-[#0c1614] px-5 py-8 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm" className="rounded-md">
              <CardHeader>
                <CardTitle className="font-depth text-6xl leading-none text-primary">
                  {stat.value}
                </CardTitle>
                <CardDescription className="font-mono text-[0.7rem] uppercase tracking-[0.16em]">
                  {stat.label}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <Separator />

      <PeopleDirectory />

      <footer className="bg-[#030c0a] px-5 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Separator className="mb-8" />
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl text-[#f4f1ea]">Tetiaroa Society</p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#cfd5d0]/68">
              Option 1 prototype: leadership atlas, cohort structure, searchable
              profile index.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#8fc9c9]">
            <Link href="/">Homepage</Link>
            <Link href="/our-logo">Logo</Link>
            <a href="https://www.tetiaroasociety.org/people">Current people page</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-5 border-b border-white/10 bg-[#030c12]/55 px-5 backdrop-blur-md md:h-16 md:px-7"
      aria-label="Primary"
    >
      <Link href="/" className="relative h-full w-40 shrink-0 overflow-hidden md:w-48">
        <Image
          src="/logos/TSFP_Logo_2026_White.png"
          alt="Tetiaroa Society"
          width={596}
          height={371}
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 object-contain md:h-24"
          priority
        />
      </Link>

      <div className="flex h-full items-center gap-5 text-sm text-[#f4f1ea]/82 max-[720px]:gap-3 max-[720px]:text-[13px]">
        <Link href="/" className="transition hover:text-[#f4f1ea]">
          Home
        </Link>
        <a
          href="#directory"
          className="transition hover:text-[#f4f1ea] max-[560px]:hidden"
        >
          Directory
        </a>
        <Button
          asChild
          size="sm"
          className="donate-lava relative isolate overflow-hidden rounded-full px-[18px] font-semibold shadow-[0_0_18px_rgba(249,115,22,0.28)] hover:-translate-y-px hover:brightness-110"
        >
          <a href="https://www.tetiaroasociety.org/donate">
            <span className="relative z-10">Donate</span>
          </a>
        </Button>
      </div>
    </nav>
  );
}
