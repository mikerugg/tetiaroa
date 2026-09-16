import assert from "node:assert/strict";
import test from "node:test";
import { directoryCategoryTarget, directoryClearTarget, directoryQuery, normalizeGuideSearch, parseDirectoryFilters, restoreSubgroupCategory, selectDirectoryEntries } from "./directory-state.ts";

function card(overrides = {}) {
  return { id: "bird", locale: "en", title: "White tern", scientificName: "Gygis alba", localNames: "ʻItataʻe", category: "birds", subgroup: "seabirds", habitats: ["motu-shore"], searchNames: ["Gygis blanche", "ʻItataʻe"], ...overrides };
}

test("names match across languages without accents or Polynesian apostrophes", () => {
  assert.equal(normalizeGuideSearch("Pétrel ‘ō’ū"), "petrel ou");
  for (const q of ["itatae", "gygis blanche", "white tern", "Gygis alba"]) {
    assert.equal(selectDirectoryEntries([card()], parseDirectoryFilters(`q=${q}`), "en").total, 1);
  }
});

test("category, subgroup and habitat filters combine; a category page cannot be overridden", () => {
  const entries = [card(), card({ id: "fish", category: "fish", subgroup: "bony-fish", habitats: ["lagoon-reef"] })];
  assert.equal(selectDirectoryEntries(entries, parseDirectoryFilters("category=fish&subgroup=bony-fish&habitat=lagoon-reef"), "en").total, 1);
  assert.equal(selectDirectoryEntries(entries, parseDirectoryFilters("category=fish"), "en", "birds").entries[0].id, "bird");
  assert.equal(selectDirectoryEntries(entries, parseDirectoryFilters("habitat=open-ocean"), "en").total, 0);
});

test("legacy subgroup-only links select their visible group and keep it when widening to all subgroups", () => {
  const categories = [
    { id: "birds", subgroups: [{ id: "seabirds", title: "Seabirds" }, { id: "shore-birds", title: "Shore and terrestrial birds" }] },
    { id: "fish", subgroups: [{ id: "bony-fish", title: "Bony fish" }] },
  ];
  const entries = [card(), card({ id: "shore", subgroup: "shore-birds" }), card({ id: "fish", category: "fish", subgroup: "bony-fish" })];
  const legacy = parseDirectoryFilters("subgroup=seabirds&habitat=motu-shore");
  const restored = restoreSubgroupCategory(legacy, categories);
  assert.equal(restored.category, "birds");
  assert.equal(restored.subgroup, "seabirds");
  assert.equal(legacy.category, "");
  assert.deepEqual(selectDirectoryEntries(entries, restored, "en").entries.map((entry) => entry.id), ["bird"]);
  const widened = { ...restored, subgroup: "" };
  assert.equal(selectDirectoryEntries(entries, widened, "en").total, 2);
  assert.equal(directoryQuery(widened), "category=birds&habitat=motu-shore");
  assert.equal(restoreSubgroupCategory({ ...legacy, category: "fish" }, categories).category, "fish");
  assert.equal(restoreSubgroupCategory(legacy, categories, "fish").category, "");
  assert.equal(restoreSubgroupCategory(parseDirectoryFilters("subgroup=unknown"), categories).category, "");
});

test("sorting is alphabetical before 24-entry pagination and invalid pages are bounded", () => {
  const entries = Array.from({ length: 30 }, (_, i) => card({ id: String(i), title: `Bird ${String(29 - i).padStart(2, "0")}` }));
  const first = selectDirectoryEntries(entries, parseDirectoryFilters(""), "en");
  assert.equal(first.entries.length, 24);
  assert.equal(first.entries[0].title, "Bird 00");
  const last = selectDirectoryEntries(entries, parseDirectoryFilters("page=999"), "en");
  assert.equal(last.page, 2);
  assert.equal(last.entries.length, 6);
  assert.equal(parseDirectoryFilters("page=-1").page, 1);
});

test("URL state round trips search punctuation, filters and pagination", () => {
  const filters = { q: "ʻItataʻe & Gygis", category: "birds", subgroup: "seabirds", habitat: "motu-shore", page: 3 };
  assert.deepEqual(parseDirectoryFilters(directoryQuery(filters)), filters);
  assert.equal(directoryQuery(parseDirectoryFilters("")), "");
});

test("changing species group preserves search and habitat while resetting the page and subgroup", () => {
  const filters = parseDirectoryFilters("q=reef&category=birds&subgroup=seabirds&habitat=lagoon-reef&page=3");
  assert.equal(directoryCategoryTarget("/island/guide", filters, "fish", "en"), "/island/guide?q=reef&category=fish&habitat=lagoon-reef");
  assert.equal(directoryCategoryTarget("/fr/island/birds", filters, "fish", "fr", true), "/fr/island/fish?q=reef&habitat=lagoon-reef");
  assert.equal(directoryCategoryTarget("/island/birds", filters, "", "en", true), "/island/guide?q=reef&habitat=lagoon-reef");
});

test("clearing a category page returns to its language's unfiltered species browser", () => {
  assert.equal(directoryClearTarget("en"), "/island/guide");
  assert.equal(directoryClearTarget("fr"), "/fr/island/guide");
});
