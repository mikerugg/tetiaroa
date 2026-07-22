import assert from "node:assert/strict";
import test from "node:test";
import {
  clampStageIndex,
  geologyCopies,
  geologyStageIds,
  getMissingStageIds,
  getStageIndex,
  resolveMediaSource,
} from "./geology-content.ts";

test("keeps English and French stage structures in lockstep", () => {
  const englishStages = geologyCopies.en.stages;
  const frenchStages = geologyCopies.fr.stages;

  assert.equal(englishStages.length, geologyStageIds.length);
  assert.equal(frenchStages.length, geologyStageIds.length);
  assert.deepEqual(
    englishStages.map((stage) => stage.id),
    geologyStageIds,
  );
  assert.deepEqual(
    frenchStages.map((stage) => stage.id),
    geologyStageIds,
  );
  assert.deepEqual(getMissingStageIds(englishStages, frenchStages), []);
  assert.deepEqual(getMissingStageIds(frenchStages, englishStages), []);
});

test("keeps the four sea-level moments aligned across locales", () => {
  const englishPeriods = geologyCopies.en.seaLevel.periods;
  const frenchPeriods = geologyCopies.fr.seaLevel.periods;

  assert.equal(englishPeriods.length, 4);
  assert.equal(frenchPeriods.length, 4);
  assert.deepEqual(
    englishPeriods.map((period) => period.value),
    frenchPeriods.map((period) => period.value),
  );
  assert.equal(englishPeriods.at(-1)?.value, 0);
  assert.equal(frenchPeriods.at(-1)?.value, 0);
});

test("clamps stage indexes at both boundaries", () => {
  assert.equal(clampStageIndex(-12), 0);
  assert.equal(clampStageIndex(2.6), 3);
  assert.equal(clampStageIndex(999), geologyStageIds.length - 1);
  assert.equal(clampStageIndex(Number.NaN), 0);
  assert.equal(clampStageIndex(3, 0), 0);
});

test("resolves known stages and safely falls back for missing stages", () => {
  assert.equal(getStageIndex("flexure", geologyCopies.en.stages), 3);
  assert.equal(getStageIndex("missing", geologyCopies.en.stages), 0);
  assert.equal(getStageIndex(null, geologyCopies.en.stages), 0);
});

test("uses local media fallbacks for empty or incomplete sources", () => {
  assert.equal(resolveMediaSource("/geology/map.webp", "/fallback.webp"), "/geology/map.webp");
  assert.equal(resolveMediaSource("", "/fallback.webp"), "/fallback.webp");
  assert.equal(resolveMediaSource("   ", "/fallback.webp"), "/fallback.webp");
  assert.equal(resolveMediaSource(undefined, "/fallback.webp"), "/fallback.webp");
});

test("requires localized accessibility copy for every stage", () => {
  for (const locale of ["en", "fr"]) {
    for (const stage of geologyCopies[locale].stages) {
      assert.ok(stage.visualDescription.trim(), `${locale}:${stage.id} needs a visual description`);
      assert.ok(stage.evidenceLabel.trim(), `${locale}:${stage.id} needs an evidence label`);
    }
  }
});
