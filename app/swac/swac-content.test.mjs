import assert from "node:assert/strict";
import test from "node:test";
import {
  ANNUAL_COOLING_HOURS,
  CONVENTIONAL_COP,
  INTAKE_DEPTH,
  MAX_DIVE_DEPTH,
  SWAC_COP,
  alternativeIds,
  basicStepIds,
  calculateCircuit,
  calculateFeasibility,
  calculateLedger,
  clampStopIndex,
  depthAtDistance,
  diveStopIds,
  getMissingStopIds,
  gradePayback,
  lightAtDepth,
  loopNodeIds,
  pressureAtDepth,
  resolveMediaSource,
  slopeProfiles,
  swacCopies,
  temperatureAtDepth,
  temperatureToRamp,
} from "./swac-content.ts";

const { en, fr } = swacCopies;

test("keeps every localised list in lockstep", () => {
  assert.deepEqual(en.dive.stops.map((s) => s.id), [...diveStopIds]);
  assert.deepEqual(fr.dive.stops.map((s) => s.id), [...diveStopIds]);
  assert.deepEqual(en.basics.steps.map((s) => s.id), [...basicStepIds]);
  assert.deepEqual(fr.basics.steps.map((s) => s.id), [...basicStepIds]);
  assert.deepEqual(en.circuit.nodes.map((n) => n.id), [...loopNodeIds]);
  assert.deepEqual(fr.circuit.nodes.map((n) => n.id), [...loopNodeIds]);
  assert.deepEqual(en.slope.alternatives.map((a) => a.id), [...alternativeIds]);
  assert.deepEqual(fr.slope.alternatives.map((a) => a.id), [...alternativeIds]);

  assert.deepEqual(getMissingStopIds(en.dive.stops, fr.dive.stops), []);
  assert.deepEqual(getMissingStopIds(fr.dive.stops, en.dive.stops), []);
  assert.deepEqual(getMissingStopIds(en.globe.sites, fr.globe.sites), []);
  assert.deepEqual(getMissingStopIds(fr.globe.sites, en.globe.sites), []);
});

test("keeps numeric data identical across locales", () => {
  assert.deepEqual(
    en.dive.stops.map((s) => s.depth),
    fr.dive.stops.map((s) => s.depth),
  );
  assert.deepEqual(
    en.meter.presets.map((p) => p.kw),
    fr.meter.presets.map((p) => p.kw),
  );
  assert.deepEqual(
    en.globe.sites.map((s) => [s.lat, s.lon]),
    fr.globe.sites.map((s) => [s.lat, s.lon]),
  );
  assert.deepEqual(
    en.slope.alternatives.map((a) => a.remainingEnergy),
    fr.slope.alternatives.map((a) => a.remainingEnergy),
  );
  assert.deepEqual(
    en.basics.steps.map((s) => s.number),
    fr.basics.steps.map((s) => s.number),
  );
  assert.equal(en.hard.items.length, fr.hard.items.length);
  assert.deepEqual(Object.keys(en.globe.verdicts), Object.keys(fr.globe.verdicts));
});

test("dive stops run from the surface to the intake", () => {
  const depths = en.dive.stops.map((s) => s.depth);
  assert.equal(depths[0], 0);
  assert.equal(depths.at(-1), INTAKE_DEPTH);
  for (let i = 1; i < depths.length; i += 1) {
    assert.ok(depths[i] > depths[i - 1], "depths must increase");
  }
});

test("the temperature profile only ever falls", () => {
  assert.equal(temperatureAtDepth(0), 28.5);
  assert.equal(temperatureAtDepth(60), 28.5, "mixed layer stays warm");

  let previous = temperatureAtDepth(0);
  for (let d = 10; d <= MAX_DIVE_DEPTH; d += 10) {
    const current = temperatureAtDepth(d);
    assert.ok(current <= previous + 1e-9, `temperature rose at ${d} m`);
    previous = current;
  }

  const intake = temperatureAtDepth(INTAKE_DEPTH);
  assert.ok(intake > 4.5 && intake < 5.5, `intake water was ${intake}`);
});

test("temperature, pressure and light clamp outside the column", () => {
  assert.equal(temperatureAtDepth(-50), 28.5);
  assert.equal(temperatureAtDepth(99999), temperatureAtDepth(MAX_DIVE_DEPTH));
  assert.equal(pressureAtDepth(0), 1);
  assert.equal(pressureAtDepth(900), 91);
  assert.equal(lightAtDepth(0), 1);
  assert.ok(lightAtDepth(200) < 0.0002, "photic zone ends well above 200 m");
});

test("the ledger saves 85 percent and converts to fuel", () => {
  const result = calculateLedger(1000);
  assert.equal(result.conventionalKwh, (1000 / CONVENTIONAL_COP) * ANNUAL_COOLING_HOURS);
  assert.equal(result.swacKwh, (1000 / SWAC_COP) * ANNUAL_COOLING_HOURS);
  assert.ok(Math.abs(result.reductionPercent - 85) < 1e-9);
  assert.ok(result.savedKwh > 0);
  assert.ok(Math.abs(result.drums - result.litresDiesel / 200) < 1e-9);
  assert.ok(result.tonnesCo2 > 0);

  const zero = calculateLedger(0);
  assert.equal(zero.savedKwh, 0);
  assert.equal(zero.reductionPercent, 0);
  assert.equal(calculateLedger(-500).conventionalKwh, 0);
});

test("the ledger scales linearly with load", () => {
  const one = calculateLedger(500);
  const two = calculateLedger(1000);
  assert.ok(Math.abs(two.savedKwh - one.savedKwh * 2) < 1e-6);
});

test("payback grading covers every band", () => {
  assert.equal(gradePayback(4), "strong");
  assert.equal(gradePayback(7.99), "strong");
  assert.equal(gradePayback(8), "plausible");
  assert.equal(gradePayback(14.99), "plausible");
  assert.equal(gradePayback(15), "marginal");
  assert.equal(gradePayback(24.99), "marginal");
  assert.equal(gradePayback(25), "unlikely");
  assert.equal(gradePayback(Number.POSITIVE_INFINITY), "unlikely");
  assert.equal(gradePayback(Number.NaN), "unlikely");
});

test("a short pipe beats a long one at equal demand", () => {
  const close = calculateFeasibility(2, 2500, 0.35);
  const far = calculateFeasibility(138, 2500, 0.35);
  assert.ok(close.paybackYears < far.paybackYears);
  assert.ok(close.capitalCost < far.capitalCost);
  assert.equal(close.annualSavings, far.annualSavings);

  const noDemand = calculateFeasibility(2, 0, 0.35);
  assert.equal(noDemand.verdict, "unlikely");
  assert.equal(noDemand.paybackYears, Number.POSITIVE_INFINITY);
});

test("the circuit conserves heat across the plate", () => {
  for (const load of [0, 0.25, 0.5, 0.75, 1]) {
    const c = calculateCircuit(load);
    assert.ok(c.supplyTemp > c.seawaterIn, "supply cannot beat the source");
    assert.ok(c.returnTemp > c.supplyTemp, "buildings must add heat");
    assert.ok(c.seawaterOut > c.seawaterIn, "seawater must leave warmer");
    // Equal mass flow: what the fresh side loses, the seawater side gains.
    assert.ok(
      Math.abs((c.returnTemp - c.supplyTemp) - (c.seawaterOut - c.seawaterIn)) < 1e-9,
      "heat balance broken",
    );
    assert.ok(Math.abs(c.buildingDelta - (c.returnTemp - c.supplyTemp)) < 1e-9);
  }

  const idle = calculateCircuit(0);
  const peak = calculateCircuit(1);
  assert.ok(peak.supplyTemp > idle.supplyTemp, "supply drifts up under load");
  assert.ok(peak.flowRate > idle.flowRate);
  assert.equal(calculateCircuit(4).load, 1, "load clamps");
});

test("the temperature ramp stays inside its bounds", () => {
  assert.equal(temperatureToRamp(-100), 0);
  assert.equal(temperatureToRamp(100), 1);
  assert.ok(temperatureToRamp(11) > temperatureToRamp(5));
});

test("the slope profiles disagree by two orders of magnitude", () => {
  const atoll = slopeProfiles.atoll;
  const shelf = slopeProfiles.shelf;

  assert.ok(Math.abs(depthAtDistance(atoll, atoll.distanceToDepthKm) - INTAKE_DEPTH) < 1);
  assert.ok(Math.abs(depthAtDistance(shelf, shelf.distanceToDepthKm) - INTAKE_DEPTH) < 1);
  assert.ok(shelf.distanceToDepthKm > atoll.distanceToDepthKm * 50);

  for (const profile of [atoll, shelf]) {
    assert.equal(depthAtDistance(profile, 0), 0);
    let previous = 0;
    for (const [distance] of profile.points) {
      const depth = depthAtDistance(profile, distance);
      assert.ok(depth >= previous - 1e-9, "profiles must only deepen");
      previous = depth;
    }
    // Clamps at both ends rather than extrapolating.
    assert.equal(depthAtDistance(profile, -10), 0);
    assert.equal(
      depthAtDistance(profile, 99999),
      profile.points.at(-1)[1],
    );
  }
});

test("stop index clamping survives bad input", () => {
  assert.equal(clampStopIndex(-3), 0);
  assert.equal(clampStopIndex(2.6), 3);
  assert.equal(clampStopIndex(999), diveStopIds.length - 1);
  assert.equal(clampStopIndex(Number.NaN), 0);
  assert.equal(clampStopIndex(2, 0), 0);
});

test("media sources fall back when blank", () => {
  assert.equal(resolveMediaSource("  ", "/fallback.webp"), "/fallback.webp");
  assert.equal(resolveMediaSource("/real.webp", "/fallback.webp"), "/real.webp");
});

test("routes and language links point at each other", () => {
  assert.equal(en.path, "/island/swac");
  assert.equal(fr.path, "/fr/island/swac");
  assert.equal(en.languageHref, fr.path);
  assert.equal(fr.languageHref, en.path);
  assert.ok(en.url.endsWith(en.path));
  assert.ok(fr.url.endsWith(fr.path));
});
