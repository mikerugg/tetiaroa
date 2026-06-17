import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BinocularsIcon,
  CircleDollarSignIcon,
  CompassIcon,
  HandshakeIcon,
  LandmarkIcon,
  MicroscopeIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteFooter } from "../site-footer";
import { people, type Person } from "../people-option-1/people-data";

export const metadata: Metadata = {
  title: "Our Team | Tetiaroa Society",
  description:
    "Meet the people protecting Tetiaroa through fieldwork, science, education, governance, partnerships, and support.",
};

const heroImage =
  "https://www.tetiaroasociety.org/sites/default/files/styles/hero_lg_xtall/public/2026-03/TSTeam2026March.jpg.webp?itok=t8YPphBY";

const paperVars = {
  "--background": "var(--paper)",
  "--foreground": "var(--ink)",
  "--card": "rgb(255 252 243 / 0.94)",
  "--card-foreground": "var(--ink)",
  "--muted": "rgb(7 16 14 / 0.08)",
  "--muted-foreground": "rgb(7 16 14 / 0.66)",
  "--border": "rgb(7 16 14 / 0.16)",
  "--primary": "var(--lagoon)",
  "--primary-foreground": "var(--paper)",
  "--secondary": "rgb(31 107 110 / 0.12)",
  "--secondary-foreground": "var(--lagoon)",
} as CSSProperties;

const peopleById = new Map(people.map((entry) => [entry.id, entry]));

function person(id: string) {
  const match = peopleById.get(id);

  if (!match) {
    throw new Error(`Missing person data for ${id}`);
  }

  return match;
}

type TeamGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  members: Person[];
};

type SupportGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
};

type SupportProfile = {
  id: string;
  name: string;
  abstract: string;
  logo: string;
  logoDetail?: string;
  href: string;
  actionLabel: string;
};

const specialistGroups = [
  {
    title: "Society Team",
    icon: BinocularsIcon,
    copy: "Daily conservation, education, guiding, operations, communications, monitoring, and research support.",
  },
  {
    title: "Leadership",
    icon: CompassIcon,
    copy: "Strategy, staff support, partnerships, and the long-term focus of the Society.",
  },
  {
    title: "Board of Directors",
    icon: LandmarkIcon,
    copy: "Mission stewardship, governance, resources, and stability over time.",
  },
  {
    title: "Scientific advisors",
    icon: MicroscopeIcon,
    copy: "Research guidance, stronger methods, field interpretation, and conservation knowledge.",
  },
  {
    title: "Partners",
    icon: HandshakeIcon,
    copy: "Research capacity, training, tools, access, and practical support.",
  },
  {
    title: "Donors",
    icon: CircleDollarSignIcon,
    copy: "Support for the patient work: field operations, education, monitoring, and research.",
  },
];

const leadership = [person("tj-tate")];
const fieldTeam = people.filter(
  (entry) => entry.cohort === "On-island team" && entry.id !== "tj-tate",
);
const boardMembers = people.filter((entry) => entry.cohort === "Board of Directors");
const scientificAdvisors = people.filter(
  (entry) => entry.cohort === "Scientific Advisory Board",
);

const teamGroups: TeamGroup[] = [
  {
    id: "leadership",
    title: "Leadership",
    icon: CompassIcon,
    summary:
      "The leadership team sets priorities, supports staff, and keeps the Society focused on work that serves Tetiaroa over the long term.",
    members: leadership,
  },
  {
    id: "society-team",
    title: "Society Team",
    icon: BinocularsIcon,
    summary:
      "The Society Team carries the day-to-day work across conservation, education, guest engagement, operations, communications, monitoring, and support for visiting researchers.",
    members: fieldTeam,
  },
  {
    id: "board",
    title: "Board of Directors",
    icon: LandmarkIcon,
    summary:
      "The board guides the Society's mission, governance, resources, and long-term stability.",
    members: boardMembers,
  },
  {
    id: "scientific-advisory-board",
    title: "Scientific Advisory Board",
    icon: MicroscopeIcon,
    summary:
      "Scientists and other experts advise research priorities, strengthen methods, and help connect field observations to wider conservation knowledge.",
    members: scientificAdvisors,
  },
];

const supportGroups: SupportGroup[] = [
  {
    id: "partners",
    title: "Partners",
    icon: HandshakeIcon,
  },
  {
    id: "donors",
    title: "Donors",
    icon: CircleDollarSignIcon,
  },
];

const supportProfiles: SupportProfile[] = [
  {
    id: "the-brando",
    name: "The Brando",
    abstract:
      "On-atoll partner supporting sustainability practice, guest learning, and the Society's work on Tetiaroa.",
    logo: "The Brando",
    href: "https://thebrando.com/",
    actionLabel: "Visit site",
  },
  {
    id: "mission-blue",
    name: "Mission Blue",
    abstract:
      "Ocean conservation network helping raise visibility for marine protection and public engagement.",
    logo: "Mission Blue",
    href: "https://missionblue.org/",
    actionLabel: "Visit site",
  },
  {
    id: "uc-berkeley",
    name: "UC Berkeley",
    abstract:
      "Research partner bringing scientific capacity, training, and student learning into the atoll's work.",
    logo: "Berkeley",
    logoDetail: "University of California",
    href: "https://www.berkeley.edu/",
    actionLabel: "Visit site",
  },
  {
    id: "woods-hole",
    name: "Woods Hole Oceanographic Institution",
    abstract:
      "Ocean science partner supporting research, field methods, and monitoring of marine systems.",
    logo: "WHOI",
    logoDetail: "Woods Hole Oceanographic Institution",
    href: "https://www.whoi.edu/",
    actionLabel: "Visit site",
  },
  {
    id: "cnrs",
    name: "CNRS",
    abstract:
      "Research institution contributing scientific depth across ecology, biodiversity, and long-term observation.",
    logo: "CNRS",
    href: "https://www.cnrs.fr/",
    actionLabel: "Visit site",
  },
  {
    id: "criobe",
    name: "CRIOBE",
    abstract:
      "French Polynesia marine research center connecting reef science, students, and field expertise.",
    logo: "CRIOBE",
    href: "https://www.criobe.pf/",
    actionLabel: "Visit site",
  },
  {
    id: "donors",
    name: "Donors",
    abstract:
      "People, foundations, nonprofits, and businesses funding conservation, research, education, and daily care.",
    logo: "Donors",
    logoDetail: "People + institutions",
    href: "https://www.tetiaroasociety.org/donate",
    actionLabel: "Donate",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-[88svh] overflow-hidden pt-14 sm:min-h-[92svh] md:pt-16">
        <Image
          src={heroImage}
          alt="Tetiaroa Society team gathered at the field station"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.5)_0%,rgb(7_16_14/.12)_35%,rgb(7_16_14/.52)_62%,var(--background)_100%),linear-gradient(90deg,rgb(7_16_14/.78)_0%,rgb(7_16_14/.28)_48%,rgb(7_16_14/.18)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[calc(88svh-3.5rem)] max-w-[1600px] flex-col justify-end px-5 pb-8 sm:min-h-[calc(92svh-3.5rem)] md:min-h-[calc(92svh-4rem)] md:px-8 md:pb-20 lg:px-12">
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
            <div>
              <p className="max-w-80 font-mono text-xs uppercase leading-6 text-primary">
                Our team
              </p>
              <h1 className="mt-0 max-w-6xl font-depth text-5xl uppercase text-foreground sm:text-6xl md:text-8xl lg:text-9xl">
                The people protecting Teti&apos;aroa.
              </h1>
            </div>

            <Card className="rounded-md shadow-2xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-display text-2xl sm:text-3xl md:text-4xl">
                  A team rooted in Conservation.
                </CardTitle>
                <CardDescription className="text-sm leading-7">
                  Tetiaroa Society brings together on-island staff, leadership,
                  board members, scientific advisors, partners, and donors to
                  care for the atoll and share what we learn.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" size="lg">
                  <a href="#team">
                    Meet the team
                    <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="staff"
        className="bg-background px-5 py-10 text-foreground sm:py-12 md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto grid max-w-[1600px] gap-8 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[0.45fr_repeat(6,1fr)]">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              Many specialists, one team.
            </h2>
          </div>
          {specialistGroups.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 border-border md:border-l md:pl-6"
              >
                <Icon className="text-primary" aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="team"
        className="relative overflow-hidden bg-background px-5 py-14 sm:py-20 md:px-8 lg:px-12"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_18%_0%,rgb(143_201_201/.16),transparent_34%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="flex max-w-4xl flex-col gap-6">
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl">
              The team.
            </h2>
            <div className="flex flex-wrap gap-2">
              {[...teamGroups, ...supportGroups].map((group) => (
                <Button key={group.id} asChild variant="outline" size="sm">
                  <a href={`#${group.id}`}>{group.title}</a>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-14">
            {teamGroups.map((group) => (
              <TeamGroupSection key={group.id} group={group} />
            ))}
            <SupportGroupsSection />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Header() {
  return (
    <nav
      id="top"
      className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/72 px-4 backdrop-blur-md md:h-16 md:px-7"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="relative h-full w-40 shrink-0 overflow-hidden max-[420px]:w-28 md:w-48"
      >
        <Image
          src="/logos/TSFP_Logo_2026_White.png"
          alt="Tetiaroa Society"
          width={596}
          height={371}
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 object-contain max-[420px]:h-16 md:h-24"
          priority
        />
      </Link>

      <div className="flex h-full items-center gap-4 text-sm text-foreground/82 max-[720px]:gap-3 max-[420px]:gap-2 max-[720px]:text-[13px]">
        <Link
          href="/"
          className="transition hover:text-foreground max-[420px]:hidden"
        >
          Home
        </Link>
        <Link href="/team" className="transition hover:text-foreground">
          Our Team
        </Link>
        <a
          href="#leadership"
          className="transition hover:text-foreground max-[520px]:hidden"
        >
          Leadership
        </a>
        <Button asChild size="sm" className="shrink-0">
          <a href="https://www.tetiaroasociety.org/donate">Donate</a>
        </Button>
      </div>
    </nav>
  );
}

function TeamGroupSection({ group }: { group: TeamGroup }) {
  const Icon = group.icon;

  return (
    <section
      id={group.id}
      className="grid gap-5 scroll-mt-24 md:scroll-mt-28 lg:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      <Card className="rounded-md">
        <CardHeader>
          <Icon className="text-primary" aria-hidden="true" />
          <CardTitle>{group.title}</CardTitle>
          <CardDescription>{group.summary}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {group.members.map((entry) => (
          <TeamMemberCard key={entry.id} person={entry} />
        ))}
      </div>
    </section>
  );
}

function SupportGroupsSection() {
  return (
    <section
      id="partners-and-donors"
      className="grid gap-5 scroll-mt-24 md:scroll-mt-28 lg:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      <Card className="rounded-md">
        <CardHeader>
          <HandshakeIcon className="text-primary" aria-hidden="true" />
          <CardTitle>Partners and donors</CardTitle>
          <CardDescription>
            Organizations and supporters adding capacity, continuity, and
            conservation effort around the Society&apos;s work.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {supportProfiles.map((profile) => (
          <SupportProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function SupportProfileCard({ profile }: { profile: SupportProfile }) {
  return (
    <Card id={profile.id} size="sm" className="overflow-hidden rounded-md">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-foreground p-6 text-center text-background">
        <div className="flex max-w-full flex-col items-center gap-2">
          <p className="max-w-full text-balance font-display text-2xl sm:text-3xl">
            {profile.logo}
          </p>
          {profile.logoDetail ? (
            <p className="max-w-[11rem] text-balance font-mono text-xs uppercase leading-5 text-background/60">
              {profile.logoDetail}
            </p>
          ) : null}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>{profile.abstract}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="link" size="sm" className="px-0">
          <a href={profile.href}>
            {profile.actionLabel}
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function TeamMemberCard({ person: entry }: { person: Person }) {
  return (
    <Card size="sm" className="overflow-hidden rounded-md">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={entry.image}
          alt={entry.name}
          fill
          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1280px) 42vw, 280px"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{entry.name}</CardTitle>
        <CardDescription>{entry.role}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="link" size="sm" className="px-0">
          <a href={entry.href}>
            View profile
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
