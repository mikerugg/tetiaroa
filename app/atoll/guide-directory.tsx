"use client";

import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { habitatLabels } from "@/lib/atoll/config";
import { guideHabitats, type GuideCard, type GuideCategory, type GuideCategoryId, type GuideLocale } from "@/lib/atoll/types";
import { cn } from "@/lib/utils";
import { atollCopy } from "./atoll-copy";
import { restoreGuideBrowsePosition } from "./browse-history";
import { GuideEntryCard } from "./guide-cards";
import { directoryCategoryTarget, directoryClearTarget, directoryQuery, GUIDE_PAGE_SIZE, parseDirectoryFilters, restoreSubgroupCategory, selectDirectoryEntries, type DirectoryFilters } from "./directory-state";

const CHANGE_EVENT = "atoll-directory-change";
function subscribeToQuery(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener(CHANGE_EVENT, callback); };
}
function currentQuery() { return window.location.search; }

function DirectoryFilter({ id, label, allLabel, value, options, onChange, className }: {
  id: string; label: string; allLabel: string; value: string;
  options: { id: string; title: string }[]; onChange: (value: string) => void;
  className?: string;
}) {
  const items = [{ id: "all", title: allLabel }, ...options];
  const change = (next: string) => { if (next) onChange(next === "all" ? "" : next); };
  return <Field className={cn("min-w-0 gap-2 md:flex-row md:items-center md:[&>[data-slot=field-label]]:w-28 md:[&>[data-slot=field-label]]:shrink-0", className)}>
    <FieldLabel id={`${id}-label`} htmlFor={id}>{label}</FieldLabel>
    <ToggleGroup type="single" value={value || "all"} onValueChange={change} variant="outline" spacing={1} aria-labelledby={`${id}-label`} className="hidden w-full flex-wrap justify-start md:flex">
      {items.map((item) => <ToggleGroupItem key={item.id} value={item.id}>{item.title}</ToggleGroupItem>)}
    </ToggleGroup>
    <Select value={value || "all"} onValueChange={change}>
      <SelectTrigger id={id} aria-labelledby={`${id}-label`} className="min-h-11 w-full text-left whitespace-normal data-[size=default]:h-auto *:data-[slot=select-value]:line-clamp-none md:hidden"><SelectValue placeholder={allLabel} className="min-w-0 whitespace-normal" /></SelectTrigger>
      <SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  </Field>;
}

export type GuideDirectoryContext = {
  categories: Record<string, { introduction: ReactNode; resources: ReactNode; reading: ReactNode }>;
  habitats: Record<string, ReactNode>;
  reading: ReactNode;
};

export function GuideDirectory({ entries, categories, locale, initialSearch = "", category, context }: {
  entries: GuideCard[]; categories: Pick<GuideCategory, "id" | "title" | "subgroups">[]; locale: GuideLocale; initialSearch?: string; category?: GuideCategoryId;
  context?: GuideDirectoryContext;
}) {
  const router = useRouter();
  const serverQuery = useCallback(() => initialSearch, [initialSearch]);
  const search = useSyncExternalStore(subscribeToQuery, currentQuery, serverQuery);
  const filters = restoreSubgroupCategory(parseDirectoryFilters(search), categories, category);
  const result = selectDirectoryEntries(entries, filters, locale, category);
  const copy = atollCopy[locale];
  const selectedCategory = category || filters.category;
  const subgroups = categories.find((item) => item.id === selectedCategory)?.subgroups ?? [];
  const hasFilters = Boolean(filters.q || selectedCategory || filters.subgroup || filters.habitat);
  const categoryContext = context?.categories[selectedCategory];
  const habitatContext = context?.habitats[filters.habitat];

  useEffect(() => restoreGuideBrowsePosition(locale), [locale]);

  function updateQuery(changes: Partial<DirectoryFilters>, mode: "push" | "replace" = "push") {
    const next = { ...filters, ...changes };
    if (category) next.category = "";
    const query = directoryQuery(next);
    const href = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (`${window.location.pathname}${window.location.search}` === href) return;
    // Next manages its own history tree. Passing that tree back bypasses its native-URL sync.
    const historyState = { atollGuideBrowse: window.history.state?.atollGuideBrowse };
    if (mode === "replace") window.history.replaceState(historyState, "", href);
    else window.history.pushState(historyState, "", href);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  function changeCategory(value: string) {
    if (!value) return;
    const selected = value === "all" ? "" : value;
    if (category) {
      router.push(directoryCategoryTarget(window.location.pathname, filters, selected, locale, true), { scroll: false });
    } else updateQuery({ category: selected, subgroup: "", page: 1 });
  }

  function clearFilters() {
    if (category) router.push(directoryClearTarget(locale), { scroll: false });
    else updateQuery({ q: "", category: "", subgroup: "", habitat: "", page: 1 });
  }
  function goToPage(page: number) {
    updateQuery({ page });
    document.getElementById("guide-results")?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return <div id="browse-guide" className="scroll-mt-24">
    <form role="search" aria-label={copy.searchLabel} onSubmit={(event) => event.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="guide-search" className="sr-only">{copy.searchLabel}</FieldLabel>
          <div className="rounded-sm bg-card">
            <InputGroup className="h-12 rounded-sm">
              <InputGroupInput id="guide-search" name="q" type="search" value={filters.q} placeholder={copy.searchPlaceholder} onChange={(event) => updateQuery({ q: event.target.value, page: 1 }, "replace")} aria-describedby="guide-search-help" autoComplete="off" className="h-full pr-4 md:text-base" />
              <InputGroupAddon align="inline-start" className="pl-4"><SearchIcon aria-hidden="true" className="size-5" /></InputGroupAddon>
            </InputGroup>
          </div>
          <FieldDescription id="guide-search-help" className="hidden text-sm md:block">{copy.searchHint}</FieldDescription>
        </Field>
      </FieldGroup>
    </form>

    <FieldGroup className="mt-4 grid gap-4 min-[390px]:grid-cols-2 md:grid-cols-1 md:gap-3">
      <DirectoryFilter id="guide-category" label={copy.category} allLabel={copy.allSpecies} value={selectedCategory} options={categories} onChange={(value) => changeCategory(value || "all")} />
      <DirectoryFilter id="guide-habitat" label={copy.habitat} allLabel={copy.allHabitats} value={filters.habitat} options={guideHabitats.map((id) => ({ id, title: habitatLabels[locale][id] }))} onChange={(value) => updateQuery({ habitat: value, page: 1 })} />
      {subgroups.length > 0 && <DirectoryFilter id="guide-subgroup" label={copy.subgroup} allLabel={copy.allSubgroups} value={filters.subgroup} options={subgroups} onChange={(value) => updateQuery({ subgroup: value, page: 1 })} className="min-[390px]:col-span-2 md:col-span-1" />}
    </FieldGroup>

    <Separator className="mt-4" />
    <div id="guide-results" className="flex min-h-12 scroll-mt-24 flex-wrap items-center justify-between gap-3 py-2">
      <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{result.total} {result.total === 1 ? copy.result : copy.results}</span>
        {result.total > GUIDE_PAGE_SIZE && <span className="ml-2">· {(result.page - 1) * GUIDE_PAGE_SIZE + 1}–{Math.min(result.page * GUIDE_PAGE_SIZE, result.total)}</span>}
      </p>
      {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><XIcon data-icon="inline-start" />{copy.clear}</Button>}
    </div>

    {result.entries.length ? <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">{result.entries.map((entry, index) => <GuideEntryCard key={entry.id} entry={entry} eager={index < 3} />)}</div> : <Empty className="min-h-80 py-16"><EmptyHeader><EmptyMedia variant="icon"><SearchIcon /></EmptyMedia><EmptyTitle>{entries.length ? copy.noResults : copy.noEntries}</EmptyTitle><EmptyDescription>{entries.length ? copy.noResultsDescription : copy.noEntriesDescription}</EmptyDescription></EmptyHeader>{hasFilters && <Button variant="outline" onClick={clearFilters}>{copy.clear}</Button>}</Empty>}
    {result.pageCount > 1 && <nav aria-label={copy.pagination} className="mt-12 flex items-center justify-between gap-3">
      <Button variant="outline" disabled={result.page <= 1} onClick={() => goToPage(result.page - 1)}><ArrowLeftIcon data-icon="inline-start" />{copy.previous}</Button>
      <p className="text-xs text-muted-foreground">{copy.page} {result.page} {copy.of} {result.pageCount}</p>
      <Button variant="outline" disabled={result.page >= result.pageCount} onClick={() => goToPage(result.page + 1)}>{copy.next}<ArrowRightIcon data-icon="inline-end" /></Button>
    </nav>}
    <p className="mt-8 max-w-2xl text-xs leading-6 text-muted-foreground">{copy.countNote}</p>
    {context && <div className="mt-14">
      {(categoryContext || habitatContext) && <div className="flex flex-col gap-10">
        {categoryContext?.introduction}
        {habitatContext}
        {categoryContext?.resources}
      </div>}
      <div className="-mx-5 sm:-mx-8 lg:-mx-12">{categoryContext?.reading ?? context.reading}</div>
    </div>}
  </div>;
}
