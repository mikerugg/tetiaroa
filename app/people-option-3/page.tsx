import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BirdIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  CircleDollarSignIcon,
  CompassIcon,
  FishIcon,
  HandshakeIcon,
  LandmarkIcon,
  MicroscopeIcon,
  NetworkIcon,
  RadioTowerIcon,
  ShellIcon,
  SproutIcon,
  UsersIcon,
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
  title: "People Option 3 | Tetiaroa Society",
  description:
    "A stewardship-network prototype that merges the Tetiaroa Society about and people pages.",
};

const heroImage =
  "https://www.tetiaroasociety.org/sites/default/files/styles/hero_lg_xtall/public/2026-03/TSTeam2026March.jpg.webp?itok=t8YPphBY";

const missionStatement =
  "THE MISSION of Tetiaroa Society is to ensure island and coastal communities have a future as rich as their past - strengthening their resilience to global change, by restoring their ecosystems, and preserving their cultures.";

const visionStatement =
  "Grounded in experience and action on Tetiaroa, OUR VISION is to weave enlightened values, traditional wisdom, and scientific understanding into a new fabric for our common island home.";

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

const lagoonVars = {
  "--card": "rgb(244 241 234 / 0.055)",
  "--card-foreground": "var(--paper)",
  "--muted": "rgb(244 241 234 / 0.08)",
  "--muted-foreground": "rgb(207 213 208 / 0.72)",
  "--border": "rgb(244 241 234 / 0.14)",
  "--primary": "var(--glow)",
  "--primary-foreground": "var(--ink)",
  "--secondary": "rgb(143 201 201 / 0.14)",
  "--secondary-foreground": "var(--glow)",
} as CSSProperties;

const peopleById = new Map(people.map((entry) => [entry.id, entry]));

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

const localTeam = people.filter((entry) => entry.cohort === "On-island team");
const board = people.filter((entry) => entry.cohort === "Board of Directors");
const scientificAdvisors = people.filter(
  (entry) => entry.cohort === "Scientific Advisory Board",
);

type NetworkGroup = {
  title: string;
  count: string;
  icon: LucideIcon;
  summary: string;
};

const networkGroups: NetworkGroup[] = [
  {
    title: "Local Team",
    count: String(localTeam.length),
    icon: UsersIcon,
    summary:
      "Rangers, guides, educators, dive operators, communicators, and Ecostation staff who turn stewardship into daily practice.",
  },
  {
    title: "Scientific Advisors",
    count: String(scientificAdvisors.length),
    icon: MicroscopeIcon,
    summary:
      "Researchers who bring depth to climate, reefs, seabirds, turtles, restoration, archaeology, and biodiversity questions.",
  },
  {
    title: "Board",
    count: String(board.length),
    icon: LandmarkIcon,
    summary:
      "Governance, institutional memory, cultural guidance, philanthropy, and long-range strategy behind the field work.",
  },
  {
    title: "Partners",
    count: "20+",
    icon: HandshakeIcon,
    summary:
      "Universities, research institutions, NGOs, and collaborators who extend what can be observed, taught, and restored.",
  },
  {
    title: "Donors",
    count: "many",
    icon: CircleDollarSignIcon,
    summary:
      "People, foundations, nonprofits, and businesses who turn care for Tetiaroa into durable capacity.",
  },
];

type ProgramCluster = {
  id: string;
  title: string;
  icon: LucideIcon;
  depth: string;
  description: string;
  themes: string[];
  connected: Person[];
};

const programClusters: ProgramCluster[] = [
  {
    id: "reefs",
    title: "Reefs",
    icon: FishIcon,
    depth: "Lagoon edge",
    description:
      "Reef observation, dive safety, coral research, and the decisions that keep the lagoon legible over time.",
    themes: ["Dive ops", "Coral", "Monitoring"],
    connected: [
      person("romain-clervoy"),
      person("robert-carpenter"),
      person("ruth-gates"),
      person("serge-planes"),
    ],
  },
  {
    id: "seabirds",
    title: "Seabirds",
    icon: BirdIcon,
    depth: "Motus and canopy",
    description:
      "Wildlife protection, island restoration, and invasive-species knowledge woven into everyday field patrols.",
    themes: ["Rangers", "Restoration", "Biodiversity"],
    connected: [
      person("lusiano-kolokilagi"),
      person("tuterai-apuarii"),
      person("james-russell"),
      person("jean-yves-meyer"),
    ],
  },
  {
    id: "turtles",
    title: "Turtles",
    icon: ShellIcon,
    depth: "Beach line",
    description:
      "Nesting beach protection, marine megafauna expertise, and careful visitor protocols where land meets lagoon.",
    themes: ["Beach patrol", "Marine life", "Visitor care"],
    connected: [
      person("jean-paul-chongue"),
      person("cecile-gaspar-advisory"),
      person("sylvia-earle"),
      person("mayalen-zubia"),
    ],
  },
  {
    id: "culture",
    title: "Culture",
    icon: SproutIcon,
    depth: "Ancestral ground",
    description:
      "Traditional wisdom, Polynesian education, archaeology, and place-based interpretation carried through the team.",
    themes: ["Wisdom", "Archaeology", "Language"],
    connected: [
      person("ngnahina-moua"),
      person("tihoni-maire"),
      person("hinano-murphy"),
      person("patrick-kirch"),
    ],
  },
  {
    id: "education",
    title: "Education",
    icon: BookOpenIcon,
    depth: "Classroom to atoll",
    description:
      "Learning programs that let students meet science, culture, and stewardship through a living island system.",
    themes: ["Students", "Guides", "Community"],
    connected: [
      person("ngnahina-moua"),
      person("judy-lemus"),
      person("kealoha-wilkes"),
      person("hina-patii"),
    ],
  },
  {
    id: "digital-twin",
    title: "Digital Twin",
    icon: BrainCircuitIcon,
    depth: "Data layer",
    description:
      "Digital records, research coordination, web systems, and long-lived knowledge infrastructure for the atoll.",
    themes: ["Data", "Research", "Comms"],
    connected: [
      person("tj-tate"),
      person("carol-ann-raydon"),
      person("hinanui-robson"),
      person("neil-davies-advisory"),
    ],
  },
  {
    id: "climate",
    title: "Climate",
    icon: WavesIcon,
    depth: "Ocean and atmosphere",
    description:
      "Climate resilience, carbon systems, biodiversity change, and the science needed by island communities.",
    themes: ["Resilience", "Energy", "Change"],
    connected: [
      person("daniel-kammen-advisory"),
      person("yadvinder-malhi"),
      person("hillary-young"),
      person("tj-tate"),
    ],
  },
];

type StewardProfile = {
  person: Person;
  expertise: string;
  projects: string[];
  roleInNetwork: string;
};

const stewards: StewardProfile[] = [
  {
    person: person("tj-tate"),
    expertise: "Network leadership",
    projects: ["Partnerships", "Climate", "Ecostation"],
    roleInNetwork:
      "Connects field work, donor support, science partnerships, and the society's operating rhythm.",
  },
  {
    person: person("hinanui-robson"),
    expertise: "Research coordination",
    projects: ["Digital Twin", "Reefs", "Climate"],
    roleInNetwork:
      "Helps visiting scientists, local observations, permits, and field plans meet cleanly.",
  },
  {
    person: person("vaitea-izal"),
    expertise: "Ecostation operations",
    projects: ["Research", "Education", "Field logistics"],
    roleInNetwork:
      "Keeps the base ready for researchers, students, instruments, boats, and daily problem solving.",
  },
  {
    person: person("ngnahina-moua"),
    expertise: "Education and culture",
    projects: ["Culture", "Education", "Community"],
    roleInNetwork:
      "Builds programs where Polynesian students can meet Polynesian science and stewardship.",
  },
  {
    person: person("romain-clervoy"),
    expertise: "Dive operations",
    projects: ["Reefs", "Visitor learning", "Safety"],
    roleInNetwork:
      "Turns reef encounters into careful observation, safe access, and respect for the lagoon.",
  },
  {
    person: person("cecile-gaspar-advisory"),
    expertise: "Marine conservation",
    projects: ["Turtles", "Health", "Restoration"],
    roleInNetwork:
      "Brings long-term conservation and island health expertise into science and stewardship decisions.",
  },
];

const partners = [
  "The Brando",
  "Mission Blue",
  "UC Berkeley",
  "Woods Hole Oceanographic Institution",
  "CNRS",
  "CRIOBE",
  "University of Washington",
  "UC Gump Station",
];

const donorTypes = ["People", "Foundations", "Nonprofits", "Businesses"];

const stewardshipActions = [
  "Manage and protect the whole island system",
  "Host research and curate a shared knowledge base",
  "Carry out conservation, education, and cultural programs",
  "Work with The Brando and research partners on the atoll",
];

export default function PeopleOptionThreePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-[96svh] overflow-hidden pt-14 md:pt-16">
        <Image
          src={heroImage}
          alt="Tetiaroa Society team gathered at the field station"
          fill
          sizes="100vw"
          className="object-cover opacity-28"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.68)_0%,rgb(7_16_14/.46)_38%,var(--background)_100%),linear-gradient(90deg,var(--background)_0%,rgb(7_16_14/.74)_42%,rgb(7_16_14/.3)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[calc(96svh-3.5rem)] max-w-[1600px] gap-8 px-5 pb-8 pt-10 md:min-h-[calc(96svh-4rem)] md:px-8 md:pb-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(390px,0.48fr)] lg:items-end lg:px-12">
          <div className="min-w-0 max-w-5xl self-end">
            <h1 className="max-w-4xl font-display text-6xl leading-[0.86] text-foreground md:text-8xl xl:text-9xl">
              Stewardship Network
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-foreground/84 md:text-xl">
              A combined About and People page that starts with purpose, then
              shows how the team, advisors, board, partners, and donors support
              work across the atoll.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <Card className="rounded-md backdrop-blur-md" style={lagoonVars}>
                <CardHeader>
                  <CardTitle>Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {missionStatement}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-md backdrop-blur-md" style={lagoonVars}>
                <CardHeader>
                  <CardTitle>Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {visionStatement}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <StewardshipMap />
        </div>
      </section>

      <section
        className="bg-background px-5 py-14 text-foreground md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_minmax(0,1fr)] lg:items-start">
            <div>
              <h2 className="font-display text-5xl leading-none md:text-6xl">
                The people behind the stewardship
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                This version turns the staff directory into a stewardship map:
                local team, advisors, board, partners, and donors all connected
                to programs people can support, learn from, or join.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {networkGroups.map((group) => (
                <NetworkGroupCard key={group.title} group={group} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="programs"
        className="relative overflow-hidden bg-background px-5 py-20 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-primary">
                <NetworkIcon aria-hidden="true" />
                <p className="font-mono text-xs uppercase">Programs as coordinates</p>
              </div>
              <h2 className="mt-4 max-w-4xl font-display text-5xl leading-none md:text-7xl">
                The work is the map.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {programClusters.map((program) => (
                <Button key={program.id} asChild variant="outline" size="sm">
                  <a href={`#${program.id}`}>{program.title}</a>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {programClusters.map((program) => (
              <ProgramClusterCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-background px-5 py-20 text-foreground md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.38fr_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-5xl leading-none md:text-6xl">
              People connected to the work
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Each profile shows what a person brings to Tetiaroa, which
              programs they support, and how their work connects to the
              atoll&apos;s resilience.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge variant="secondary">Expertise</Badge>
              <Badge variant="secondary">Related projects</Badge>
              <Badge variant="secondary">Profile depth</Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stewards.map((profile) => (
              <StewardCard key={profile.person.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-20 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,0.5fr)] lg:items-start">
          <ProfileDepthModel />

          <Card className="rounded-md" style={lagoonVars}>
            <CardHeader>
              <CardTitle>Profile pages become richer</CardTitle>
              <CardDescription>
                The directory becomes an archive of people, field context, and
                linked work.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Separator />
              {[
                "Bio with current role, background, and relationship to place",
                "Edited pull quote or field note from the person",
                "Linked projects, publications, news, and program updates",
                "Contact or social links only where they are useful and appropriate",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <a href="https://www.tetiaroasociety.org/people">
                  Compare current profiles
                  <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section
        className="bg-background px-5 py-20 text-foreground md:px-8 lg:px-12"
        style={paperVars}
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.42fr_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-5xl leading-none md:text-6xl">
              Partners and supporters
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Partners and donors are part of the stewardship network. Their
              support helps shape what the team can observe, teach, restore, and
              protect.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.52fr)]">
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>Partners</CardTitle>
                <CardDescription>
                  A visible collaboration layer around Tetiaroa.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {partners.map((partner) => (
                  <Badge key={partner} variant="outline">
                    {partner}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>Donors</CardTitle>
                <CardDescription>
                  The support base behind long-term stewardship.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {donorTypes.map((donorType) => (
                  <Badge key={donorType} variant="secondary">
                    {donorType}
                  </Badge>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild size="sm">
                  <a href="https://www.tetiaroasociety.org/donate">
                    Support the network
                    <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
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
                Stewardship made visible: people, programs, partners, and
                support connected around one island system.
              </p>
            </div>
            <FooterLinks
              title="Compare"
              links={[
                { href: "/people-option-1", label: "Option 1" },
                { href: "/people-option-2", label: "Option 2" },
                { href: "/people-option-3", label: "Stewardship Network" },
              ]}
            />
            <FooterLinks
              title="Explore"
              links={[
                { href: "/", label: "Homepage" },
                {
                  href: "https://www.tetiaroasociety.org/people",
                  label: "Current people page",
                },
                {
                  href: "https://www.tetiaroasociety.org/donate",
                  label: "Donate",
                },
              ]}
            />
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs uppercase text-primary">Page model</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Mission, people, partners, and donors are presented as one
                stewardship network.
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
          <p className="pt-6 text-xs text-muted-foreground">
            Proposal 3: Stewardship Network
          </p>
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
        <Link
          href="/people-option-1"
          className="transition hover:text-foreground max-[650px]:hidden"
        >
          Option 1
        </Link>
        <Link
          href="/people-option-2"
          className="transition hover:text-foreground max-[560px]:hidden"
        >
          Option 2
        </Link>
        <a
          href="#programs"
          className="transition hover:text-foreground max-[480px]:hidden"
        >
          Network
        </a>
        <Button asChild size="sm">
          <a href="https://www.tetiaroasociety.org/donate">Donate</a>
        </Button>
      </div>
    </nav>
  );
}

function StewardshipMap() {
  const mapNodes = [
    {
      label: "Local Team",
      detail: `${localTeam.length} people`,
      className: "left-[5%] top-[44%]",
    },
    {
      label: "Scientific Advisors",
      detail: `${scientificAdvisors.length} advisors`,
      className: "right-[5%] top-[23%]",
    },
    {
      label: "Board",
      detail: `${board.length} directors`,
      className: "right-[7%] bottom-[17%]",
    },
    {
      label: "Partners",
      detail: "research + action",
      className: "left-[8%] bottom-[15%]",
    },
    {
      label: "Donors",
      detail: "capacity",
      className: "left-[38%] top-[6%]",
    },
  ];

  return (
    <div className="self-end rounded-md border border-border bg-card/72 p-4 shadow-2xl shadow-black/20 backdrop-blur-md md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-primary">
            Atoll / program network
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none">
            The work connects the people.
          </h2>
        </div>
        <CompassIcon className="text-primary" aria-hidden="true" />
      </div>

      <div className="relative mt-5 min-h-[330px] overflow-hidden rounded-md border border-border bg-[linear-gradient(180deg,rgb(143_201_201/.12),rgb(244_241_234/.04)_34%,rgb(7_16_14/.46)),linear-gradient(90deg,rgb(226_74_43/.12),transparent_42%,rgb(217_206_175/.12))] md:min-h-[430px]">
        <svg
          className="absolute inset-0 size-full text-primary/44"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M12 48 C 22 18, 62 12, 84 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M84 30 C 98 52, 78 78, 56 78"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M12 48 C 18 74, 35 86, 56 78"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M50 16 C 46 32, 48 56, 55 76"
            fill="none"
            stroke="currentColor"
            strokeDasharray="1.5 2.5"
            strokeWidth="0.5"
          />
        </svg>

        <div
          className="absolute left-1/2 top-1/2 h-[38%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-primary/50 bg-[linear-gradient(135deg,rgb(31_107_110/.34),rgb(143_201_201/.08)_55%,rgb(217_206_175/.22))] shadow-inner shadow-black/30"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-1/2 h-[22%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-primary/45 bg-background/60"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-1/2 h-px w-[74%] -translate-x-1/2 bg-primary/32"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-[13%] h-[74%] w-px bg-primary/28"
          aria-hidden="true"
        />

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <Badge variant="secondary">Tetiaroa</Badge>
          <p className="mt-3 max-w-40 text-xs leading-5 text-muted-foreground">
            Programs, people, and support connected across one island system.
          </p>
        </div>

        {mapNodes.map((node) => (
          <div
            key={node.label}
            className={`absolute ${node.className} hidden max-w-36 rounded-md border border-border bg-background/82 p-3 shadow-lg shadow-black/20 backdrop-blur-sm md:block`}
          >
            <p className="text-sm font-semibold text-foreground">{node.label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {node.detail}
            </p>
          </div>
        ))}

        <div className="absolute bottom-4 right-4 flex flex-col gap-2 rounded-md border border-border bg-background/72 p-3 text-xs text-muted-foreground backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <WavesIcon aria-hidden="true" />
            <span>depth-based network</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioTowerIcon aria-hidden="true" />
            <span>program signals</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:hidden">
        {mapNodes.map((node) => (
          <div
            key={node.label}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/62 p-3 text-sm"
          >
            <span className="font-medium text-foreground">{node.label}</span>
            <span className="text-muted-foreground">{node.detail}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {stewardshipActions.map((action) => (
          <div key={action} className="flex gap-3 text-sm text-muted-foreground">
            <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
            <p className="leading-6">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkGroupCard({ group }: { group: NetworkGroup }) {
  const Icon = group.icon;

  return (
    <Card className="rounded-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Icon className="text-primary" aria-hidden="true" />
          <Badge variant="secondary">{group.count}</Badge>
        </div>
        <CardTitle>{group.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{group.summary}</p>
      </CardContent>
    </Card>
  );
}

function ProgramClusterCard({ program }: { program: ProgramCluster }) {
  const Icon = program.icon;

  return (
    <Card id={program.id} className="scroll-mt-24 rounded-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Icon className="text-primary" aria-hidden="true" />
          <Badge variant="outline">{program.depth}</Badge>
        </div>
        <CardTitle>{program.title}</CardTitle>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {program.themes.map((theme) => (
            <Badge key={theme} variant="secondary">
              {theme}
            </Badge>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          {program.connected.map((entry) => (
            <PersonMiniRow key={entry.id} person={entry} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PersonMiniRow({ person: entry }: { person: Person }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
      <Avatar size="sm">
        <AvatarImage src={entry.image} alt={entry.name} />
        <AvatarFallback>{initials(entry.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{entry.name}</p>
        <p className="truncate text-xs text-muted-foreground">{entry.role}</p>
      </div>
    </div>
  );
}

function StewardCard({ profile }: { profile: StewardProfile }) {
  const entry = profile.person;

  return (
    <Card className="rounded-md">
      <Image
        src={entry.image}
        alt={entry.name}
        width={640}
        height={640}
        loading="eager"
        sizes="(min-width: 1280px) 24vw, (min-width: 768px) 42vw, 90vw"
        className="aspect-[4/3] w-full object-cover"
      />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{entry.name}</CardTitle>
            <CardDescription>{entry.role}</CardDescription>
          </div>
          <Badge variant="secondary">{profile.expertise}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm leading-6 text-muted-foreground">
          {profile.roleInNetwork}
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.projects.map((project) => (
            <Badge key={project} variant="outline">
              {project}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <a href={entry.href}>
            View profile
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProfileDepthModel() {
  const entry = person("hinanui-robson");

  return (
    <Card className="rounded-md" style={lagoonVars}>
      <CardHeader>
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <Avatar className="size-24">
            <AvatarImage src={entry.image} alt={entry.name} />
            <AvatarFallback>{initials(entry.name)}</AvatarFallback>
          </Avatar>
          <div>
            <Badge variant="secondary">Profile depth model</Badge>
            <CardTitle className="mt-4 font-display text-4xl leading-none">
              {entry.name}
            </CardTitle>
            <CardDescription>{entry.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.55fr)]">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Bio</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {entry.summary} The richer profile version would add background,
            field context, current responsibilities, and the specific programs
            where their work changes outcomes.
          </p>

          <div className="mt-6 rounded-md border border-border bg-background/50 p-4">
            <p className="font-mono text-xs uppercase text-primary">Quote field</p>
            <p className="mt-3 text-base leading-7 text-foreground">
              A short edited firsthand line would live here, drawn from an
              interview rather than invented directory copy.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Linked work</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Research coordination", "Digital Twin", "Climate observations"].map(
                (item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Publications and news
            </h3>
            <div className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="https://www.tetiaroasociety.org/" className="hover:text-foreground">
                Research activity updates
              </a>
              <a href="https://www.tetiaroasociety.org/" className="hover:text-foreground">
                Ecostation field notes
              </a>
              <a href="https://www.tetiaroasociety.org/" className="hover:text-foreground">
                Education cohort stories
              </a>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Public contact, social, or profile links appear only when they are
              useful for this person&apos;s role.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs uppercase text-primary">{title}</p>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
