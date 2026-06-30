import type { CSSProperties } from "react";
import Image from "next/image";
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
import { homeCopies, type HomeLocale } from "../home-copy";
import { ENGLISH_TEAM_PATH, FRENCH_TEAM_PATH } from "../language-links";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { people, type Person } from "../people-option-1/people-data";

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
  members: TeamMember[];
};

type TeamMember = Omit<Person, "image" | "href"> & {
  image?: string;
  href?: string;
};

type TeamGroupCopy = Omit<TeamGroup, "members">;

type SpecialistGroup = {
  title: string;
  icon: LucideIcon;
  copy: string;
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

type TeamPageCopy = {
  heroImageAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  introTitle: string;
  introDescription: string;
  meetCta: string;
  specialistsTitle: string;
  teamTitle: string;
  supportTitle: string;
  supportDescription: string;
  viewProfileLabel: string;
  specialistGroups: SpecialistGroup[];
  teamGroups: TeamGroupCopy[];
  supportGroups: SupportGroup[];
  supportProfiles: SupportProfile[];
};

export type TeamLocale = HomeLocale;

const giuliaMouly: TeamMember = {
  id: "giulia-mouly",
  name: "Giulia Mouly",
  role: "Director of Operations at the Bailey Field Station",
  cohort: "On-island team",
  image:
    "https://www.tetiaroasociety.org/sites/default/files/styles/square_400/public/2026-06/Giulia%20Mouly%20Portrait.jpeg.webp?itok=xj3z1wo5",
  href: "https://www.tetiaroasociety.org/giulia-mouly",
  summary:
    "Connects people, place, and purpose through field station operations, hospitality, partnerships, and sustainability.",
  focus: ["Operations", "Bailey Field Station", "Partnerships"],
};

const jaynaDevore: TeamMember = {
  id: "jayna-devore",
  name: "Dr. Jayna DeVore",
  role: "Director of Conservation, Science & Education",
  cohort: "On-island team",
  image:
    "https://www.tetiaroasociety.org/sites/default/files/styles/square_400/public/2026-06/Jayna%20and%20bird%20sq_0.jpg.webp?itok=twDvGrfn",
  href: "https://www.tetiaroasociety.org/dr-jayna-devore",
  summary: "Bio forthcoming.",
  focus: ["Leadership", "Conservation", "Science", "Education"],
};

const executiveTeam: TeamMember[] = [
  person("tj-tate"),
  {
    id: "julien-castel",
    name: "Julien Castel",
    role: "Chief Financial Officer",
    cohort: "On-island team",
    image:
      "https://www.tetiaroasociety.org/sites/default/files/styles/square_400/public/2026-06/Julien%20Castel%20Portrait.jpeg.webp?itok=IpW1lfQo",
    href: "https://www.tetiaroasociety.org/julien-castel",
    summary: "Bio forthcoming.",
    focus: ["Leadership", "Finance"],
  },
];
const atollOpsExcludedIds = new Set([
  "tj-tate",
  "hinanui-robson",
  "hereiti-lelong",
  "ngnahina-moua",
  "tihoni-maire",
]);
const atollOpsTeam: TeamMember[] = [
  giuliaMouly,
  ...people.filter(
    (entry) =>
      entry.cohort === "On-island team" &&
      !atollOpsExcludedIds.has(entry.id) &&
      entry.role !== "Nature Guide",
  ),
];
const natureGuides = people.filter(
  (entry) => entry.cohort === "On-island team" && entry.role === "Nature Guide",
);
const scienceConservationTeam: TeamMember[] = [
  jaynaDevore,
  person("hinanui-robson"),
];
const commsCultureTeam: TeamMember[] = [
  person("hereiti-lelong"),
  {
    ...person("ngnahina-moua"),
    role: "Education & Cultural Coordinator",
  },
  {
    ...person("tihoni-maire"),
    role: "Chief Naturalist",
  },
  ...natureGuides,
];
const boardMembers = people.filter((entry) => entry.cohort === "Board of Directors");
const scientificAdvisors = people.filter(
  (entry) => entry.cohort === "Scientific Advisory Board",
);

const teamMembersByGroupId: Record<string, TeamMember[]> = {
  "executive-team": executiveTeam,
  "society-team": atollOpsTeam,
  "science-conservation-team": scienceConservationTeam,
  "comms-culture-team": commsCultureTeam,
  board: boardMembers,
  "scientific-advisory-board": scientificAdvisors,
};

const roleTranslations: Record<string, string> = {
  "Chief Executive Officer": "Direction générale",
  "Chief Financial Officer": "Direction financière",
  "Director of Conservation, Science & Education":
    "Direction conservation, science et éducation",
  "Director of Operations at the Bailey Field Station":
    "Direction des opérations de la Bailey Field Station",
  "Chief Naturalist": "Naturaliste en chef",
  "Scientific Activities Coordinator": "Coordination des activités scientifiques",
  "Head Guide": "Responsable des guides",
  "Ecostation Manager": "Responsable de l'Écostation",
  "Communications Manager": "Responsable des communications",
  "Education & Cultural Coordinator":
    "Coordination des programmes éducatifs et culturels",
  "Education and Cultural Programs Coordinator":
    "Coordination des programmes éducatifs et culturels",
  Ranger: "Garde nature",
  "Nature Guide": "Guide nature",
  "Dive Operations Manager": "Responsable des opérations de plongée",
  "Web Designer/Developer": "Design et développement web",
  "Board Member": "Membre du conseil d'administration",
  "Scientific Advisor": "Membre du conseil scientifique",
  "Scientific Advisor Emeritus": "Membre émérite du conseil scientifique",
};

const roleDisplayBreaks: Record<string, string> = {
  "Director of Conservation, Science & Education":
    "Director of Conservation\nScience & Education",
  "Director of Operations at the Bailey Field Station":
    "Director of Operations\nBailey Field Station",
  "Direction conservation, science et éducation":
    "Direction conservation\nscience et éducation",
  "Direction des opérations de la Bailey Field Station":
    "Direction des opérations\nBailey Field Station",
};

const teamPageCopies: Record<TeamLocale, TeamPageCopy> = {
  en: {
    heroImageAlt: "Tetiaroa Society team gathered at the field station",
    heroEyebrow: "Our team",
    heroTitle: "The people protecting Teti'aroa.",
    introTitle: "A team rooted in Conservation.",
    introDescription:
      "Tetiaroa Society brings together on-island staff, leadership, board members, scientific advisors, partners, and donors to care for the atoll and share what we learn.",
    meetCta: "Meet the team",
    specialistsTitle: "Many specialists, one team.",
    teamTitle: "The team.",
    supportTitle: "Partners and donors",
    supportDescription:
      "Organizations and supporters adding capacity, continuity, and conservation effort around the Society's work.",
    viewProfileLabel: "View profile",
    specialistGroups: [
      {
        title: "Atoll Ops Team",
        icon: BinocularsIcon,
        copy: "Station readiness, dive operations, field logistics, and the operating rhythm that keeps atoll work moving.",
      },
      {
        title: "Science & Conservation Team",
        icon: MicroscopeIcon,
        copy: "Research coordination, monitoring, ranger work, habitat care, and long-running conservation observation.",
      },
      {
        title: "Engagement & Culture Team",
        icon: HandshakeIcon,
        copy: "Guiding, education, cultural programs, communications, digital storytelling, and visitor learning.",
      },
      {
        title: "Executive Team",
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
    ],
    teamGroups: [
      {
        id: "executive-team",
        title: "Executive Team",
        icon: CompassIcon,
        summary:
          "The executive team sets priorities, supports staff, and keeps the Society focused on work that serves Tetiaroa over the long term.",
      },
      {
        id: "society-team",
        title: "Atoll Ops Team",
        icon: BinocularsIcon,
        summary:
          "The Atoll Ops Team keeps the field station, dive operations, logistics, and day-to-day atoll support moving.",
      },
      {
        id: "science-conservation-team",
        title: "Science & Conservation Team",
        icon: MicroscopeIcon,
        summary:
          "The Science & Conservation Team coordinates research, monitors field conditions, supports conservation work, and cares for the living systems of the atoll.",
      },
      {
        id: "comms-culture-team",
        title: "Engagement & Culture Team",
        icon: HandshakeIcon,
        summary:
          "The Engagement & Culture Team carries the Society's public voice, education programs, cultural interpretation, visitor learning, and digital storytelling.",
      },
      {
        id: "board",
        title: "Board of Directors",
        icon: LandmarkIcon,
        summary:
          "The board guides the Society's mission, governance, resources, and long-term stability.",
      },
      {
        id: "scientific-advisory-board",
        title: "Scientific Advisory Board",
        icon: MicroscopeIcon,
        summary:
          "Scientists and other experts advise research priorities, strengthen methods, and help connect field observations to wider conservation knowledge.",
      },
    ],
    supportGroups: [
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
    ],
    supportProfiles: [
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
    ],
  },
  fr: {
    heroImageAlt: "Équipe de Tetiaroa Society réunie à la station de terrain",
    heroEyebrow: "Notre équipe",
    heroTitle: "Les personnes qui veillent sur Teti'aroa.",
    introTitle: "Une équipe enracinée dans la conservation.",
    introDescription:
      "Tetiaroa Society réunit l'équipe sur l'atoll, la direction, le conseil d'administration, des conseillers scientifiques, des partenaires et des donateurs pour prendre soin de l'atoll et partager ce que le terrain nous apprend.",
    meetCta: "Rencontrer l'équipe",
    specialistsTitle: "Plusieurs expertises, une seule équipe.",
    teamTitle: "L'équipe.",
    supportTitle: "Partenaires et donateurs",
    supportDescription:
      "Des organisations et des soutiens ajoutent capacité, continuité et énergie de conservation autour du travail de la Society.",
    viewProfileLabel: "Voir le profil",
    specialistGroups: [
      {
        title: "Atoll Ops Team",
        icon: BinocularsIcon,
        copy: "Préparation de la station, opérations de plongée, logistique de terrain et rythme opérationnel de l'atoll.",
      },
      {
        title: "Science & Conservation Team",
        icon: MicroscopeIcon,
        copy: "Coordination scientifique, suivi, travail des gardes nature, soin des habitats et observation au long cours.",
      },
      {
        title: "Engagement & Culture Team",
        icon: HandshakeIcon,
        copy: "Guidage, éducation, programmes culturels, communications, récit numérique et apprentissage des visiteurs.",
      },
      {
        title: "Direction",
        icon: CompassIcon,
        copy: "Stratégie, soutien à l'équipe, partenariats et cap à long terme de la Society.",
      },
      {
        title: "Conseil d'administration",
        icon: LandmarkIcon,
        copy: "Garde de la mission, gouvernance, ressources et stabilité dans la durée.",
      },
      {
        title: "Conseil scientifique",
        icon: MicroscopeIcon,
        copy: "Conseils scientifiques, méthodes plus solides, lecture du terrain et savoirs de conservation.",
      },
      {
        title: "Partenaires",
        icon: HandshakeIcon,
        copy: "Capacités de recherche, formation, outils, accès et soutien concret.",
      },
      {
        title: "Donateurs",
        icon: CircleDollarSignIcon,
        copy: "Le travail patient : opérations de terrain, éducation, suivi et recherche.",
      },
    ],
    teamGroups: [
      {
        id: "executive-team",
        title: "Direction",
        icon: CompassIcon,
        summary:
          "La direction fixe les priorités, soutient l'équipe et garde la Society concentrée sur ce qui sert Teti'aroa dans la durée.",
      },
      {
        id: "society-team",
        title: "Atoll Ops Team",
        icon: BinocularsIcon,
        summary:
          "L'Atoll Ops Team garde la station de terrain, les opérations de plongée, la logistique et le soutien quotidien de l'atoll en mouvement.",
      },
      {
        id: "science-conservation-team",
        title: "Science & Conservation Team",
        icon: MicroscopeIcon,
        summary:
          "La Science & Conservation Team coordonne la recherche, suit les conditions de terrain, soutient la conservation et prend soin des systèmes vivants de l'atoll.",
      },
      {
        id: "comms-culture-team",
        title: "Engagement & Culture Team",
        icon: HandshakeIcon,
        summary:
          "L'Engagement & Culture Team porte la voix publique de la Society, les programmes éducatifs, l'interprétation culturelle, l'apprentissage des visiteurs et le récit numérique.",
      },
      {
        id: "board",
        title: "Conseil d'administration",
        icon: LandmarkIcon,
        summary:
          "Le conseil accompagne la mission, la gouvernance, les ressources et la stabilité à long terme de la Society.",
      },
      {
        id: "scientific-advisory-board",
        title: "Conseil scientifique",
        icon: MicroscopeIcon,
        summary:
          "Des scientifiques et experts conseillent les priorités de recherche, renforcent les méthodes et relient les observations de terrain aux connaissances plus larges de la conservation.",
      },
    ],
    supportGroups: [
      {
        id: "partners",
        title: "Partenaires",
        icon: HandshakeIcon,
      },
      {
        id: "donors",
        title: "Donateurs",
        icon: CircleDollarSignIcon,
      },
    ],
    supportProfiles: [
      {
        id: "the-brando",
        name: "The Brando",
        abstract:
          "Partenaire sur l'atoll, au service des pratiques durables, de l'apprentissage des visiteurs et du travail de la Society à Teti'aroa.",
        logo: "The Brando",
        href: "https://thebrando.com/",
        actionLabel: "Visiter le site",
      },
      {
        id: "mission-blue",
        name: "Mission Blue",
        abstract:
          "Réseau de conservation de l'océan qui amplifie la visibilité de la protection marine et l'engagement du public.",
        logo: "Mission Blue",
        href: "https://missionblue.org/",
        actionLabel: "Visiter le site",
      },
      {
        id: "uc-berkeley",
        name: "UC Berkeley",
        abstract:
          "Partenaire de recherche apportant capacité scientifique, formation et apprentissage étudiant au travail de l'atoll.",
        logo: "Berkeley",
        logoDetail: "University of California",
        href: "https://www.berkeley.edu/",
        actionLabel: "Visiter le site",
      },
      {
        id: "woods-hole",
        name: "Woods Hole Oceanographic Institution",
        abstract:
          "Partenaire en sciences océaniques soutenant la recherche, les méthodes de terrain et le suivi des systèmes marins.",
        logo: "WHOI",
        logoDetail: "Woods Hole Oceanographic Institution",
        href: "https://www.whoi.edu/",
        actionLabel: "Visiter le site",
      },
      {
        id: "cnrs",
        name: "CNRS",
        abstract:
          "Institution de recherche apportant une profondeur scientifique en écologie, biodiversité et observation au long cours.",
        logo: "CNRS",
        href: "https://www.cnrs.fr/",
        actionLabel: "Visiter le site",
      },
      {
        id: "criobe",
        name: "CRIOBE",
        abstract:
          "Centre de recherche marine en Polynésie française reliant science récifale, étudiants et expertise de terrain.",
        logo: "CRIOBE",
        href: "https://www.criobe.pf/",
        actionLabel: "Visiter le site",
      },
      {
        id: "donors",
        name: "Donateurs",
        abstract:
          "Personnes, fondations, associations et entreprises qui financent conservation, recherche, éducation et soin quotidien.",
        logo: "Donateurs",
        logoDetail: "Personnes + institutions",
        href: "https://www.tetiaroasociety.org/donate",
        actionLabel: "Donner",
      },
    ],
  },
};

export function TeamPage({ locale = "en" }: { locale?: TeamLocale }) {
  const copy = teamPageCopies[locale];
  const teamGroups = getTeamGroups(locale);
  const toolbarCopy = getTeamToolbarCopy(locale);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopToolbar copy={toolbarCopy} />

      <section className="relative min-h-[88svh] overflow-hidden pt-14 sm:min-h-[92svh] md:pt-16">
        <Image
          src={heroImage}
          alt={copy.heroImageAlt}
          fill
          sizes="100vw"
          className="translate-x-[6%] scale-[1.14] object-cover"
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
                {copy.heroEyebrow}
              </p>
              <h1 className="mt-0 max-w-6xl font-depth text-5xl uppercase text-foreground sm:text-6xl md:text-8xl lg:text-9xl">
                {copy.heroTitle}
              </h1>
            </div>

            <Card className="rounded-md shadow-2xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="font-display text-2xl sm:text-3xl md:text-4xl">
                  {copy.introTitle}
                </CardTitle>
                <CardDescription className="text-sm leading-7">
                  {copy.introDescription}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" size="lg">
                  <a href="#team">
                    {copy.meetCta}
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
              {copy.specialistsTitle}
            </h2>
          </div>
          {copy.specialistGroups.map((item) => {
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
              {copy.teamTitle}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[...teamGroups, ...copy.supportGroups].map((group) => (
                <Button key={group.id} asChild variant="outline" size="sm">
                  <a href={`#${group.id}`}>{group.title}</a>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-14">
            {teamGroups.map((group) => (
              <TeamGroupSection
                key={group.id}
                group={group}
                locale={locale}
                viewProfileLabel={copy.viewProfileLabel}
              />
            ))}
            <SupportGroupsSection copy={copy} />
          </div>
        </div>
      </section>

      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}

function getTeamToolbarCopy(locale: TeamLocale) {
  return {
    ...homeCopies[locale].toolbar,
    teamHref: locale === "fr" ? FRENCH_TEAM_PATH : ENGLISH_TEAM_PATH,
    languageHref: locale === "fr" ? ENGLISH_TEAM_PATH : FRENCH_TEAM_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

function getTeamGroups(locale: TeamLocale): TeamGroup[] {
  return teamPageCopies[locale].teamGroups.map((group) => ({
    ...group,
    members: teamMembersByGroupId[group.id] ?? [],
  }));
}

function getRoleLabel(role: string, locale: TeamLocale) {
  if (locale === "en") {
    return roleDisplayBreaks[role] ?? role;
  }

  const translatedRole = roleTranslations[role] ?? role;

  return roleDisplayBreaks[translatedRole] ?? translatedRole;
}

function getInitials(name: string) {
  const cleanName = name.replace(/^Dr\.?\s+/i, "");
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "TS";
}

function TeamGroupSection({
  group,
  locale,
  viewProfileLabel,
}: {
  group: TeamGroup;
  locale: TeamLocale;
  viewProfileLabel: string;
}) {
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
          <TeamMemberCard
            key={entry.id}
            person={entry}
            role={getRoleLabel(entry.role, locale)}
            viewProfileLabel={viewProfileLabel}
          />
        ))}
      </div>
    </section>
  );
}

function SupportGroupsSection({ copy }: { copy: TeamPageCopy }) {
  return (
    <section
      id="partners"
      className="grid gap-5 scroll-mt-24 md:scroll-mt-28 lg:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      <Card className="rounded-md">
        <CardHeader>
          <HandshakeIcon className="text-primary" aria-hidden="true" />
          <CardTitle>{copy.supportTitle}</CardTitle>
          <CardDescription>{copy.supportDescription}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {copy.supportProfiles.map((profile) => (
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

function TeamMemberCard({
  person: entry,
  role,
  viewProfileLabel,
}: {
  person: TeamMember;
  role: string;
  viewProfileLabel: string;
}) {
  const initials = getInitials(entry.name);

  return (
    <Card size="sm" className="flex h-full flex-col overflow-hidden rounded-md">
      <div className="relative aspect-[4/3] bg-muted">
        {entry.image ? (
          <Image
            src={entry.image}
            alt={entry.name}
            fill
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1280px) 42vw, 280px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-popover text-secondary-foreground"
            aria-hidden="true"
          >
            <span className="font-display text-5xl">{initials}</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{entry.name}</CardTitle>
        <CardDescription className="whitespace-pre-line">{role}</CardDescription>
      </CardHeader>
      {entry.href ? (
        <CardFooter className="mt-auto">
          <Button asChild variant="link" size="sm" className="px-0">
            <a href={entry.href}>
              {viewProfileLabel}
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
