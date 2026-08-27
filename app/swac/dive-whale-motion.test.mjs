import assert from "node:assert/strict";
import test from "node:test";
import {
  WHALE_LAP_LENGTH,
  WHALE_ROUTE_HALF_EXTENT,
  WHALE_STRAIGHT_SPAN,
  WHALE_TURN_LENGTH,
  WHALE_TURN_RADIUS,
  whaleSwimFrameAtDistance,
} from "./dive-whale-motion.ts";

const EPSILON = 1e-8;

function assertClose(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `${message}: expected ${expected}, received ${actual}`,
  );
}

function assertSameFrame(actual, expected, label) {
  assertClose(actual.along, expected.along, `${label} along`);
  assertClose(actual.outward, expected.outward, `${label} outward`);
  assertClose(
    actual.tangentAlong,
    expected.tangentAlong,
    `${label} tangent along`,
  );
  assertClose(
    actual.tangentOutward,
    expected.tangentOutward,
    `${label} tangent outward`,
  );
}

test("whale route joins every straight and turn without a snap", () => {
  const halfSpan = WHALE_STRAIGHT_SPAN / 2;
  const joins = [
    {
      distance: WHALE_STRAIGHT_SPAN,
      expected: {
        along: halfSpan,
        outward: 0,
        tangentAlong: 1,
        tangentOutward: 0,
      },
    },
    {
      distance: WHALE_STRAIGHT_SPAN + WHALE_TURN_LENGTH,
      expected: {
        along: halfSpan,
        outward: 0,
        tangentAlong: -1,
        tangentOutward: 0,
      },
    },
    {
      distance: WHALE_STRAIGHT_SPAN * 2 + WHALE_TURN_LENGTH,
      expected: {
        along: -halfSpan,
        outward: 0,
        tangentAlong: -1,
        tangentOutward: 0,
      },
    },
  ];

  for (const { distance, expected } of joins) {
    assertSameFrame(whaleSwimFrameAtDistance(distance), expected, "join");
  }

  assertSameFrame(
    whaleSwimFrameAtDistance(WHALE_LAP_LENGTH),
    whaleSwimFrameAtDistance(0),
    "lap seam",
  );
});

test("endpoint turns make compact loops into open water", () => {
  const sampleCount = 1_000;
  const rightTurn = Array.from({ length: sampleCount + 1 }, (_, index) =>
    whaleSwimFrameAtDistance(
      WHALE_STRAIGHT_SPAN + (index / sampleCount) * WHALE_TURN_LENGTH,
    ),
  );
  const leftTurn = Array.from({ length: sampleCount + 1 }, (_, index) =>
    whaleSwimFrameAtDistance(
      WHALE_STRAIGHT_SPAN * 2 +
        WHALE_TURN_LENGTH +
        (index / sampleCount) * WHALE_TURN_LENGTH,
    ),
  );
  const rightExtent = rightTurn.reduce((farthest, frame) =>
    frame.along > farthest.along ? frame : farthest,
  );
  const leftExtent = leftTurn.reduce((farthest, frame) =>
    frame.along < farthest.along ? frame : farthest,
  );

  assert.ok(Math.abs(rightExtent.along - WHALE_ROUTE_HALF_EXTENT) < 1e-5);
  assert.ok(Math.abs(rightExtent.outward - WHALE_TURN_RADIUS) < 1e-3);
  assert.ok(Math.abs(rightExtent.tangentAlong) < 1e-3);
  assert.ok(Math.abs(rightExtent.tangentOutward + 1) < 1e-5);
  assert.ok(Math.abs(leftExtent.along + WHALE_ROUTE_HALF_EXTENT) < 1e-5);
  assert.ok(Math.abs(leftExtent.outward - WHALE_TURN_RADIUS) < 1e-3);
  assert.ok(Math.abs(leftExtent.tangentAlong) < 1e-3);
  assert.ok(Math.abs(leftExtent.tangentOutward + 1) < 1e-5);
});

test("endpoint loops hold the whale's cruise speed", () => {
  const sampleCount = 200;
  const stepLength = WHALE_TURN_LENGTH / sampleCount;
  let previous = whaleSwimFrameAtDistance(WHALE_STRAIGHT_SPAN);

  for (let index = 1; index <= sampleCount; index += 1) {
    const current = whaleSwimFrameAtDistance(
      WHALE_STRAIGHT_SPAN + stepLength * index,
    );
    const travelled = Math.hypot(
      current.along - previous.along,
      current.outward - previous.outward,
    );
    assert.ok(Math.abs(travelled - stepLength) < stepLength * 0.02);
    previous = current;
  }
});

test("whale route stays in open water with a unit heading", () => {
  for (let index = 0; index < 500; index += 1) {
    const frame = whaleSwimFrameAtDistance(
      (index / 500) * WHALE_LAP_LENGTH,
    );
    assert.ok(frame.outward >= -EPSILON);
    assert.ok(frame.outward <= (WHALE_TURN_RADIUS * 32) / 27 + EPSILON);
    assertClose(
      Math.hypot(frame.tangentAlong, frame.tangentOutward),
      1,
      "unit tangent",
    );
  }
});
