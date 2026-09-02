import assert from "node:assert/strict";
import test from "node:test";
import {
  getRandomizedFeaturedImpactItems,
  isFeaturedImpactItem,
  shuffleImpactItems,
} from "./featured.ts";

test("selects only entries marked featured by the Sanity topic projection", () => {
  assert.equal(isFeaturedImpactItem({ isFeatured: true }), true);
  assert.equal(isFeaturedImpactItem({ isFeatured: false }), false);
});

test("shuffles a copy without mutating the source items", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const shuffledItems = shuffleImpactItems(items, () => 0);

  assert.deepEqual(items.map((item) => item.id), ["a", "b", "c", "d"]);
  assert.deepEqual(shuffledItems.map((item) => item.id), ["b", "c", "d", "a"]);
});

test("filters non-featured entries before randomizing", () => {
  const items = [
    { id: "one", isFeatured: true },
    { id: "two", isFeatured: false },
    { id: "three", isFeatured: true },
  ];

  const featuredItems = getRandomizedFeaturedImpactItems(items, () => 0);

  assert.deepEqual(
    featuredItems.map((item) => item.id),
    ["three", "one"],
  );
});

test("handles empty and single-entry featured collections", () => {
  assert.deepEqual(getRandomizedFeaturedImpactItems([], () => 0.5), []);

  const onlyItem = { id: "only", isFeatured: true };
  assert.deepEqual(
    getRandomizedFeaturedImpactItems([onlyItem], () => 0.5),
    [onlyItem],
  );
});
