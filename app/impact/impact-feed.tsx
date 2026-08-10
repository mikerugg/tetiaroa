"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  FishIcon,
  HandshakeIcon,
  MicroscopeIcon,
  SearchIcon,
  WavesIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  type ImpactEntryType,
  type ImpactFeedItem,
  type ImpactLanguage,
} from "@/lib/impact/types";
import type { ImpactStats } from "@/lib/impact/stats";
import {
  formatOrder,
  topicDefinitions,
  type FormatFilter,
  type ImpactFeedFilters,
  type SortMode,
  type TopicFilter,
  type TopicValue,
} from "@/lib/impact/filters";

type ImpactFeedProps = {
  projects: ImpactFeedItem[];
  stats: ImpactStats;
  initialFilters: ImpactFeedFilters;
  locale?: ImpactLanguage;
};

const feedCopy: Record<
  ImpactLanguage,
  {
    title: string;
    feedHeading: string;
    countSeparator: string;
    entriesLabel: string;
    allFilter: string;
    filterAria: string;
    showTopic: (topic: string) => string;
    topics: Record<TopicValue, string>;
    formats: Record<ImpactEntryType, string>;
    allFormats: string;
    formatAria: string;
    searchPlaceholder: string;
    searchAria: string;
    clearFilters: string;
    sortAria: string;
    sortLabels: Record<SortMode, string>;
    emptyTitle: string;
    emptyDescription: string;
    stats: {
      heading: string;
      primary: {
        years: { label: string; description: (since: number) => string };
        projects: { label: string; description: string };
        species: { label: string; description: string };
        partners: { label: string; description: string };
      };
      secondary: {
        entries: string;
        updatedThisYear: string;
        profiles: string;
        reports: string;
        films: string;
      };
    };
  }
> = {
  en: {
    title: "Impact Feed",
    feedHeading: "The Impact Feed",
    countSeparator: "of",
    entriesLabel: "entries",
    allFilter: "All",
    filterAria: "Filter impact entries by topic",
    showTopic: (topic) => `Show ${topic} impact entries`,
    topics: {
      conservation: "Conservation",
      research: "Research",
      wildlife: "Wildlife",
      education: "Education",
      "global-impact": "Global impact",
    },
    formats: {
      Project: "Projects",
      Guide: "Nature guides",
      Profile: "Profiles",
      Newsletter: "Newsletters",
      Video: "Films & videos",
      Report: "Reports",
      News: "News",
      Partner: "Partners",
      Article: "Articles",
      "Project Update": "Project updates",
    },
    allFormats: "All formats",
    formatAria: "Filter impact entries by format",
    searchPlaceholder: "Search the archive",
    searchAria: "Search impact entries",
    clearFilters: "Clear filters",
    sortAria: "Sort impact entries",
    sortLabels: {
      latest: "Latest",
      oldest: "Oldest",
      az: "A-Z",
    },
    emptyTitle: "No entries found",
    emptyDescription:
      "No entries match this combination. Try a different search or filter.",
    stats: {
      heading: "Tetiaroa Society's Impact",
      primary: {
        years: {
          label: "Years of fieldwork",
          description: (since) => `Continuous science on the atoll since ${since}`,
        },
        projects: {
          label: "Research projects",
          description: "From coral nurseries to seabird recovery",
        },
        species: {
          label: "Species & habitats",
          description: "Documented in a living guide to the atoll",
        },
        partners: {
          label: "Partner institutions",
          description: "Universities, labs, and NGOs worldwide",
        },
      },
      secondary: {
        entries: "Impact entries",
        updatedThisYear: "Updated this year",
        profiles: "People profiled",
        reports: "Published reports",
        films: "Films & videos",
      },
    },
  },
  fr: {
    title: "Fil d'impact",
    feedHeading: "Le fil d'impact",
    countSeparator: "sur",
    entriesLabel: "entrées",
    allFilter: "Tous",
    filterAria: "Filtrer les entrées d'impact par thème",
    showTopic: (topic) => `Afficher les entrées ${topic}`,
    topics: {
      conservation: "Conservation",
      research: "Recherche",
      wildlife: "Faune",
      education: "Éducation",
      "global-impact": "Impact global",
    },
    formats: {
      Project: "Projets",
      Guide: "Guides nature",
      Profile: "Portraits",
      Newsletter: "Newsletters",
      Video: "Films et vidéos",
      Report: "Rapports",
      News: "Actualités",
      Partner: "Partenaires",
      Article: "Articles",
      "Project Update": "Suivis de projet",
    },
    allFormats: "Tous les formats",
    formatAria: "Filtrer les entrées d'impact par format",
    searchPlaceholder: "Rechercher dans les archives",
    searchAria: "Rechercher des entrées d'impact",
    clearFilters: "Effacer les filtres",
    sortAria: "Trier les entrées d'impact",
    sortLabels: {
      latest: "Plus récent",
      oldest: "Plus ancien",
      az: "A-Z",
    },
    emptyTitle: "Aucune entrée trouvée",
    emptyDescription:
      "Aucune entrée ne correspond à cette combinaison. Essayez une autre recherche ou un autre filtre.",
    stats: {
      heading: "L'impact de Tetiaroa Society",
      primary: {
        years: {
          label: "Années de terrain",
          description: (since) =>
            `Une présence scientifique continue depuis ${since}`,
        },
        projects: {
          label: "Projets de recherche",
          description: "Des pépinières de corail au retour des oiseaux marins",
        },
        species: {
          label: "Espèces et habitats",
          description: "Documentés dans un guide vivant de l'atoll",
        },
        partners: {
          label: "Institutions partenaires",
          description: "Universités, laboratoires et ONG du monde entier",
        },
      },
      secondary: {
        entries: "Entrées d'impact",
        updatedThisYear: "Mises à jour cette année",
        profiles: "Portraits publiés",
        reports: "Rapports publiés",
        films: "Films et vidéos",
      },
    },
  },
};

function formatDate(value: string, locale: ImpactLanguage) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function projectMatchesTopic(project: ImpactFeedItem, topic: TopicFilter) {
  if (topic === "all") {
    return true;
  }

  const definition = topicDefinitions.find((entry) => entry.value === topic);

  return Boolean(
    definition?.categories.some(
      (category) =>
        project.category === category ||
        project.secondaryCategories.includes(category),
    ),
  );
}

function projectMatchesFormat(project: ImpactFeedItem, format: FormatFilter) {
  if (format === "all") {
    return project.entryType !== "Profile";
  }

  return project.entryType === format;
}

function projectMatchesQuery(project: ImpactFeedItem, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  return [
    project.title,
    project.summary,
    project.location,
    project.metric,
    ...project.tags,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

function sortProjects(projects: ImpactFeedItem[], sortMode: SortMode) {
  return [...projects].sort((left, right) => {
    if (sortMode === "az") {
      return left.title.localeCompare(right.title);
    }

    const leftDate = new Date(left.latestUpdate).getTime();
    const rightDate = new Date(right.latestUpdate).getTime();

    return sortMode === "latest" ? rightDate - leftDate : leftDate - rightDate;
  });
}

export function ImpactFeed({
  projects,
  stats,
  initialFilters,
  locale = "en",
}: ImpactFeedProps) {
  const [topic, setTopic] = useState<TopicFilter>(initialFilters.topic);
  const [format, setFormat] = useState<FormatFilter>(initialFilters.format);
  const [query, setQuery] = useState(initialFilters.query);
  const [sortMode, setSortMode] = useState<SortMode>(initialFilters.sort);
  const copy = feedCopy[locale];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (key: string, value: string | null) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("topic", topic === "all" ? null : topic);
    setOrDelete("format", format === "all" ? null : format);
    setOrDelete("q", query.trim() || null);
    setOrDelete("sort", sortMode === "latest" ? null : sortMode);

    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}`,
    );
  }, [topic, format, query, sortMode]);

  const topicOptions = useMemo(() => {
    return topicDefinitions
      .map((definition) => ({
        value: definition.value,
        label: copy.topics[definition.value],
        count: projects.filter((project) =>
          projectMatchesTopic(project, definition.value),
        ).length,
      }))
      .filter((option) => option.count > 0);
  }, [copy.topics, projects]);

  const formatOptions = useMemo(() => {
    const scopedProjects = projects.filter((project) =>
      projectMatchesTopic(project, topic),
    );

    return formatOrder
      .map((entryType) => ({
        value: entryType,
        label: copy.formats[entryType],
        count: scopedProjects.filter(
          (project) => project.entryType === entryType,
        ).length,
      }))
      .filter((option) => option.count > 0);
  }, [copy.formats, projects, topic]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortProjects(
      projects.filter(
        (project) =>
          projectMatchesTopic(project, topic) &&
          projectMatchesFormat(project, format) &&
          projectMatchesQuery(project, normalizedQuery),
      ),
      sortMode,
    );
  }, [format, projects, query, sortMode, topic]);

  const hasActiveFilters =
    topic !== "all" || format !== "all" || query.trim().length > 0;

  const clearFilters = () => {
    setTopic("all");
    setFormat("all");
    setQuery("");
  };

  const primaryStats = [
    {
      value: stats.yearsOfFieldwork,
      label: copy.stats.primary.years.label,
      description: copy.stats.primary.years.description(stats.fieldworkSince),
      icon: WavesIcon,
    },
    {
      value: stats.researchProjects,
      label: copy.stats.primary.projects.label,
      description: copy.stats.primary.projects.description,
      icon: MicroscopeIcon,
    },
    {
      value: stats.speciesDocumented,
      label: copy.stats.primary.species.label,
      description: copy.stats.primary.species.description,
      icon: FishIcon,
    },
    {
      value: stats.partnerInstitutions,
      label: copy.stats.primary.partners.label,
      description: copy.stats.primary.partners.description,
      icon: HandshakeIcon,
      suffix: "+",
    },
  ] satisfies Array<{
    value: number;
    label: string;
    description: string;
    icon: LucideIcon;
    suffix?: string;
  }>;

  const secondaryStats: Array<{
    value: number;
    label: string;
    suffix?: string;
  }> = [
    { value: stats.totalEntries, label: copy.stats.secondary.entries },
    { value: stats.updatedThisYear, label: copy.stats.secondary.updatedThisYear },
    { value: stats.peopleProfiled, label: copy.stats.secondary.profiles },
    { value: stats.publishedReports, label: copy.stats.secondary.reports },
    { value: stats.films, label: copy.stats.secondary.films, suffix: "+" },
  ];

  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border pt-14 md:pt-16">
        <Image
          src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=85&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-55"
          priority
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.40)_0%,rgb(7_16_14/.72)_74%,var(--background)_100%),linear-gradient(90deg,var(--background)_0%,rgb(7_16_14/.58)_45%,rgb(7_16_14/.22)_100%)]"
        />
        <div className="relative mx-auto max-w-[1540px] px-5 py-10 sm:px-8 md:px-9 lg:px-10">
          <h1 className="max-w-4xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
            {copy.title}
          </h1>
        </div>
      </section>

      <section
        aria-label={copy.stats.heading}
        className="border-b border-border bg-card/70 backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 md:px-9 lg:px-10 lg:py-10">
          <h2 className="font-display text-3xl font-normal leading-tight">
            {copy.stats.heading}
          </h2>

          <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-7 lg:grid-cols-4 lg:gap-0">
            {primaryStats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col gap-2.5 sm:gap-3 lg:border-l lg:border-border lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="grid size-10 place-items-center rounded-sm bg-secondary text-secondary-foreground sm:size-11">
                  <stat.icon aria-hidden="true" />
                </div>
                <div className="font-display text-4xl leading-none text-foreground sm:text-5xl xl:text-6xl">
                  <CountUpValue
                    value={stat.value}
                    suffix={stat.suffix}
                    delay={index * 120}
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/90 sm:text-[11px] sm:tracking-[0.16em]">
                  {stat.label}
                </div>
                <p className="text-sm leading-6 text-muted-foreground max-[420px]:text-[13px] max-[420px]:leading-5">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-9 gap-y-4 border-t border-border pt-6">
            {secondaryStats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl leading-none text-foreground">
                  <CountUpValue value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1540px] px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <section className="min-w-0" aria-labelledby="feed-heading">
          <div className="flex flex-col gap-4 pb-4">
            <div className="relative w-full md:max-w-md">
              <SearchIcon
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchAria}
                className="h-11 rounded-sm pl-9 font-mono text-xs"
              />
            </div>

            <div className="flex flex-col gap-3 min-[1240px]:flex-row min-[1240px]:items-center min-[1240px]:justify-between">
              <ToggleGroup
                type="single"
                value={topic}
                onValueChange={(value) => {
                  const nextTopic = (value || "all") as TopicFilter;
                  setTopic(nextTopic);

                  if (
                    format !== "all" &&
                    !projects.some(
                      (project) =>
                        project.entryType === format &&
                        projectMatchesTopic(project, nextTopic),
                    )
                  ) {
                    setFormat("all");
                  }
                }}
                variant="outline"
                size="sm"
                spacing={2}
                className="flex flex-wrap justify-start gap-2"
                aria-label={copy.filterAria}
              >
                <ToggleGroupItem
                  value="all"
                  className="h-11 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-4"
                  aria-label={copy.showTopic(copy.allFilter)}
                >
                  {copy.allFilter}
                </ToggleGroupItem>
                {topicOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="h-11 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-4"
                    aria-label={copy.showTopic(option.label)}
                  >
                    {option.label}
                    <span className="text-muted-foreground">{option.count}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-11 rounded-sm font-mono text-[11px] uppercase tracking-[0.12em]"
                    onClick={clearFilters}
                  >
                    <XIcon data-icon="inline-start" aria-hidden="true" />
                    {copy.clearFilters}
                  </Button>
                ) : null}
                <Select
                  value={format}
                  onValueChange={(value) => setFormat(value as FormatFilter)}
                >
                  <SelectTrigger
                    className="min-h-11 min-w-44 rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                    aria-label={copy.formatAria}
                  >
                    <SelectValue placeholder={copy.allFormats} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectItem value="all">{copy.allFormats}</SelectItem>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                          <span className="text-muted-foreground">
                            {option.count}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={sortMode}
                  onValueChange={(value) => setSortMode(value as SortMode)}
                >
                  <SelectTrigger
                    className="min-h-11 min-w-36 rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                    aria-label={copy.sortAria}
                  >
                    <SelectValue placeholder={copy.sortLabels.latest} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {(Object.keys(copy.sortLabels) as SortMode[]).map(
                        (value) => (
                          <SelectItem key={value} value={value}>
                            {copy.sortLabels[value]}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card
            id="feed"
            className="mt-4 rounded-md border-border bg-card/70 py-0 shadow-2xl backdrop-blur-md"
          >
            <CardHeader className="border-b border-border px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <CardTitle
                  id="feed-heading"
                  className="font-display text-3xl font-normal"
                >
                  {copy.feedHeading}
                </CardTitle>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {visibleProjects.length} {copy.countSeparator} {projects.length}{" "}
                  {copy.entriesLabel}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 px-0 py-0">
              {visibleProjects.length ? (
                visibleProjects.map((project, index) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    priority={index < 2}
                    locale={locale}
                  />
                ))
              ) : (
                <Empty className="min-h-72 rounded-none border-0">
                  <EmptyHeader>
                    <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
                    <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

const COUNT_UP_DURATION_MS = 1400;

function CountUpValue({
  value,
  suffix,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let timeout = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) {
          return;
        }

        hasAnimated.current = true;
        observer.disconnect();

        timeout = window.setTimeout(() => {
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min(
              (now - start) / COUNT_UP_DURATION_MS,
              1,
            );
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));

            if (progress < 1) {
              frame = requestAnimationFrame(tick);
            }
          };

          setDisplay(0);
          frame = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [delay, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function ProjectRow({
  project,
  priority,
  locale,
}: {
  project: ImpactFeedItem;
  priority: boolean;
  locale: ImpactLanguage;
}) {
  const titleId = `impact-entry-${project.slug}`;

  return (
    <article className="border-b border-border last:border-b-0">
      <Link
        href={project.href}
        aria-labelledby={titleId}
        className="group grid outline-none transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 md:grid-cols-[minmax(260px,40%)_minmax(0,1fr)]"
      >
        <div className="relative min-h-60 overflow-hidden bg-muted md:min-h-56">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
            sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1200px) 40vw, 470px"
          />
        </div>

        <div className="flex min-w-0 flex-col px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Badge variant="secondary" className="h-auto font-mono">
              {project.category}
            </Badge>
            <Badge variant="outline" className="h-auto font-mono">
              {project.entryType}
            </Badge>
            <span className="text-muted-foreground" aria-hidden="true">
              /
            </span>
            <time
              className="text-muted-foreground"
              dateTime={project.latestUpdate}
            >
              {formatDate(project.latestUpdate, locale)}
            </time>
          </div>

          <h2
            id={titleId}
            className="mt-4 max-w-3xl font-display text-3xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl"
          >
            {project.title}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="h-auto">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:mt-auto sm:flex-row sm:items-end sm:justify-between sm:pt-6">
            <div>
              <p className="text-sm text-foreground/82">
                {project.metric} / {project.location}
              </p>
            </div>
            <span className="inline-flex h-auto justify-start gap-1.5 p-0 font-mono text-sm font-medium text-primary underline-offset-4 group-hover:underline">
              {project.actionLabel}
              <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
