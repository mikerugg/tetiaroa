"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
  Globe2Icon,
  Layers3Icon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";
import {
  impactCategories,
  type ImpactCategory,
  type ImpactFeedItem,
  type ImpactLanguage,
} from "@/lib/impact/types";

type CategoryFilter = "All" | ImpactCategory;
type SortMode = "latest" | "oldest" | "az";

type ImpactFeedProps = {
  projects: ImpactFeedItem[];
  locale?: ImpactLanguage;
};

const filterOptions = ["All", ...impactCategories] as const;

const feedCopy: Record<
  ImpactLanguage,
  {
    title: string;
    intro: string;
    sideTitle: string;
    viewAll: string;
    feedHeading: string;
    countSeparator: string;
    entriesLabel: string;
    allFilter: string;
    filterAria: string;
    showCategory: (category: string) => string;
    sortBy: string;
    sortAria: string;
    sortLabels: Record<SortMode, string>;
    emptyTitle: string;
    emptyDescription: string;
    stats: {
      entries: string;
      updatedThisYear: string;
      categories: string;
      countries: string;
    };
  }
> = {
  en: {
    title: "Impact Feed",
    intro:
      "Follow the work as it changes: reef surveys, classroom days, biosecurity checks, and the patient recovery of an atoll.",
    sideTitle: "Tetiaroa's Impact",
    viewAll: "View all entries",
    feedHeading: "Field notes, projects, and updates",
    countSeparator: "of",
    entriesLabel: "entries",
    allFilter: "All",
    filterAria: "Filter impact entries by category",
    showCategory: (category) => `Show ${category} impact entries`,
    sortBy: "Sort by",
    sortAria: "Sort impact entries",
    sortLabels: {
      latest: "Latest",
      oldest: "Oldest",
      az: "A-Z",
    },
    emptyTitle: "No entries found",
    emptyDescription:
      "Try another category or sort mode. New archive entries will appear here after migration.",
    stats: {
      entries: "Impact entries",
      updatedThisYear: "Updated this year",
      categories: "Categories connected",
      countries: "Countries connected",
    },
  },
  fr: {
    title: "Fil d'impact",
    intro:
      "Suivez le travail au fil de son évolution : suivis récifaux, journées de classe, vigilance bio-sécurité et restauration patiente de l'atoll.",
    sideTitle: "L'impact de Tetiaroa",
    viewAll: "Voir toutes les entrées",
    feedHeading: "Notes de terrain, projets et actualités",
    countSeparator: "sur",
    entriesLabel: "entrées",
    allFilter: "Tous",
    filterAria: "Filtrer les entrées d'impact par catégorie",
    showCategory: (category) => `Afficher les entrées ${category}`,
    sortBy: "Trier par",
    sortAria: "Trier les entrées d'impact",
    sortLabels: {
      latest: "Plus récent",
      oldest: "Plus ancien",
      az: "A-Z",
    },
    emptyTitle: "Aucune entrée trouvée",
    emptyDescription:
      "Essayez une autre catégorie. Les entrées migrées apparaîtront ici après l'import.",
    stats: {
      entries: "Entrées d'impact",
      updatedThisYear: "Mises à jour cette année",
      categories: "Catégories reliées",
      countries: "Pays reliés",
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

function projectMatchesCategory(project: ImpactFeedItem, category: CategoryFilter) {
  return (
    category === "All" ||
    project.category === category ||
    project.secondaryCategories.includes(category)
  );
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

export function ImpactFeed({ projects, locale = "en" }: ImpactFeedProps) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const copy = feedCopy[locale];

  const visibleProjects = useMemo(() => {
    return sortProjects(
      projects.filter((project) => projectMatchesCategory(project, category)),
      sortMode,
    );
  }, [category, projects, sortMode]);

  const updatedThisYear = useMemo(() => {
    return projects.filter((project) => project.latestUpdate.startsWith("2026"))
      .length;
  }, [projects]);

  const connectedCategories = useMemo(() => {
    return new Set(
      projects.flatMap((project) => [
        project.category,
        ...project.secondaryCategories,
      ]),
    ).size;
  }, [projects]);

  const stats = [
    {
      label: copy.stats.entries,
      value: projects.length.toString(),
      icon: FolderOpenIcon,
    },
    {
      label: copy.stats.updatedThisYear,
      value: updatedThisYear.toString(),
      icon: CalendarDaysIcon,
    },
    {
      label: copy.stats.categories,
      value: connectedCategories.toString(),
      icon: Layers3Icon,
    },
    {
      label: copy.stats.countries,
      value: "18",
      icon: Globe2Icon,
    },
  ] satisfies Array<{ label: string; value: string; icon: LucideIcon }>;

  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-[360px] overflow-hidden border-b border-border pt-14 md:pt-16">
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
        <div className="relative mx-auto flex min-h-[calc(360px-3.5rem)] max-w-[1540px] flex-col justify-end px-5 py-10 sm:px-8 md:min-h-[calc(360px-4rem)] md:px-9 lg:px-10">
          <h1 className="max-w-4xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/86 sm:text-lg">
            {copy.intro}
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1540px] gap-7 px-4 py-6 sm:px-6 md:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-md border-border bg-card/80 py-0 shadow-2xl backdrop-blur-md">
            <CardHeader className="px-5 py-5">
              <CardTitle className="font-display text-3xl font-normal">
                {copy.sideTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 px-5 pb-5">
              {stats.map((stat, index) => (
                <div key={stat.label}>
                  {index > 0 ? <Separator className="my-5" /> : null}
                  <StatRow {...stat} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="px-5 pb-6">
              <Button asChild variant="link" className="h-auto p-0 font-mono">
                <a href="#feed">
                  {copy.viewAll}
                  <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </aside>

        <section className="min-w-0" aria-labelledby="feed-heading">
          <div className="flex flex-col gap-4 border-border pb-4 min-[1120px]:flex-row min-[1120px]:items-center min-[1120px]:justify-between">
            <ToggleGroup
              type="single"
              value={category}
              onValueChange={(value) => {
                setCategory((value || "All") as CategoryFilter);
              }}
              variant="outline"
              size="sm"
              spacing={2}
              className="flex w-full flex-wrap justify-start gap-2"
              aria-label={copy.filterAria}
            >
              {filterOptions.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  className="h-10 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-4"
                  aria-label={copy.showCategory(
                    option === "All" ? copy.allFilter : option,
                  )}
                >
                  {option === "All" ? copy.allFilter : option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {copy.sortBy}
              </span>
              <Select
                value={sortMode}
                onValueChange={(value) => setSortMode(value as SortMode)}
              >
                <SelectTrigger
                  className="h-10 min-w-36 rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                  aria-label={copy.sortAria}
                >
                  <SelectValue placeholder={copy.sortLabels.latest} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {(Object.keys(copy.sortLabels) as SortMode[]).map((value) => (
                      <SelectItem key={value} value={value}>
                        {copy.sortLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

function StatRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-center gap-4">
      <div className="grid size-11 place-items-center rounded-sm bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" />
      </div>
      <div>
        <div className="font-display text-4xl leading-none text-foreground">
          {value}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
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
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
              project.image.includes(".png") &&
                "object-contain p-8 group-hover:scale-100",
            )}
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
