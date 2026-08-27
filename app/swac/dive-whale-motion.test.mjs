import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_WHALE_ENCOUNTER_CLOCK,
  WHALE_CRUISE_SPEED,
  WHALE_ENCOUNTER_FREEZE_DEPTH,
  WHALE_ENCOUNTER_MAX_DELTA_SECONDS,
  WHALE_ENCOUNTER_RESET_DEPTH,
  WHALE_ENCOUNTER_START_ALONG,
  WHALE_ENCOUNTER_START_DEPTH,
  WHALE_LAP_LENGTH,
  WHALE_MOUTH_CLOSED_ANGLE,
  WHALE_MOUTH_CYCLE_SECONDS,
  WHALE_MOUTH_OPEN_ANGLE,
  WHALE_ROUTE_HALF_EXTENT,
  WHALE_STRAIGHT_SPAN,
  WHALE_TURN_LENGTH,
  WHALE_TURN_RADIUS,
  advanceWhaleEncounterClock,
  whaleMouthAngleAtTime,
  whaleSwimFrameAtDistance,
  whaleSwimFrameAtTime,
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

test("encounter-local route starts near centre and crosses it at cruise speed", () => {
  const start = whaleSwimFrameAtTime(0);
  assertClose(start.along, WHALE_ENCOUNTER_START_ALONG, "encounter start");
  assertClose(start.outward, 0, "encounter starts on straight");
  assertClose(start.tangentAlong, 1, "encounter faces centre");
  assertClose(start.tangentOutward, 0, "encounter starts without a turn");

  const centreTime = Math.abs(WHALE_ENCOUNTER_START_ALONG) / WHALE_CRUISE_SPEED;
  assertClose(centreTime, 0.9, "centre timing");
  assertClose(whaleSwimFrameAtTime(centreTime).along, 0, "centre crossing");
});

test("encounter clock starts, clamps frame gaps, and freezes past the encounter", () => {
  const waiting = advanceWhaleEncounterClock(
    INITIAL_WHALE_ENCOUNTER_CLOCK,
    WHALE_ENCOUNTER_START_DEPTH - 1,
    0.05,
  );
  assert.deepEqual(waiting, INITIAL_WHALE_ENCOUNTER_CLOCK);

  const started = advanceWhaleEncounterClock(
    waiting,
    WHALE_ENCOUNTER_START_DEPTH,
    0.05,
  );
  assert.deepEqual(started, { time: 0, started: true });

  const advanced = advanceWhaleEncounterClock(started, 550, 0.04);
  assertClose(advanced.time, 0.04, "ordinary frame advances locally");

  const clamped = advanceWhaleEncounterClock(advanced, 550, 3);
  assertClose(
    clamped.time,
    0.04 + WHALE_ENCOUNTER_MAX_DELTA_SECONDS,
    "long frame is clamped",
  );

  const frozen = advanceWhaleEncounterClock(
    clamped,
    WHALE_ENCOUNTER_FREEZE_DEPTH,
    0.08,
  );
  assert.deepEqual(frozen, clamped);

  const resumed = advanceWhaleEncounterClock(
    frozen,
    WHALE_ENCOUNTER_FREEZE_DEPTH - 1,
    0.02,
  );
  assertClose(resumed.time, clamped.time + 0.02, "reverse scroll resumes");
});

test("direct mid-descent entry starts locally and deep entry waits frozen", () => {
  const midDescent = advanceWhaleEncounterClock(
    INITIAL_WHALE_ENCOUNTER_CLOCK,
    550,
    0.08,
  );
  assert.deepEqual(midDescent, { time: 0, started: true });
  assertClose(
    advanceWhaleEncounterClock(midDescent, 550, 0.02).time,
    0.02,
    "mid-descent entry advances on its next frame",
  );

  const deepEntry = advanceWhaleEncounterClock(
    INITIAL_WHALE_ENCOUNTER_CLOCK,
    WHALE_ENCOUNTER_FREEZE_DEPTH,
    0.08,
  );
  assert.deepEqual(deepEntry, { time: 0, started: true });
  assertClose(
    advanceWhaleEncounterClock(
      deepEntry,
      WHALE_ENCOUNTER_FREEZE_DEPTH - 1,
      0.02,
    ).time,
    0.02,
    "reverse entry resumes from the local start",
  );
});

test("encounter clock resets only below its hysteresis threshold", () => {
  const running = { time: 2.4, started: true };
  const held = advanceWhaleEncounterClock(
    running,
    WHALE_ENCOUNTER_RESET_DEPTH,
    0.02,
  );
  assertClose(held.time, 2.42, "reset threshold remains active");

  const reset = advanceWhaleEncounterClock(
    held,
    WHALE_ENCOUNTER_RESET_DEPTH - 0.001,
    0.02,
  );
  assert.deepEqual(reset, INITIAL_WHALE_ENCOUNTER_CLOCK);
});

test("encounter clock ignores invalid or backwards frame deltas", () => {
  const running = { time: 1.2, started: true };
  assert.deepEqual(advanceWhaleEncounterClock(running, 550, -0.5), running);
  assert.deepEqual(advanceWhaleEncounterClock(running, 550, Number.NaN), running);
  assert.deepEqual(
    advanceWhaleEncounterClock(running, 550, Number.POSITIVE_INFINITY),
    running,
  );
});

test("whale mouth eases through a bounded gape and closes cleanly", () => {
  assertClose(
    whaleMouthAngleAtTime(0),
    WHALE_MOUTH_CLOSED_ANGLE,
    "cycle starts closed",
  );
  assertClose(
    whaleMouthAngleAtTime(WHALE_MOUTH_CYCLE_SECONDS * 0.7),
    WHALE_MOUTH_OPEN_ANGLE,
    "opening reaches full gape",
  );
  assertClose(
    whaleMouthAngleAtTime(WHALE_MOUTH_CYCLE_SECONDS * 0.78),
    WHALE_MOUTH_OPEN_ANGLE,
    "full gape holds",
  );
  assertClose(
    whaleMouthAngleAtTime(WHALE_MOUTH_CYCLE_SECONDS),
    WHALE_MOUTH_CLOSED_ANGLE,
    "cycle closes without a seam",
  );
  assertClose(
    whaleMouthAngleAtTime(-WHALE_MOUTH_CYCLE_SECONDS),
    WHALE_MOUTH_CLOSED_ANGLE,
    "negative time wraps cleanly",
  );

  for (let sample = 0; sample <= 1_000; sample += 1) {
    const angle = whaleMouthAngleAtTime(
      (sample / 1_000) * WHALE_MOUTH_CYCLE_SECONDS,
    );
    assert.ok(angle >= WHALE_MOUTH_CLOSED_ANGLE - EPSILON);
    assert.ok(angle <= WHALE_MOUTH_OPEN_ANGLE + EPSILON);
  }
});
