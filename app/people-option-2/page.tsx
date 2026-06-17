import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BinocularsIcon,
  BookOpenIcon,
  CompassIcon,
  RadioIcon,
  SatelliteDishIcon,
  SettingsIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { people, type Person } from "../people-option-1/people-data";

export const metadata: Metadata = {
  title: "People Option 2 | Tetiaroa Society",
  description:
    "A field-station dispatch prototype for the Tetiaroa Society people page.",
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

const fieldNoteVars = {
  "--background": "var(--paper)",
  "--foreground": "var(--ink)",
  "--card": "rgb(255 252 243 / 0.95)",
  "--card-foreground": "var(--ink)",
  "--muted": "rgb(7 16 14 / 0.08)",
  "--muted-foreground": "rgb(7 16 14 / 0.68)",
  "--border": "rgb(7 16 14 / 0.18)",
  "--primary": "var(--lagoon)",
  "--primary-foreground": "var(--paper)",
  "--secondary": "rgb(31 107 110 / 0.12)",
  "--secondary-foreground": "var(--lagoon)",
} as CSSProperties;

const peopleById = new Map(people.map((person) => [person.id, person]));

function person(id: string) {
  const match = peopleById.get(id);

  if (!match) {
    throw new Error(`Missing person data for ${id}`);
  }

  return match;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type FieldNote = {
  person: Person;
  prompt: "What I protect" | "What I teach" | "What I'm tracking" | "What I share" | "What I enable";
  note: string;
};

type Workstream = {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  transmission: string;
  notes: FieldNote[];
};

const today = [
  {
    title: "Rangers",
    icon: BinocularsIcon,
    copy: "Watching wildlife, paths, beaches, and the rules that let the atoll breathe.",
  },
  {
    title: "Researchers",
    icon: RadioIcon,
    copy: "Turning each season of observation into sharper questions and better decisions.",
  },
  {
    title: "Educators",
    icon: BookOpenIcon,
    copy: "Making science, culture, and place legible for the next generation.",
  },
  {
    title: "Guides",
    icon: CompassIcon,
    copy: "Sharing the atoll with care, context, restraint, and deep local knowledge.",
  },
  {
    title: "Operations",
    icon: SettingsIcon,
    copy: "Keeping people, equipment, visits, and field days moving safely.",
  },
];

const workstreams: Workstream[] = [
  {
    id: "turtle-patrol",
    title: "Turtle patrol",
    icon: BinocularsIcon,
    summary:
      "Rangers move through the atoll with a light footprint, watching nesting beaches, wildlife corridors, and visitor impact.",
    transmission: "Morning checks, nest signs, beach conditions, and quiet protection.",
    notes: [
      {
        person: person("lusiano-kolokilagi"),
        prompt: "What I protect",
        note: "Nesting beaches, seabird paths, and the fragile line where land meets lagoon.",
      },
      {
        person: person("tuterai-apuarii"),
        prompt: "What I protect",
        note: "Daily field rhythms that keep wildlife safe and the conservation rules alive.",
      },
      {
        person: person("jean-paul-chongue"),
        prompt: "What I protect",
        note: "The places visitors may never notice, but the atoll depends on.",
      },
    ],
  },
  {
    id: "ecostation",
    title: "Ecostation",
    icon: RadioIcon,
    summary:
      "The Ecostation is the hinge between visiting scientists, local teams, instruments, boats, and long-running field questions.",
    transmission: "Lab benches ready, researchers arriving, instruments checked.",
    notes: [
      {
        person: person("vaitea-izal"),
        prompt: "What I enable",
        note: "A working base for science, learning, and the hundreds of small logistics that make research possible.",
      },
      {
        person: person("hinanui-robson"),
        prompt: "What I'm tracking",
        note: "Research activity across the atoll, from permits and field plans to the patterns each project reveals.",
      },
      {
        person: person("tj-tate"),
        prompt: "What I enable",
        note: "The partnerships and support that turn field insight into long-term capacity.",
      },
    ],
  },
  {
    id: "education-culture",
    title: "Education & Culture",
    icon: BookOpenIcon,
    summary:
      "Education work carries Tetiaroa beyond a single visit, connecting students, communities, culture, and field science.",
    transmission: "School visits, cultural context, and lessons carried back across the water.",
    notes: [
      {
        person: person("ngnahina-moua"),
        prompt: "What I teach",
        note: "That science is stronger when Polynesian students can see themselves inside the questions.",
      },
      {
        person: person("tihoni-maire"),
        prompt: "What I share",
        note: "Stories of place that help visitors move from admiration to responsibility.",
      },
      {
        person: person("kealoha-wilkes"),
        prompt: "What I teach",
        note: "How to read the atoll with patience, respect, and attention to living detail.",
      },
    ],
  },
  {
    id: "guides",
    title: "Guides",
    icon: CompassIcon,
    summary:
      "Guides translate the reef, birds, plants, stories, and protocols into encounters that leave the atoll stronger.",
    transmission: "Visitor briefings, careful routes, and the shared language of stewardship.",
    notes: [
      {
        person: person("hugo-torres"),
        prompt: "What I share",
        note: "The difference between seeing a place and knowing how to behave inside it.",
      },
      {
        person: person("hina-patii"),
        prompt: "What I teach",
        note: "Careful attention to wildlife, culture, and the small signs that tell the atoll's story.",
      },
      {
        person: person("tekura-ung"),
        prompt: "What I share",
        note: "A visitor experience rooted in respect, not extraction.",
      },
      {
        person: person("thierry-sommer"),
        prompt: "What I protect",
        note: "The calm pace and field etiquette that let people and wildlife coexist.",
      },
      {
        person: person("maxime-courroux"),
        prompt: "What I teach",
        note: "How each route, stop, and conversation can become a conservation act.",
      },
    ],
  },
  {
    id: "dive-ops",
    title: "Dive Ops",
    icon: WavesIcon,
    summary:
      "Dive operations keep reef encounters safe and purposeful while helping people understand the living systems below.",
    transmission: "Reef briefings, weather windows, safety checks, and underwater observation.",
    notes: [
      {
        person: person("romain-clervoy"),
        prompt: "What I'm tracking",
        note: "Sea state, team safety, and the reef conditions that shape every dive plan.",
      },
    ],
  },
  {
    id: "digital-comms",
    title: "Digital/Comms",
    icon: SatelliteDishIcon,
    summary:
      "Communications make the field legible from afar, carrying updates, context, and reasons to support the work.",
    transmission: "Images, field updates, donor moments, and the public record of daily work.",
    notes: [
      {
        person: person("hereiti-lelong"),
        prompt: "What I share",
        note: "A public story that keeps the science human and the atoll close, even from far away.",
      },
      {
        person: person("carol-ann-raydon"),
        prompt: "What I enable",
        note: "Digital paths that help people find the work, understand it, and stay connected.",
      },
    ],
  },
];

const council = [
  person("cecile-gaspar-board"),
  person("neil-davies-board"),
  person("hinano-murphy"),
  person("daniel-kammen-advisory"),
  person("yadvinder-malhi"),
  person("sylvia-earle"),
];

const staffCount = people.filter((entry) => entry.cohort === "On-island team").length;
const councilCount = people.length - staffCount;

export default function PeopleOptionTwoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-[94svh] overflow-hidden pt-14 md:pt-16">
        <Image
          src={heroImage}
          alt="Tetiaroa Society team gathered at the field station"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.44)_0%,rgb(7_16_14/.18)_42%,var(--background)_100%),linear-gradient(90deg,rgb(7_16_14/.82)_0%,rgb(7_16_14/.34)_48%,rgb(7_16_14/.6)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[calc(94svh-3.5rem)] max-w-[1600px] flex-col justify-end px-5 pb-7 md:min-h-[calc(94svh-4rem)] md:px-8 md:pb-10 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.43fr)] lg:items-end">
            <div className="max-w-5xl">
              <h1 className="font-display text-[clamp(4rem,9vw,9.5rem)] leading-[0.82] text-foreground">
                Field Station Dispatches
              </h1>
              <p className="mt-6 max-w-2xl font-mono text-xs uppercase leading-6 tracking-[0.18em] text-primary">
                People on the atoll. Work in motion.
              </p>
              <div className="mt-7 flex max-w-xl flex-col gap-3 border-l border-primary pl-5 font-mono text-xs uppercase leading-6 tracking-[0.16em] text-foreground/82 sm:flex-row sm:items-center sm:gap-7">
                <p>17 deg 00&apos; 52&quot; S</p>
                <p>149 deg 37&apos; 14&quot; W</p>
                <p>Tetiaroa Atoll</p>
              </div>
            </div>

            <Card className="rounded-md backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Field transmission</CardTitle>
                  <Badge variant="secondary">Live</Badge>
                </div>
                <CardDescription>17 Jun 2026 / 05:42 atoll time</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Separator />
                <p className="font-mono text-xs leading-6 text-muted-foreground">
                  Calm seas. Clear sighting conditions. Turtle patrol outbound.
                  Ecostation monitoring active. School visit at Honuea. Dive ops
                  preparing for reef survey.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <a href="#dispatches">
                    Read dispatch
                    <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section
        className="bg-background px-5 py-12 text-foreground md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto grid max-w-[1600px] gap-8 md:grid-cols-[0.7fr_1fr] lg:grid-cols-[0.45fr_repeat(5,1fr)]">
          <div>
            <h2 className="font-display text-4xl leading-none md:text-5xl">
              Today on the atoll
            </h2>
          </div>
          {today.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex flex-col gap-4 border-border md:border-l md:pl-6">
                <Icon className="size-7 text-primary" aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="dispatches"
        className="relative overflow-hidden bg-background px-5 py-20 md:px-8 lg:px-12"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_18%_0%,rgb(143_201_201/.16),transparent_34%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Our workstreams
              </p>
              <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.7rem,6vw,6.5rem)] leading-[0.9]">
                Different work. One atoll.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {workstreams.map((workstream) => (
                <Button key={workstream.id} asChild variant="outline" size="sm">
                  <a href={`#${workstream.id}`}>{workstream.title}</a>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-14">
            {workstreams.map((workstream) => (
              <WorkstreamSection key={workstream.id} workstream={workstream} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-background px-5 py-20 text-foreground md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.42fr_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-[clamp(2.6rem,5vw,5.75rem)] leading-[0.92]">
              The council behind the work
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Board members and scientific advisors give the field team durable
              guidance: governance, research depth, cultural fluency, and the
              long view that restoration needs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Badge variant="secondary">{staffCount} on-island team</Badge>
              <Badge variant="secondary">{councilCount} council members</Badge>
            </div>
            <Button asChild variant="outline" className="mt-8">
              <a href="https://www.tetiaroasociety.org/people">
                View current people page
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {council.map((entry) => (
              <CouncilCard key={entry.id} person={entry} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-background px-5 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Separator />
          <div className="grid gap-8 py-8 md:grid-cols-[1fr_0.75fr_0.75fr_1fr]">
            <div>
              <Image
                src="/logos/TSFP_Logo_2026_White.png"
                alt="Tetiaroa Society"
                width={596}
                height={371}
                className="h-20 w-auto object-contain"
              />
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Science, culture, conservation. Working together for a thriving
                Tetiaroa.
              </p>
            </div>
            <FooterLinks
              title="Compare"
              links={[
                { href: "/people-option-1", label: "Team Option 1" },
                { href: "/people-option-2", label: "Field Dispatches" },
                { href: "https://www.tetiaroasociety.org/people", label: "Current page" },
              ]}
            />
            <FooterLinks
              title="Explore"
              links={[
                { href: "/", label: "Homepage" },
                { href: "/our-logo", label: "Logo" },
                { href: "https://www.tetiaroasociety.org/donate", label: "Donate" },
              ]}
            />
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Stay connected
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Dispatches from the atoll: stories, updates, and ways to help.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <a href="#top">
                  Back to top
                  <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
          <Separator />
          <p className="pt-6 text-xs text-muted-foreground">Option 2 prototype / Field Station Dispatches</p>
        </div>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <nav
      id="top"
      className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-5 border-b border-border bg-background/72 px-5 backdrop-blur-md md:h-16 md:px-7"
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

      <div className="flex h-full items-center gap-4 text-sm text-foreground/82 max-[720px]:gap-3 max-[720px]:text-[13px]">
        <Link href="/" className="transition hover:text-foreground">
          Home
        </Link>
        <Link href="/people-option-1" className="transition hover:text-foreground max-[640px]:hidden">
          Option 1
        </Link>
        <a href="#dispatches" className="transition hover:text-foreground max-[560px]:hidden">
          Dispatches
        </a>
        <Button asChild size="sm">
          <a href="https://www.tetiaroasociety.org/donate">Donate</a>
        </Button>
      </div>
    </nav>
  );
}

function WorkstreamSection({ workstream }: { workstream: Workstream }) {
  const Icon = workstream.icon;

  return (
    <section id={workstream.id} className="grid gap-5 scroll-mt-28 lg:grid-cols-[0.34fr_minmax(0,1fr)]">
      <Card className="rounded-md">
        <CardHeader>
          <Icon className="size-7 text-primary" aria-hidden="true" />
          <CardTitle>{workstream.title}</CardTitle>
          <CardDescription>{workstream.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <p className="font-mono text-xs uppercase leading-6 tracking-[0.16em] text-muted-foreground">
            {workstream.transmission}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workstream.notes.map((note) => (
          <FieldNoteCard key={`${workstream.id}-${note.person.id}`} note={note} />
        ))}
      </div>
    </section>
  );
}

function FieldNoteCard({ note }: { note: FieldNote }) {
  return (
    <Card size="sm" className="rounded-md" style={fieldNoteVars}>
      <div className="relative aspect-[4/3.5] overflow-hidden bg-muted">
        <Image
          src={note.person.image}
          alt={note.person.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 42vw, 320px"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <Badge variant="secondary" className="w-fit">Field note</Badge>
        <CardTitle>{note.person.name}</CardTitle>
        <CardDescription>{note.person.role}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit">{note.prompt}</Badge>
          <p className="text-sm leading-6 text-muted-foreground">{note.note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {note.person.focus.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" size="sm" className="px-0">
          <a href={note.person.href}>
            View profile
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CouncilCard({ person: entry }: { person: Person }) {
  return (
    <Card size="sm" className="rounded-md">
      <CardHeader className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-3">
        <Avatar className="size-14 rounded-md after:rounded-md">
          <AvatarImage src={entry.image} alt={entry.name} className="rounded-md" />
          <AvatarFallback className="rounded-md">{initials(entry.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <CardTitle className="truncate">{entry.name}</CardTitle>
          <CardDescription>{entry.role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {entry.focus.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </CardContent>
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

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{title}</p>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:text-foreground">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
