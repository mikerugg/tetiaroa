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
} from "@/lib/impact/types";

type CategoryFilter = "All" | ImpactCategory;
type SortMode = "latest" | "oldest" | "az";

type ImpactFeedProps = {
  projects: ImpactFeedItem[];
};

const filterOptions = ["All", ...impactCategories] as const;

const sortLabels: Record<SortMode, string> = {
  latest: "Latest",
  oldest: "Oldest",
  az: "A-Z",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
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

export function ImpactFeed({ projects }: ImpactFeedProps) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("latest");

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
      label: "Impact entries",
      value: projects.length.toString(),
      icon: FolderOpenIcon,
    },
    {
      label: "Updated this year",
      value: updatedThisYear.toString(),
      icon: CalendarDaysIcon,
    },
    {
      label: "Categories connected",
      value: connectedCategories.toString(),
      icon: Layers3Icon,
    },
    {
      label: "Countries connected",
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
            Impact Feed
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/86 sm:text-lg">
            Follow the work as it changes: reef surveys, classroom days,
            biosecurity checks, and the patient recovery of an atoll.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1540px] gap-7 px-4 py-6 sm:px-6 md:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-md border-border bg-card/80 py-0 shadow-2xl backdrop-blur-md">
            <CardHeader className="px-5 py-5">
              <CardTitle className="font-display text-3xl font-normal">
                Atoll work
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
                  View all entries
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
              aria-label="Filter impact entries by category"
            >
              {filterOptions.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  className="h-10 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-4"
                  aria-label={`Show ${option} impact entries`}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Sort by
              </span>
              <Select
                value={sortMode}
                onValueChange={(value) => setSortMode(value as SortMode)}
              >
                <SelectTrigger
                  className="h-10 min-w-36 rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                  aria-label="Sort impact entries"
                >
                  <SelectValue placeholder="Latest" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {(Object.keys(sortLabels) as SortMode[]).map((value) => (
                      <SelectItem key={value} value={value}>
                        {sortLabels[value]}
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
                  Field notes, projects, and updates
                </CardTitle>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {visibleProjects.length} of {projects.length} entries
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 px-0 py-0">
              {visibleProjects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  priority={index < 2}
                />
              ))}
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
}: {
  project: ImpactFeedItem;
  priority: boolean;
}) {
  return (
    <article className="grid border-b border-border last:border-b-0 md:grid-cols-[minmax(260px,40%)_minmax(0,1fr)]">
      <div className="relative min-h-60 overflow-hidden bg-muted md:min-h-56">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          className={cn(
            "object-cover",
            project.image.includes(".png") && "object-contain p-8",
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
          <time className="text-muted-foreground" dateTime={project.latestUpdate}>
            {formatDate(project.latestUpdate)}
          </time>
        </div>

        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-foreground sm:text-4xl">
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
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {project.status}
            </p>
            <p className="mt-1 text-sm text-foreground/82">
              {project.metric} / {project.location}
            </p>
          </div>
          <Button
            asChild
            variant="link"
            className="h-auto justify-start p-0 font-mono"
          >
            <Link href={project.href}>
              {project.actionLabel}
              <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
