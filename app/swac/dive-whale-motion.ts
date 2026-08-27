export const WHALE_CRUISE_SPEED = 0.5;
export const WHALE_TURN_RADIUS = 1.25;
export const WHALE_MOUTH_CYCLE_SECONDS = 11.3;
export const WHALE_MOUTH_CLOSED_ANGLE = 0.035;
export const WHALE_MOUTH_OPEN_ANGLE = 0.16;
export const WHALE_ENCOUNTER_START_DEPTH = 460;
export const WHALE_ENCOUNTER_RESET_DEPTH = 430;
export const WHALE_ENCOUNTER_FREEZE_DEPTH = 760;
export const WHALE_ENCOUNTER_MAX_DELTA_SECONDS = 0.1;
export const WHALE_ENCOUNTER_START_ALONG = -0.45;

// Keep the turn inside the old nine-unit endpoint while leaving enough room
// for the whale to describe a visible arc instead of pivoting in place.
export const WHALE_ROUTE_HALF_EXTENT = 9;
export const WHALE_STRAIGHT_SPAN =
  (WHALE_ROUTE_HALF_EXTENT - WHALE_TURN_RADIUS) * 2;

export type WhaleSwimFrame = {
  along: number;
  outward: number;
  tangentAlong: number;
  tangentOutward: number;
};

export type WhaleEncounterClock = {
  time: number;
  started: boolean;
};

export const INITIAL_WHALE_ENCOUNTER_CLOCK: WhaleEncounterClock = {
  time: 0,
  started: false,
};

/**
 * Advances the whale only while its encounter is in view. The separate reset
 * threshold gives reverse scrolling some hysteresis, and the freeze threshold
 * stops an offscreen tab or long pause from advancing the encounter.
 */
export function advanceWhaleEncounterClock(
  clock: WhaleEncounterClock,
  depth: number,
  deltaSeconds: number,
): WhaleEncounterClock {
  if (depth < WHALE_ENCOUNTER_RESET_DEPTH) {
    return INITIAL_WHALE_ENCOUNTER_CLOCK;
  }

  if (!clock.started) {
    return depth >= WHALE_ENCOUNTER_START_DEPTH
      ? { time: 0, started: true }
      : clock;
  }

  if (depth >= WHALE_ENCOUNTER_FREEZE_DEPTH) {
    return clock;
  }

  const safeDelta = Number.isFinite(deltaSeconds)
    ? Math.min(WHALE_ENCOUNTER_MAX_DELTA_SECONDS, Math.max(0, deltaSeconds))
    : 0;

  if (safeDelta === 0) {
    return clock;
  }

  return { time: clock.time + safeDelta, started: true };
}

const ORBIT_SAMPLE_COUNT = 512;

function smoothstep(progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * A deliberate gape rather than a constant fish-like chomp: rest closed,
 * ease open, hold briefly, then close a little more slowly.
 */
export function whaleMouthAngleAtTime(time: number) {
  const phase =
    (((time % WHALE_MOUTH_CYCLE_SECONDS) + WHALE_MOUTH_CYCLE_SECONDS) %
      WHALE_MOUTH_CYCLE_SECONDS) /
    WHALE_MOUTH_CYCLE_SECONDS;
  let openness = 0;

  if (phase >= 0.55 && phase < 0.7) {
    openness = smoothstep((phase - 0.55) / 0.15);
  } else if (phase >= 0.7 && phase < 0.78) {
    openness = 1;
  } else if (phase >= 0.78 && phase < 0.96) {
    openness = 1 - smoothstep((phase - 0.78) / 0.18);
  }

  return (
    WHALE_MOUTH_CLOSED_ANGLE +
    (WHALE_MOUTH_OPEN_ANGLE - WHALE_MOUTH_CLOSED_ANGLE) * openness
  );
}

function orbitPoint(angle: number) {
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return {
    along: sine,
    outward: sine * sine * (1 + cosine),
  };
}

function buildOrbitArcTable() {
  const cumulative = [0];
  let length = 0;
  let previous = orbitPoint(0);

  for (let index = 1; index <= ORBIT_SAMPLE_COUNT; index += 1) {
    const current = orbitPoint((index / ORBIT_SAMPLE_COUNT) * Math.PI);
    length += Math.hypot(
      current.along - previous.along,
      current.outward - previous.outward,
    );
    cumulative.push(length);
    previous = current;
  }

  return { cumulative, length };
}

const ORBIT_ARC_TABLE = buildOrbitArcTable();

export const WHALE_TURN_LENGTH =
  ORBIT_ARC_TABLE.length * WHALE_TURN_RADIUS;
export const WHALE_LAP_LENGTH =
  WHALE_STRAIGHT_SPAN * 2 + WHALE_TURN_LENGTH * 2;

function orbitAngleAtDistance(distance: number) {
  const normalizedDistance = Math.min(
    ORBIT_ARC_TABLE.length,
    Math.max(0, distance / WHALE_TURN_RADIUS),
  );
  let low = 0;
  let high = ORBIT_SAMPLE_COUNT;

  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (ORBIT_ARC_TABLE.cumulative[middle] <= normalizedDistance) {
      low = middle;
    } else {
      high = middle;
    }
  }

  const segmentStart = ORBIT_ARC_TABLE.cumulative[low];
  const segmentLength = ORBIT_ARC_TABLE.cumulative[high] - segmentStart;
  const segmentProgress =
    segmentLength === 0 ? 0 : (normalizedDistance - segmentStart) / segmentLength;
  return ((low + segmentProgress) / ORBIT_SAMPLE_COUNT) * Math.PI;
}

function endpointOrbitFrame(
  endpoint: number,
  direction: -1 | 1,
  distance: number,
): WhaleSwimFrame {
  const angle = orbitAngleAtDistance(distance);
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const sineSquared = sine * sine;
  const derivativeAlong = direction * WHALE_TURN_RADIUS * cosine;
  const derivativeOutward =
    WHALE_TURN_RADIUS *
    (2 * sine * cosine * (1 + cosine) - sineSquared * sine);
  const tangentLength = Math.hypot(derivativeAlong, derivativeOutward);

  return {
    along: endpoint + direction * sine * WHALE_TURN_RADIUS,
    // The two halves take different lines through open water, forming a small
    // teardrop loop that returns to the endpoint facing the opposite way.
    outward: WHALE_TURN_RADIUS * sineSquared * (1 + cosine),
    tangentAlong: derivativeAlong / tangentLength,
    tangentOutward: derivativeOutward / tangentLength,
  };
}

/**
 * A straight route with a compact loop at either end. Each loop leaves and
 * returns to the same endpoint with the opposite tangent, so the whale can
 * reverse along its original lane without ever snapping its heading.
 */
export function whaleSwimFrameAtDistance(distance: number): WhaleSwimFrame {
  const phase =
    ((distance % WHALE_LAP_LENGTH) + WHALE_LAP_LENGTH) % WHALE_LAP_LENGTH;
  const halfSpan = WHALE_STRAIGHT_SPAN / 2;

  if (phase < WHALE_STRAIGHT_SPAN) {
    return {
      along: -halfSpan + phase,
      outward: 0,
      tangentAlong: 1,
      tangentOutward: 0,
    };
  }

  const afterOutbound = phase - WHALE_STRAIGHT_SPAN;
  if (afterOutbound < WHALE_TURN_LENGTH) {
    return endpointOrbitFrame(halfSpan, 1, afterOutbound);
  }

  const afterFarTurn = afterOutbound - WHALE_TURN_LENGTH;
  if (afterFarTurn < WHALE_STRAIGHT_SPAN) {
    return {
      along: halfSpan - afterFarTurn,
      outward: 0,
      tangentAlong: -1,
      tangentOutward: 0,
    };
  }

  return endpointOrbitFrame(
    -halfSpan,
    -1,
    afterFarTurn - WHALE_STRAIGHT_SPAN,
  );
}

export function whaleSwimFrameAtTime(time: number) {
  const startDistance =
    WHALE_STRAIGHT_SPAN / 2 + WHALE_ENCOUNTER_START_ALONG;
  return whaleSwimFrameAtDistance(
    startDistance + time * WHALE_CRUISE_SPEED,
  );
}
