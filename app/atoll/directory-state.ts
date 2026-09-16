import type { GuideCard, GuideCategory, GuideCategoryId, GuideLocale } from "../../lib/atoll/types";

export type DirectoryFilters = { q: string; category: string; subgroup: string; habitat: string; page: number };
export const GUIDE_PAGE_SIZE = 24;

export function normalizeGuideSearch(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[’‘ʼʻ'`´]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function parseDirectoryFilters(search: string): DirectoryFilters {
  const params = new URLSearchParams(search);
  const page = Number(params.get("page"));
  return { q: params.get("q") ?? "", category: params.get("category") ?? "", subgroup: params.get("subgroup") ?? "", habitat: params.get("habitat") ?? "", page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
}

/** Older directory links could select a subgroup without its containing species group. */
export function restoreSubgroupCategory(filters: DirectoryFilters, categories: Pick<GuideCategory, "id" | "subgroups">[], category?: GuideCategoryId): DirectoryFilters {
  if (category || filters.category || !filters.subgroup) return filters;
  const inferred = categories.find((item) => item.subgroups.some((subgroup) => subgroup.id === filters.subgroup));
  return inferred ? { ...filters, category: inferred.id } : filters;
}

export function directoryQuery(filters: DirectoryFilters) {
  const params = new URLSearchParams();
  for (const key of ["q", "category", "subgroup", "habitat"] as const) if (filters[key]) params.set(key, filters[key]);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function directoryCategoryTarget(pathname: string, filters: DirectoryFilters, selected: string, locale: GuideLocale, categoryPage = false) {
  const next = { ...filters, category: categoryPage ? "" : selected, subgroup: "", page: 1 };
  const path = categoryPage ? `${locale === "fr" ? "/fr" : ""}/island/${selected || "guide"}` : pathname;
  const query = directoryQuery(next);
  return `${path}${query ? `?${query}` : ""}`;
}

export function directoryClearTarget(locale: GuideLocale) {
  return `${locale === "fr" ? "/fr" : ""}/island/guide`;
}

export function selectDirectoryEntries(entries: GuideCard[], filters: DirectoryFilters, locale: GuideLocale, category?: GuideCategoryId) {
  const query = normalizeGuideSearch(filters.q).split(/\s+/).filter(Boolean);
  const matching = entries.filter((entry) => {
    if ((category || filters.category) && entry.category !== (category || filters.category)) return false;
    if (filters.subgroup && entry.subgroup !== filters.subgroup) return false;
    if (filters.habitat && !entry.habitats.some((habitat) => habitat === filters.habitat)) return false;
    const haystack = normalizeGuideSearch([entry.title, entry.scientificName, entry.localNames ?? "", ...entry.searchNames].join(" "));
    return query.every((word) => haystack.includes(word));
  }).sort((a, b) => a.title.localeCompare(b.title, locale, { sensitivity: "base" }) || a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(matching.length / GUIDE_PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  return { entries: matching.slice((page - 1) * GUIDE_PAGE_SIZE, page * GUIDE_PAGE_SIZE), total: matching.length, page, pageCount };
}

export function searchParamsToString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const key of ["q", "category", "subgroup", "habitat", "page"]) {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first) query.set(key, first);
  }
  return query.toString();
}
