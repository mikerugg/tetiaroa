"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRightIcon, RotateCcwIcon } from "lucide-react";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cohorts, focusAreas, people, type Cohort, type Person } from "./people-data";

type CohortFilter = "All" | Cohort;
type FocusFilter = "All" | string;

const cohortOptions: CohortFilter[] = ["All", ...cohorts];
const featuredPeople = people.filter((person) => person.featured);

function matchesSearch(person: Person, search: string) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [
    person.name,
    person.role,
    person.cohort,
    person.summary,
    ...person.focus,
  ].some((value) => value.toLowerCase().includes(query));
}

function resultLabel(count: number) {
  if (count === 1) {
    return "1 person";
  }

  return `${count} people`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PeopleDirectory() {
  const [search, setSearch] = useState("");
  const [cohort, setCohort] = useState<CohortFilter>("All");
  const [focus, setFocus] = useState<FocusFilter>("All");

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const cohortMatch = cohort === "All" || person.cohort === cohort;
      const focusMatch = focus === "All" || person.focus.includes(focus);

      return cohortMatch && focusMatch && matchesSearch(person, search);
    });
  }, [cohort, focus, search]);

  return (
    <section
      id="directory"
      className="relative overflow-hidden bg-[#06110f] px-5 py-20 text-foreground md:px-8 lg:px-12"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_18%_0%,rgba(91,232,212,0.14),transparent_34%),linear-gradient(180deg,rgba(91,232,212,0.07),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.72fr)] lg:items-end">
          <div>
            <h2 className="max-w-4xl font-display text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.95] text-[#f4f1ea]">
              Meet the people behind the field work.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#cfd5d0]/78">
              Search across staff, board members, and scientific advisors. The
              structure follows a leadership directory, but every card keeps the
              person connected to the work of the atoll.
            </p>
          </div>

          <Card className="rounded-md shadow-[0_22px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <CardHeader className="sr-only">
              <CardTitle>Directory filters</CardTitle>
              <CardDescription>Search and filter the Tetiaroa Society people directory.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel
                    htmlFor="people-search"
                    className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-secondary-foreground"
                  >
                    Search people
                  </FieldLabel>
                  <Input
                    id="people-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, role, science, culture..."
                    className="h-12"
                  />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel
                      htmlFor="people-cohort"
                      className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-secondary-foreground"
                    >
                      Cohort
                    </FieldLabel>
                    <Select
                      value={cohort}
                      onValueChange={(value) => setCohort(value as CohortFilter)}
                    >
                      <SelectTrigger id="people-cohort" className="h-12 w-full">
                        <SelectValue placeholder="All cohorts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {cohortOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="people-focus"
                      className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-secondary-foreground"
                    >
                      Focus
                    </FieldLabel>
                    <Select value={focus} onValueChange={setFocus}>
                      <SelectTrigger id="people-focus" className="h-12 w-full">
                        <SelectValue placeholder="All focus areas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All</SelectItem>
                          {focusAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
            <Separator />
            <CardFooter className="flex-wrap justify-between gap-3">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Showing {resultLabel(filteredPeople.length)}
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCohort("All");
                  setFocus("All");
                }}
              >
                <RotateCcwIcon data-icon="inline-start" />
                Reset
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="py-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#8fc9c9]">
                Featured leadership
              </p>
              <h3 className="mt-2 font-display text-4xl leading-none text-[#f4f1ea] md:text-5xl">
                Current operating team
              </h3>
            </div>
            <Button asChild variant="link" size="sm" className="px-0 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
              <a href="#all-people">
                View full index
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-5 [scrollbar-color:rgba(244,241,234,0.22)_transparent] md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
            {featuredPeople.map((person) => (
              <Card
                key={person.id}
                size="sm"
                className="group w-[280px] shrink-0 snap-start rounded-md transition hover:-translate-y-1 sm:w-[320px]"
              >
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#0c1614]">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(3,12,10,0.92)_100%)]"
                    aria-hidden="true"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute bottom-4 left-4 right-4 h-auto justify-start rounded-sm py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em]"
                  >
                    {person.role}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="font-display text-3xl leading-none">
                    {person.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[118px]">
                  <CardDescription className="text-sm leading-6">
                    {person.summary}
                  </CardDescription>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild variant="link" size="sm" className="px-0 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
                    <a href={person.href}>
                      View profile
                      <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <div id="all-people" className="grid gap-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#8fc9c9]">
                Full index
              </p>
              <h3 className="mt-2 font-display text-4xl leading-none text-[#f4f1ea] md:text-5xl">
                {resultLabel(filteredPeople.length)}
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#cfd5d0]/68">
              Filters are intentionally simple for this prototype: they prove the
              Gates-style directory pattern without locking the final taxonomy.
            </p>
          </div>

          {filteredPeople.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <Empty className="border border-border bg-card">
              <EmptyHeader>
                <EmptyTitle className="font-display text-3xl">
                  No people match those filters.
                </EmptyTitle>
                <EmptyDescription>
                  Try another cohort, broaden the focus area, or search by a
                  person&apos;s name.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setCohort("All");
                    setFocus("All");
                  }}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  Reset filters
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </section>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <Card size="sm" className="rounded-md transition hover:-translate-y-1">
      <CardHeader className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-3">
        <Avatar className="size-14 rounded-md after:rounded-md">
          <AvatarImage src={person.image} alt={person.name} className="rounded-md" />
          <AvatarFallback className="rounded-md">{initials(person.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <Badge variant="outline" className="mb-2 max-w-full rounded-sm font-mono text-[0.6rem] uppercase tracking-[0.12em]">
            <span className="truncate">{person.cohort}</span>
          </Badge>
          <CardTitle className="truncate font-display text-2xl leading-none">
            {person.name}
          </CardTitle>
          <CardDescription className="mt-1 font-medium text-secondary-foreground">
            {person.role}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {person.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {person.focus.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-sm font-mono text-[0.6rem] uppercase tracking-[0.12em]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild variant="link" size="sm" className="px-0 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
          <a href={person.href}>
            View profile
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
