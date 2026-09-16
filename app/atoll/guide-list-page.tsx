import { notFound } from "next/navigation";
import { getAtollPath } from "@/lib/atoll/config";
import type { GuideLocale } from "@/lib/atoll/types";
import { getAtollHub, getGuideCards, getGuideCategories } from "@/lib/sanity/atoll";
import { AtollBreadcrumbs, AtollShell } from "./atoll-shell";
import { atollCopy } from "./atoll-copy";
import { GuideDirectory } from "./guide-directory";
import { createGuideDirectoryContext } from "./guide-context";
import { searchParamsToString } from "./directory-state";
import { atollMetadata } from "./metadata";

export async function guideListMetadata(locale: GuideLocale, categoryId?: string) {
  const copy = atollCopy[locale];
  const categories = categoryId ? await getGuideCategories(locale) : [];
  const category = categories.find((item) => item.id === categoryId);
  if (categoryId && !category) notFound();
  return atollMetadata({ locale, title: category ? `${category.title} · ${copy.guide}` : copy.guideTitle, description: category?.introduction ?? copy.guideDescription, path: getAtollPath(locale, category?.id ?? "guide"), image: category?.image });
}

export async function GuideListPage({ locale, categoryId, searchParams }: { locale: GuideLocale; categoryId?: string; searchParams: Record<string, string | string[] | undefined> }) {
  const [categories, entries, hub] = await Promise.all([getGuideCategories(locale), getGuideCards(locale), getAtollHub(locale)]);
  const category = categories.find((item) => item.id === categoryId);
  if (categoryId && !category) notFound();
  const copy = atollCopy[locale];
  const initialSearch = searchParamsToString(searchParams);
  const alternate = getAtollPath(locale === "en" ? "fr" : "en", category?.id ?? "guide");
  return <AtollShell locale={locale} alternateHref={`${alternate}${initialSearch ? `?${initialSearch}` : ""}`}>
    <div className="mx-auto max-w-7xl px-5 pt-5 pb-16 sm:px-8 lg:px-12">
      <AtollBreadcrumbs locale={locale} items={[{ title: copy.guide }]} />
      <header className="mb-5 max-w-2xl">
        <h1 className="font-display text-4xl leading-none sm:text-5xl">{copy.guide}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{copy.compactIntro}</p>
      </header>
      <GuideDirectory entries={entries} categories={categories.map(({ id, title, subgroups }) => ({ id, title, subgroups }))} locale={locale} category={category?.id} initialSearch={initialSearch} context={createGuideDirectoryContext(categories, hub, locale)} />
    </div>
  </AtollShell>;
}
