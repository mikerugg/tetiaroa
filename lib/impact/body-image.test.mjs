import assert from "node:assert/strict";
import test from "node:test";
import { getImpactBodyImageLayout } from "./body-image.ts";

test("body images use the standard layout when no display size is stored", () => {
  assert.match(getImpactBodyImageLayout(undefined).figureClassName, /max-w-2xl/);
});

test("body image layouts include width and height constraints", () => {
  for (const displaySize of ["compact", "standard", "full"]) {
    const layout = getImpactBodyImageLayout(displaySize);

    assert.match(layout.figureClassName, /max-w-/);
    assert.match(layout.imageClassName, /max-h-/);
    assert.ok(layout.sizes.length > 0);
  }
});
