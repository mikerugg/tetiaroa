import assert from "node:assert/strict";
import test from "node:test";
import { invaders, recoveryState, removeInvader } from "./tarp-scene.ts";

test("repeated removal cannot double count an invader or its returning wildlife", () => {
  const first = Object.freeze(removeInvader([], "ants-1"));
  const repeated = removeInvader(removeInvader(first, "ants-1"), "ants-1");
  const state = recoveryState(repeated);

  assert.deepEqual(first, ["ants-1"]);
  assert.deepEqual(repeated, ["ants-1"]);
  assert.equal(state.ants, 1);
  assert.equal(state.rats, 0);
  assert.equal(state.cleared.length, 1);
  assert.deepEqual(state.species, ["crab"]);
  assert.equal(state.complete, false);
});

test("removing invaders in a mixed order unlocks wildlife without finishing early", () => {
  let removed = removeInvader([], "rat-3");
  assert.deepEqual(recoveryState(removed).species, ["tern"]);

  removed = removeInvader(removed, "ants-1");
  assert.deepEqual(new Set(recoveryState(removed).species), new Set(["tern", "crab"]));

  removed = removeInvader(removed, "ants-2");
  const allTypes = recoveryState(removed);
  assert.deepEqual(new Set(allTypes.species), new Set(["tern", "crab", "seedling"]));
  assert.equal(allTypes.rats, 1);
  assert.equal(allTypes.ants, 2);
  assert.equal(allTypes.complete, false, "finding all native types does not finish the restoration");

  removed = removeInvader(removeInvader(removed, "rat-2"), "ants-3");
  const oneLeft = recoveryState(removed);
  assert.equal(oneLeft.cleared.length, 5);
  assert.equal(oneLeft.rats, 2);
  assert.equal(oneLeft.ants, 3);
  assert.equal(oneLeft.species.length, 3, "repeated native types stay deduplicated");
  assert.equal(oneLeft.complete, false);
});

test("removing every invader completes restoration with three rats and three ant colonies", () => {
  const removed = invaders.toReversed().reduce((current, item) => removeInvader(current, item.id), []);
  const state = recoveryState(removed);

  assert.equal(state.complete, true);
  assert.equal(state.rats, 3);
  assert.equal(state.ants, 3);
  assert.equal(state.cleared.length, 6);
  assert.deepEqual(new Set(state.species), new Set(["seedling", "crab", "tern"]));
  assert.deepEqual(recoveryState(removeInvader(removed, "rat-1")), state);
});

test("an empty removal list resets progress and clears returning wildlife", () => {
  const completed = invaders.reduce((current, item) => removeInvader(current, item.id), []);
  assert.equal(recoveryState(completed).complete, true);

  assert.deepEqual(recoveryState([]), {
    cleared: [],
    rats: 0,
    ants: 0,
    species: [],
    complete: false,
  });
  const restarted = recoveryState(removeInvader([], "rat-1"));
  assert.equal(restarted.cleared.length, 1);
  assert.deepEqual(restarted.species, ["seedling"]);
  assert.equal(restarted.complete, false);
});
