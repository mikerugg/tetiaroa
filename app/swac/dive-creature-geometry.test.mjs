import assert from "node:assert/strict";
import test from "node:test";
import { isWithinDepthBand } from "./dive-creature-geometry.ts";

test("depth bands include their centre and exclude their exact edges", () => {
  assert.equal(isWithinDepthBand(550, 550, 210), true);
  assert.equal(isWithinDepthBand(340 + 1e-9, 550, 210), true);
  assert.equal(isWithinDepthBand(760 - 1e-9, 550, 210), true);
  assert.equal(isWithinDepthBand(340, 550, 210), false);
  assert.equal(isWithinDepthBand(760, 550, 210), false);
  assert.equal(isWithinDepthBand(339.99, 550, 210), false);
  assert.equal(isWithinDepthBand(760.01, 550, 210), false);
});
