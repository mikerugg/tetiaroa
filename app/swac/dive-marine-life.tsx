"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  SHELF_TOP_DEPTH,
  UNITS_PER_METRE,
  reefFrameAtDepth,
} from "./dive-coordinates";
import type { ReefFrame } from "./dive-coordinates";
import { isWithinDepthBand } from "./dive-creature-geometry";

/*
 * The lagoon at the top of the descent. Everything is built from primitives
 * and a small ring-lofting helper — no external models, so nothing extra is
 * fetched and the low-poly language matches the rest of the scene.
 *
 * Heading convention, which is easy to get wrong: Object3D.lookAt() aims a
 * CAMERA's -Z at the target, but a plain mesh's +Z. So after lookAt() every
 * animal needs one correction turning its own nose axis onto +Z:
 *
 *   nose towards -Z (lofted bodies)  ->  rotateY(Math.PI)
 *   nose towards +X (sphere bodies)  ->  rotateY(-Math.PI / 2)
 *
 * Assuming the camera convention here is what had the whole lagoon swimming
 * backwards.
 */

/** Bodies lofted by buildBody point their nose down -Z. */
const NOSE_TOWARDS_NEGATIVE_Z = Math.PI;
/** Bodies assembled from stretched spheres point their nose down +X. */
const NOSE_TOWARDS_POSITIVE_X = -Math.PI / 2;

type ProfilePoint = readonly [z: number, y: number];
type FinPoint = readonly [x: number, y: number, z: number];

/** Triangulates several fin outlines into one shared draw call. */
function buildFinSet(outlines: ReadonlyArray<readonly FinPoint[]>) {
  const positions: number[] = [];

  outlines.forEach((points) => {
    for (let i = 1; i < points.length - 1; i += 1) {
      positions.push(...points[0], ...points[i], ...points[i + 1]);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

type ProfileLoftSection = {
  x: number;
  top: number;
  bottom: number;
  halfWidth: number;
};

/**
 * Lofts a +X-pointing body through elliptical YZ sections. Unlike an
 * extrusion, every station can change both height and width, so the flanks
 * stay convex and the snout and caudal peduncle taper in three dimensions.
 */
function buildProfileLoftBody(
  sections: readonly ProfileLoftSection[],
  segments = 12,
  alternateDiagonals = false,
) {
  const positions: number[] = [];
  const indices: number[] = [];
  const nose = sections[sections.length - 1];
  const noseIsApex =
    nose.halfWidth === 0 || Math.abs(nose.top - nose.bottom) < 0.001;
  const ringSections = noseIsApex ? sections.slice(0, -1) : sections;

  ringSections.forEach(({ x, top, bottom, halfWidth }) => {
    const centreY = (top + bottom) / 2;
    const halfHeight = (top - bottom) / 2;

    for (let segment = 0; segment < segments; segment += 1) {
      const angle = (segment / segments) * Math.PI * 2;
      positions.push(
        x,
        centreY + Math.sin(angle) * halfHeight,
        Math.cos(angle) * halfWidth,
      );
    }
  });

  for (let section = 0; section < ringSections.length - 1; section += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = section * segments + segment;
      const b = section * segments + ((segment + 1) % segments);
      const c = (section + 1) * segments + segment;
      const d = (section + 1) * segments + ((segment + 1) % segments);
      // Sections advance along +X while ring angles advance from +Z toward
      // +Y. Reverse the strip triangles so their normals face out from the
      // body instead of into it.
      if (alternateDiagonals && (section + segment) % 2 === 1) {
        indices.push(a, c, d, a, d, b);
      } else {
        indices.push(a, c, b, b, c, d);
      }
    }
  }

  // The sections run from the tail root towards the nose. Close the peduncle
  // ring and converge the final shoulder ring into a single snout apex.
  const tail = sections[0];
  const tailCentre = positions.length / 3;
  positions.push(tail.x, (tail.top + tail.bottom) / 2, 0);
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(tailCentre, segment, (segment + 1) % segments);
  }

  const noseCentre = positions.length / 3;
  const noseStart = (ringSections.length - 1) * segments;
  positions.push(nose.x, (nose.top + nose.bottom) / 2, 0);
  for (let segment = 0; segment < segments; segment += 1) {
    const current = noseStart + segment;
    const next = noseStart + ((segment + 1) % segments);
    indices.push(noseCentre, next, current);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function sampleProfileLoft(
  sections: readonly ProfileLoftSection[],
  x: number,
) {
  const first = sections[0];
  if (x <= first.x) return first;

  const last = sections[sections.length - 1];
  if (x >= last.x) return last;

  for (let index = 1; index < sections.length; index += 1) {
    const right = sections[index];
    if (x <= right.x) {
      const left = sections[index - 1];
      const progress = (x - left.x) / (right.x - left.x);
      return {
        x,
        top: THREE.MathUtils.lerp(left.top, right.top, progress),
        bottom: THREE.MathUtils.lerp(left.bottom, right.bottom, progress),
        halfWidth: THREE.MathUtils.lerp(
          left.halfWidth,
          right.halfWidth,
          progress,
        ),
      };
    }
  }

  return last;
}

/** Wraps broad-side markings over the loft instead of floating on flat slabs. */
function buildWrappedSideMarkings(
  profiles: ReadonlyArray<readonly ProfilePoint[]>,
  sections: readonly ProfileLoftSection[],
  lift: number,
  subdivisions = 1,
) {
  const positions: number[] = [];

  const midpoint = (a: ProfilePoint, b: ProfilePoint): ProfilePoint => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];

  const pushSurfacePoint = ([x, y]: ProfilePoint, side: number) => {
    const section = sampleProfileLoft(sections, x);
    const centreY = (section.top + section.bottom) / 2;
    const halfHeight = Math.max(0.001, (section.top - section.bottom) / 2);
    const vertical = THREE.MathUtils.clamp(
      (y - centreY) / halfHeight,
      -0.995,
      0.995,
    );
    const surfaceWidth =
      section.halfWidth * Math.sqrt(Math.max(0, 1 - vertical * vertical));
    positions.push(x, y, side * (surfaceWidth + lift));
  };

  const emitTriangle = (
    a: ProfilePoint,
    b: ProfilePoint,
    c: ProfilePoint,
    side: number,
    remaining: number,
  ): void => {
    if (remaining === 0) {
      pushSurfacePoint(a, side);
      pushSurfacePoint(b, side);
      pushSurfacePoint(c, side);
      return;
    }

    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    emitTriangle(a, ab, ca, side, remaining - 1);
    emitTriangle(ab, b, bc, side, remaining - 1);
    emitTriangle(ca, bc, c, side, remaining - 1);
    emitTriangle(ab, bc, ca, side, remaining - 1);
  };

  [-1, 1].forEach((side) => {
    profiles.forEach((profile) => {
      const contour = profile.map(([x, y]) => new THREE.Vector2(x, y));
      THREE.ShapeUtils.triangulateShape(contour, []).forEach(([a, b, c]) => {
        emitTriangle(
          profile[a],
          profile[b],
          profile[c],
          side,
          subdivisions,
        );
      });
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function ellipseProfile(
  z: number,
  y: number,
  zRadius: number,
  yRadius: number,
  segments = 8,
): ProfilePoint[] {
  return Array.from({ length: segments }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    return [
      z + Math.cos(angle) * zRadius,
      y + Math.sin(angle) * yRadius,
    ] as const;
  });
}

function useButterflyFishGeometries() {
  return useMemo(() => {
    // Build in the +X helper frame, then rotate back into the school's -Z
    // heading convention. This keeps the side silhouette while giving every
    // fish a tapered, laterally compressed elliptical cross-section.
    const sections: readonly ProfileLoftSection[] = [
      { x: -0.72, top: 0.14, bottom: -0.12, halfWidth: 0.045 },
      { x: -0.62, top: 0.254, bottom: -0.24, halfWidth: 0.065 },
      { x: -0.58, top: 0.3, bottom: -0.264, halfWidth: 0.08 },
      { x: -0.24, top: 0.489, bottom: -0.47, halfWidth: 0.135 },
      { x: -0.22, top: 0.5, bottom: -0.472, halfWidth: 0.14 },
      { x: 0.2, top: 0.58, bottom: -0.516, halfWidth: 0.15 },
      { x: 0.24, top: 0.561, bottom: -0.52, halfWidth: 0.15 },
      { x: 0.58, top: 0.4, bottom: -0.387, halfWidth: 0.115 },
      { x: 0.7, top: 0.275, bottom: -0.34, halfWidth: 0.085 },
      { x: 0.82, top: 0.15, bottom: -0.215, halfWidth: 0.045 },
      { x: 0.94, top: -0.09, bottom: -0.09, halfWidth: 0 },
    ];
    const body = buildProfileLoftBody(sections);
    body.rotateY(Math.PI / 2);

    const wrapMarkings = (
      profiles: ReadonlyArray<readonly ProfilePoint[]>,
      lift: number,
      subdivisions = 1,
    ) => {
      const transformed = profiles.map((profile) =>
        profile.map(([z, y]) => [-z, y] as const),
      );
      const geometry = buildWrappedSideMarkings(
        transformed,
        sections,
        lift,
        subdivisions,
      );
      geometry.rotateY(Math.PI / 2);
      return geometry;
    };

    const fins = buildFinSet([
      // The continuous arched dorsal and anal fins define the species even at
      // the smallest school scale.
      [
        [0, 0.34, -0.58],
        [0, 0.73, -0.18],
        [0, 0.68, 0.28],
        [0, 0.5, 0.6],
        [0, 0.2, 0.72],
      ],
      [
        [0, -0.34, -0.2],
        [0, -0.64, 0.08],
        [0, -0.59, 0.42],
        [0, -0.3, 0.69],
        [0, -0.12, 0.72],
      ],
      // Paired pectorals break the otherwise paper-flat side profile.
      [
        [0.11, -0.02, -0.29],
        [0.44, -0.14, 0.05],
        [0.13, -0.18, 0.2],
      ],
      [
        [-0.11, -0.02, -0.29],
        [-0.44, -0.14, 0.05],
        [-0.13, -0.18, 0.2],
      ],
    ]);

    // Local to a hinge at the caudal peduncle, so this can beat separately.
    const tail = buildFinSet([
      [
        [0, 0.13, 0],
        [0, 0.4, 0.3],
        [0, 0.33, 0.52],
        [0, 0, 0.61],
        [0, -0.32, 0.5],
        [0, -0.4, 0.28],
        [0, -0.12, 0],
      ],
    ]);

    const whiteFace = wrapMarkings(
      [
        [
          [-0.84, -0.14],
          [-0.68, -0.3],
          [-0.5, -0.22],
          [-0.39, 0.13],
          [-0.49, 0.33],
          [-0.66, 0.28],
          [-0.79, 0.08],
        ],
      ],
      0.004,
      2,
    );

    const blackMarkings = wrapMarkings(
      [
        // Broad upper saddle.
        [
          [-0.53, 0.24],
          [-0.27, 0.5],
          [0.18, 0.47],
          [0.53, 0.27],
          [0.57, 0.06],
          [0.33, -0.05],
          [-0.08, -0.1],
          [-0.38, 0],
        ],
        // Diagonal eye mask.
        [
          [-0.79, -0.18],
          [-0.66, -0.28],
          [-0.48, 0.25],
          [-0.56, 0.36],
          [-0.7, 0.16],
        ],
        // A short mouth seam at the pointed snout.
        [
          [-0.93, -0.12],
          [-0.78, -0.17],
          [-0.75, -0.13],
          [-0.88, -0.08],
        ],
        // A few scale-like flecks where the black saddle fades into yellow.
        ellipseProfile(-0.18, -0.16, 0.025, 0.018, 6),
        ellipseProfile(-0.04, -0.19, 0.022, 0.017, 6),
        ellipseProfile(0.1, -0.17, 0.021, 0.016, 6),
        ellipseProfile(0.23, -0.14, 0.019, 0.015, 6),
      ],
      0.006,
      2,
    );

    const whiteAccents = wrapMarkings(
      [
        ellipseProfile(-0.13, 0.29, 0.105, 0.1),
        ellipseProfile(0.34, 0.24, 0.072, 0.105),
        // Pale slash at the rear of the belly, visible in the reference fish.
        [
          [0.34, -0.3],
          [0.61, -0.17],
          [0.62, -0.08],
          [0.32, -0.22],
        ],
      ],
      0.009,
    );

    const eyeRims = wrapMarkings(
      [ellipseProfile(-0.69, -0.05, 0.064, 0.072, 10)],
      0.012,
    );
    const pupils = wrapMarkings(
      [ellipseProfile(-0.7, -0.05, 0.037, 0.044, 8)],
      0.016,
    );

    return {
      body,
      fins,
      tail,
      whiteFace,
      blackMarkings,
      whiteAccents,
      eyeRims,
      pupils,
    };
  }, []);
}

function useGiantJackGeometries() {
  return useMemo(() => {
    // A steep forehead, deep shoulder and narrow caudal peduncle are the
    // simplest cues that separate an uru'ati from the shark beside it. The
    // width peaks behind the shoulder and pinches hard at both ends, producing
    // the laterally compressed oval a jack should show nose-on.
    const sections: readonly ProfileLoftSection[] = [
      { x: -1.46, top: 0.13, bottom: -0.12, halfWidth: 0.065 },
      { x: -1.3, top: 0.25, bottom: -0.18, halfWidth: 0.1 },
      { x: -1.18, top: 0.34, bottom: -0.254, halfWidth: 0.145 },
      { x: -0.78, top: 0.526, bottom: -0.5, halfWidth: 0.225 },
      { x: -0.62, top: 0.6, bottom: -0.544, halfWidth: 0.255 },
      { x: -0.12, top: 0.721, bottom: -0.68, halfWidth: 0.29 },
      { x: 0.04, top: 0.76, bottom: -0.669, halfWidth: 0.295 },
      { x: 0.72, top: 0.68, bottom: -0.62, halfWidth: 0.275 },
      { x: 1.25, top: 0.5, bottom: -0.425, halfWidth: 0.22 },
      { x: 1.48, top: 0.285, bottom: -0.34, halfWidth: 0.15 },
      { x: 1.55, top: 0.22, bottom: -0.22, halfWidth: 0.1 },
      { x: 1.62, top: -0.1, bottom: -0.1, halfWidth: 0 },
    ];
    const body = buildProfileLoftBody(sections);

    const staticFins = buildFinSet([
      // Short first dorsal, swept second dorsal and matching anal fin.
      [
        [0.72, 0.6, 0],
        [0.43, 0.91, 0],
        [0.1, 0.69, 0],
      ],
      [
        [0.05, 0.68, 0],
        [-0.18, 1.04, 0],
        [-0.58, 0.63, 0],
        [-1.14, 0.28, 0],
      ],
      [
        [0.03, -0.58, 0],
        [-0.18, -0.9, 0],
        [-0.6, -0.54, 0],
        [-1.14, -0.25, 0],
      ],
      // Long sickle-shaped pectorals, one on each broad side.
      [
        [0.78, 0.02, 0.28],
        [0.02, -0.25, 0.72],
        [-0.55, -0.17, 0.31],
      ],
      [
        [0.78, 0.02, -0.28],
        [0.02, -0.25, -0.72],
        [-0.55, -0.17, -0.31],
      ],
    ]);

    // Two convex lobes make a clean homocercal fork without a bad triangle
    // fan crossing the notch in the middle.
    const tail = buildFinSet([
      [
        [0, 0.12, 0],
        [-0.34, 0.73, 0],
        [-0.76, 0.9, 0],
        [-0.58, 0.22, 0],
        [-0.27, 0, 0],
      ],
      [
        [0, -0.12, 0],
        [-0.34, -0.73, 0],
        [-0.76, -0.9, 0],
        [-0.58, -0.22, 0],
        [-0.27, 0, 0],
      ],
    ]);

    const eyeRims = buildWrappedSideMarkings(
      [ellipseProfile(1.28, 0.22, 0.075, 0.082, 10)],
      sections,
      0.009,
    );
    const pupils = buildWrappedSideMarkings(
      [ellipseProfile(1.3, 0.22, 0.042, 0.05, 8)],
      sections,
      0.014,
    );

    return {
      body,
      staticFins,
      tail,
      eyeRims,
      pupils,
    };
  }, []);
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const FISH_COUNT = 32;
const BUTTERFLY_YELLOW = "#f0d62e";
const BUTTERFLY_FIN = "#a8c92a";
const BUTTERFLY_BLACK = "#071426";
const BUTTERFLY_IVORY = "#f4f0d8";
const BUTTERFLY_AMBER = "#d89418";
/** Offsets are proven against the route extrema to keep motion within 5–60 m. */
const SMALL_FISH_DEPTH_OFFSET_MIN = -8.3;
const SMALL_FISH_DEPTH_OFFSET_MAX = 24.4;
/** The shallow elbow's stable across-wall coordinate from 22–60 metres. */
const SMALL_FISH_PIPE_ACROSS = 0.568;
const SMALL_FISH_PALETTES = [
  {
    body: new THREE.Color(BUTTERFLY_YELLOW),
    fin: new THREE.Color(BUTTERFLY_FIN),
  },
  {
    body: new THREE.Color("#9b67b6"),
    fin: new THREE.Color("#6f4f98"),
  },
  {
    body: new THREE.Color("#4f83c5"),
    fin: new THREE.Color("#315fa5"),
  },
] as const;

const TURTLE_DEPTH_METRES = 40;
const GIANT_JACK_DEPTH_METRES = 80;
const SHARK_DEPTH_METRES = 120;
const LAGOON_LIFE_MAX_DEPTH = 175;
const TURTLE_DEPTH_Y = -TURTLE_DEPTH_METRES * UNITS_PER_METRE;
const GIANT_JACK_DEPTH_Y = -GIANT_JACK_DEPTH_METRES * UNITS_PER_METRE;
const SHARK_DEPTH_Y = -SHARK_DEPTH_METRES * UNITS_PER_METRE;

function isLagoonLifeActive(depth: number) {
  // Descent depth is clamped at the surface, so a surface-centred band keeps
  // the existing 0 <= depth < 175 contract while sharing exact edge semantics
  // with the deeper animals.
  return isWithinDepthBand(depth, 0, LAGOON_LIFE_MAX_DEPTH);
}

function setReefOrbitPoint(
  target: THREE.Vector3,
  frame: ReefFrame,
  across: number,
  ocean: number,
  y: number,
) {
  target
    .copy(frame.origin)
    .addScaledVector(frame.across, across)
    .addScaledVector(frame.ocean, ocean);
  target.y = y;
  return target;
}

/**
 * Local reef-frame route: x travels across the wall, y is distance seaward,
 * and z is a small depth offset. The long low-y run follows the shelf face;
 * the high-y arc brings the turtle back past the viewer.
 */
const TURTLE_ROUTE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.2, 8.8, 0.05),
    new THREE.Vector3(1.8, 9.25, 0.12),
    new THREE.Vector3(3.4, 9, 0.08),
    new THREE.Vector3(5, 7, -0.06),
    new THREE.Vector3(5.5, 4.3, -0.12),
    new THREE.Vector3(2.8, 4.1, 0.02),
    new THREE.Vector3(-1, 4.1, 0.1),
    new THREE.Vector3(-5.2, 4.25, -0.04),
    new THREE.Vector3(-6.1, 5, -0.1),
    new THREE.Vector3(-5.2, 7.4, 0.04),
  ],
  true,
  "centripetal",
  0.5,
);
TURTLE_ROUTE.arcLengthDivisions = 240;

const GIANT_JACK_FORMATION = [
  { id: "leader", x: 0, y: 0, z: 0, scale: 1, tailPhase: 0 },
  {
    id: "port",
    x: -2.65,
    y: 0.28,
    z: 1.45,
    scale: 0.62,
    tailPhase: 1.35,
  },
  {
    id: "starboard",
    x: -2.95,
    y: -0.24,
    z: -1.58,
    scale: 0.54,
    tailPhase: 2.7,
  },
] as const;
const GIANT_JACK_PREVIEW_FORMATION = [GIANT_JACK_FORMATION[0]] as const;

type DepthSignal = { get: () => number };

/**
 * A closed circuit around the shallow pipe. In this local reef frame, x runs
 * across the wall, y runs out towards the camera, and z supplies a subtle
 * shallow/deep contour around each fish's independently randomized depth lane.
 *
 * The near leg (y ~= 4.4) brings the fish back in front of the pipe. The deep
 * leg (y ~= 1.2) runs between the pipe and reef face. Both crossovers happen
 * at the far edges of the school, never through the pipe in the middle.
 */
const SMALL_FISH_ROUTE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-6.4, 4.8, 18),
    new THREE.Vector3(-2.8, 5.2, 15),
    new THREE.Vector3(1.2, 5.3, 14),
    new THREE.Vector3(5.9, 4.7, 19),
    new THREE.Vector3(7, 3, 23),
    new THREE.Vector3(6.5, 1.08, 27),
    new THREE.Vector3(3.4, 0.95, 30),
    new THREE.Vector3(0.15, 0.84, 33),
    new THREE.Vector3(-3.3, 0.92, 35),
    new THREE.Vector3(-6.5, 1.1, 31),
    new THREE.Vector3(-7.1, 3, 24),
  ],
  true,
  "centripetal",
  0.5,
);
SMALL_FISH_ROUTE.arcLengthDivisions = 300;

type SchoolFish = {
  direction: -1 | 1;
  phase: number;
  speed: number;
  surgeRate: number;
  surgeAmount: number;
  pathPhase: number;
  acrossOffset: number;
  oceanOffset: number;
  acrossWander: number;
  oceanWander: number;
  driftRate: number;
  driftAmount: number;
  depthOffset: number;
  depthWander: number;
  depthRate: number;
  depthPhase: number;
  variant: 0 | 1 | 2;
  rollRate: number;
  rollAmplitude: number;
  scale: number;
  tailBeat: number;
  tailPhase: number;
  tailAmplitude: number;
};

function setSmallFishRoutePoint(
  target: THREE.Vector3,
  routePoint: THREE.Vector3,
  frame: ReefFrame,
  fish: SchoolFish,
  time: number,
  widthScale: number,
) {
  const progress = THREE.MathUtils.euclideanModulo(
    fish.phase +
      fish.direction *
        (time * fish.speed +
          Math.sin(time * fish.surgeRate + fish.pathPhase) * fish.surgeAmount),
    1,
  );
  const routeAngle = progress * Math.PI * 2;
  SMALL_FISH_ROUTE.getPointAt(progress, routePoint);

  const across =
    SMALL_FISH_PIPE_ACROSS +
    (routePoint.x - SMALL_FISH_PIPE_ACROSS) * widthScale +
    fish.acrossOffset +
    Math.sin(routeAngle * 2 + fish.pathPhase) * fish.acrossWander +
    Math.sin(time * fish.driftRate + fish.pathPhase) * fish.driftAmount;
  const routeDepth =
    routePoint.z +
    fish.depthOffset +
    Math.sin(time * fish.depthRate + fish.depthPhase) * fish.depthWander +
    Math.sin(routeAngle * 2 - fish.depthPhase) * 0.1;
  const behindWeight =
    1 - THREE.MathUtils.smoothstep(routePoint.y, 1.25, 3);
  const deepWallLift =
    behindWeight * THREE.MathUtils.smoothstep(routeDepth, 45, 60) * 0.15;
  // Deep wall facets project further seaward, so the wall-side leg eases out
  // slightly below 45 m while remaining safely behind the pipe.
  const ocean =
    routePoint.y +
      fish.oceanOffset +
      Math.sin(routeAngle * 3 + fish.pathPhase) * fish.oceanWander +
      deepWallLift;

  setReefOrbitPoint(
    target,
    frame,
    across,
    ocean,
    -routeDepth * UNITS_PER_METRE,
  );
  return progress;
}

/** Masked butterflyfish circling both sides of the shallow intake pipe. */
function FishSchool({ depth }: { depth: DepthSignal }) {
  const aspect = useThree((state) => state.size.width / state.size.height);
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const finRef = useRef<THREE.InstancedMesh>(null);
  const tailRef = useRef<THREE.InstancedMesh>(null);
  const whiteFaceRef = useRef<THREE.InstancedMesh>(null);
  const blackMarkingsRef = useRef<THREE.InstancedMesh>(null);
  const whiteAccentsRef = useRef<THREE.InstancedMesh>(null);
  const eyeRimsRef = useRef<THREE.InstancedMesh>(null);
  const pupilsRef = useRef<THREE.InstancedMesh>(null);
  const geometries = useButterflyFishGeometries();
  const reefFrame = useMemo(() => reefFrameAtDepth(SHELF_TOP_DEPTH), []);

  const shoal = useMemo(() => {
    const random = seededRandom(0x5c4001);
    return Array.from({ length: FISH_COUNT }, (_, index) => {
      // Coprime shuffles distribute adjacent instances across the whole water
      // column and across colour variants without creating visible sequences.
      const depthRank = (index * 11 + 7) % FISH_COUNT;
      const depthJitter = (random() - 0.5) * 0.16;
      const variantRank = (index * 13 + 5) % FISH_COUNT;
      const variant: 0 | 1 | 2 =
        variantRank < 20 ? 0 : variantRank < 26 ? 1 : 2;

      return {
        direction: index % 5 === 0 ? (-1 as const) : (1 as const),
        phase: THREE.MathUtils.euclideanModulo(
          index * 0.61803398875 + (random() - 0.5) * 0.06,
          1,
        ),
        speed: 0.0085 + random() * 0.005,
        surgeRate: 0.08 + random() * 0.07,
        surgeAmount: 0.008 + random() * 0.009,
        pathPhase: random() * Math.PI * 2,
        acrossOffset: (random() - 0.5) * 0.4,
        oceanOffset: 0.035 + (random() - 0.5) * 0.05,
        acrossWander: 0.04 + random() * 0.08,
        oceanWander: 0.02 + random() * 0.015,
        driftRate: 0.06 + random() * 0.08,
        driftAmount: 0.04 + random() * 0.08,
        depthOffset:
          THREE.MathUtils.lerp(
            SMALL_FISH_DEPTH_OFFSET_MIN,
            SMALL_FISH_DEPTH_OFFSET_MAX,
            depthRank / (FISH_COUNT - 1),
          ) + depthJitter,
        depthWander: 0.18 + random() * 0.17,
        depthRate: 0.12 + random() * 0.18,
        depthPhase: random() * Math.PI * 2,
        variant,
        rollRate: 0.3 + random() * 0.55,
        rollAmplitude: 0.018 + random() * 0.047,
        scale: 0.1 + random() * 0.08,
        tailBeat: 3.2 + random() * 2,
        tailPhase: random() * Math.PI * 2,
        tailAmplitude: 0.18 + random() * 0.14,
      };
    });
  }, []);

  // A fixed world-space orbit looks narrow on the wide desktop composition.
  // Scale only around the pipe's across-wall coordinate, so the school uses a
  // similar share of every viewport without sliding its occlusion point away
  // from the pipe itself.
  const orbitWidthScale = THREE.MathUtils.clamp(aspect / (16 / 9), 0.45, 1.5);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tailJoint = useMemo(() => new THREE.Object3D(), []);
  const tailMatrix = useMemo(() => new THREE.Matrix4(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const routePoint = useMemo(() => new THREE.Vector3(), []);
  const nextRoutePoint = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const fins = finRef.current;
    const tail = tailRef.current;
    if (!body || !fins || !tail) {
      return;
    }

    shoal.forEach((fish, index) => {
      const palette = SMALL_FISH_PALETTES[fish.variant];
      body.setColorAt(index, palette.body);
      fins.setColorAt(index, palette.fin);
      tail.setColorAt(index, palette.fin);
    });

    [body, fins, tail].forEach((mesh) => {
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    });
  }, [shoal]);

  useFrame((state) => {
    const body = bodyRef.current;
    const fins = finRef.current;
    const tail = tailRef.current;
    const whiteFace = whiteFaceRef.current;
    const blackMarkings = blackMarkingsRef.current;
    const whiteAccents = whiteAccentsRef.current;
    const eyeRims = eyeRimsRef.current;
    const pupils = pupilsRef.current;

    if (
      depth.get() >= 95 ||
      !body ||
      !fins ||
      !tail ||
      !whiteFace ||
      !blackMarkings ||
      !whiteAccents ||
      !eyeRims ||
      !pupils
    ) {
      return;
    }
    const time = state.clock.elapsedTime;

    shoal.forEach((fish, index) => {
      const progress = setSmallFishRoutePoint(
        dummy.position,
        routePoint,
        reefFrame,
        fish,
        time,
        orbitWidthScale,
      );

      // Sample the same warped route a moment ahead so each fish steers into
      // its own speed changes and meanders instead of following a rigid oval.
      const nextTime = time + 0.18;
      setSmallFishRoutePoint(
        ahead,
        nextRoutePoint,
        reefFrame,
        fish,
        nextTime,
        orbitWidthScale,
      );
      dummy.lookAt(ahead);
      dummy.rotateY(NOSE_TOWARDS_NEGATIVE_Z);
      dummy.rotateZ(
        Math.sin(time * fish.rollRate + fish.pathPhase) * fish.rollAmplitude +
          Math.sin(progress * Math.PI * 4 + fish.pathPhase) * 0.015,
      );

      dummy.scale.setScalar(fish.scale);
      dummy.updateMatrix();
      body.setMatrixAt(index, dummy.matrix);
      fins.setMatrixAt(index, dummy.matrix);
      whiteFace.setMatrixAt(index, dummy.matrix);
      blackMarkings.setMatrixAt(index, dummy.matrix);
      whiteAccents.setMatrixAt(index, dummy.matrix);
      eyeRims.setMatrixAt(index, dummy.matrix);
      pupils.setMatrixAt(index, dummy.matrix);

      tailJoint.position.set(0, 0, 0.68);
      tailJoint.rotation.set(
        0,
        Math.sin(
          time * fish.tailBeat +
            fish.tailPhase +
            Math.sin(time * 0.22 + fish.pathPhase) * 0.55,
        ) * fish.tailAmplitude,
        0,
      );
      tailJoint.updateMatrix();
      tailMatrix.multiplyMatrices(dummy.matrix, tailJoint.matrix);
      tail.setMatrixAt(index, tailMatrix);
    });

    body.instanceMatrix.needsUpdate = true;
    fins.instanceMatrix.needsUpdate = true;
    tail.instanceMatrix.needsUpdate = true;
    whiteFace.instanceMatrix.needsUpdate = true;
    blackMarkings.instanceMatrix.needsUpdate = true;
    whiteAccents.instanceMatrix.needsUpdate = true;
    eyeRims.instanceMatrix.needsUpdate = true;
    pupils.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={bodyRef}
        args={[geometries.body, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.74}
          metalness={0}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={finRef}
        args={[geometries.fins, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.76}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={tailRef}
        args={[geometries.tail, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.76}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={whiteFaceRef}
        args={[geometries.whiteFace, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={BUTTERFLY_IVORY}
          roughness={0.72}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={blackMarkingsRef}
        args={[geometries.blackMarkings, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={BUTTERFLY_BLACK}
          roughness={0.7}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={whiteAccentsRef}
        args={[geometries.whiteAccents, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={BUTTERFLY_IVORY}
          roughness={0.72}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={eyeRimsRef}
        args={[geometries.eyeRims, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={BUTTERFLY_AMBER}
          roughness={0.58}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
      <instancedMesh
        ref={pupilsRef}
        args={[geometries.pupils, undefined, FISH_COUNT]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#02060b"
          roughness={0.52}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </instancedMesh>
    </group>
  );
}

const TURTLE_NECK_SECTIONS: readonly ProfileLoftSection[] = [
  { x: 0.62, top: 0.15, bottom: -0.18, halfWidth: 0.25 },
  { x: 0.82, top: 0.26, bottom: -0.18, halfWidth: 0.27 },
  { x: 1, top: 0.32, bottom: -0.16, halfWidth: 0.25 },
  { x: 1.11, top: 0.28, bottom: -0.12, halfWidth: 0.21 },
];

const TURTLE_HEAD_SECTIONS: readonly ProfileLoftSection[] = [
  { x: 0.98, top: 0.28, bottom: -0.14, halfWidth: 0.21 },
  { x: 1.09, top: 0.38, bottom: -0.18, halfWidth: 0.28 },
  { x: 1.23, top: 0.34, bottom: -0.17, halfWidth: 0.27 },
  { x: 1.34, top: 0.25, bottom: -0.12, halfWidth: 0.2 },
  { x: 1.4, top: 0.17, bottom: -0.08, halfWidth: 0.12 },
];

const TURTLE_PLASTRON_SECTIONS: readonly ProfileLoftSection[] = [
  { x: -1.02, top: -0.05, bottom: -0.12, halfWidth: 0.08 },
  { x: -0.76, top: -0.08, bottom: -0.24, halfWidth: 0.36 },
  { x: -0.34, top: -0.12, bottom: -0.3, halfWidth: 0.55 },
  { x: 0.14, top: -0.12, bottom: -0.3, halfWidth: 0.57 },
  { x: 0.55, top: -0.09, bottom: -0.24, halfWidth: 0.4 },
  { x: 0.82, top: -0.05, bottom: -0.11, halfWidth: 0.08 },
];

const TURTLE_FRONT_FLIPPER_SECTIONS: readonly ProfileLoftSection[] = [
  { x: 0, top: 0.09, bottom: -0.09, halfWidth: 0.21 },
  { x: 0.25, top: 0.12, bottom: -0.1, halfWidth: 0.29 },
  { x: 0.62, top: 0.08, bottom: -0.11, halfWidth: 0.25 },
  { x: 0.98, top: 0.015, bottom: -0.09, halfWidth: 0.15 },
  { x: 1.24, top: -0.045, bottom: -0.045, halfWidth: 0 },
];

const TURTLE_REAR_FLIPPER_SECTIONS: readonly ProfileLoftSection[] = [
  { x: 0, top: 0.065, bottom: -0.065, halfWidth: 0.15 },
  { x: 0.2, top: 0.08, bottom: -0.07, halfWidth: 0.2 },
  { x: 0.43, top: 0.025, bottom: -0.075, halfWidth: 0.14 },
  { x: 0.64, top: -0.04, bottom: -0.04, halfWidth: 0 },
];

const TURTLE_SHELL_COLOURS = [
  "#19382f",
  "#23483d",
  "#2f5849",
  "#3c6653",
  "#4b715b",
];
const TURTLE_SKIN_COLOURS = [
  "#293e2b",
  "#384d30",
  "#4b6038",
  "#607342",
  "#79874e",
];
const TURTLE_UNDERSIDE_COLOURS = [
  "#273322",
  "#354029",
  "#414a2e",
  "#4c5433",
];
const TURTLE_SIDES = [1, -1] as const;

/** Deforms an icosahedron into the reference's broad, high carapace. */
function buildTurtleShellGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  geometry.rotateX(-0.08);
  geometry.rotateZ(0.12);
  const position = geometry.getAttribute("position");

  for (let vertex = 0; vertex < position.count; vertex += 1) {
    const x = position.getX(vertex);
    const y = position.getY(vertex);
    const z = position.getZ(vertex);
    const lengthScale = x < 0 ? 1.16 : 0.98;
    const rearPoint =
      x < 0 ? -0.14 * -x * (1 - Math.min(1, Math.abs(y))) : 0;

    position.setXYZ(
      vertex,
      x * lengthScale + rearPoint - 0.04,
      0.02 + y * (y >= 0 ? 0.8 : 0.27),
      z * 0.72,
    );
  }

  geometry.computeVertexNormals();
  return geometry;
}

/** Gives a deliberately coarse mesh a palette per triangle, not a smooth wash. */
function colourFacets(
  source: THREE.BufferGeometry,
  palette: readonly string[],
  seed: number,
) {
  const geometry = source.index ? source.toNonIndexed() : source.clone();
  source.dispose();
  const position = geometry.getAttribute("position");
  const colours = new Float32Array(position.count * 3);
  const random = seededRandom(seed);

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const colour = new THREE.Color(
      palette[Math.floor(random() * palette.length)],
    );
    for (let corner = 0; corner < 3; corner += 1) {
      const offset = (vertex + corner) * 3;
      colours[offset] = colour.r;
      colours[offset + 1] = colour.g;
      colours[offset + 2] = colour.b;
    }
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Keeps turtle facets related to the form instead of assigning camouflage. */
function colourTurtleFacets(
  source: THREE.BufferGeometry,
  palette: readonly string[],
  seed: number,
) {
  const geometry = source.index ? source.toNonIndexed() : source.clone();
  source.dispose();
  const position = geometry.getAttribute("position");
  const colours = new Float32Array(position.count * 3);
  const random = seededRandom(seed);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const normal = new THREE.Vector3();

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    a.fromBufferAttribute(position, vertex);
    b.fromBufferAttribute(position, vertex + 1);
    c.fromBufferAttribute(position, vertex + 2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    normal.crossVectors(ab, ac).normalize();

    const formLight = THREE.MathUtils.clamp(
      0.5 + normal.y * 0.34 + normal.x * 0.12 + (random() - 0.5) * 0.2,
      0,
      1,
    );
    const colour = new THREE.Color(
      palette[Math.round(formLight * (palette.length - 1))],
    );

    for (let corner = 0; corner < 3; corner += 1) {
      const offset = (vertex + corner) * 3;
      colours[offset] = colour.r;
      colours[offset + 1] = colour.g;
      colours[offset + 2] = colour.b;
    }
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function useSeaTurtleGeometries() {
  return useMemo(
    () => ({
      shell: colourTurtleFacets(
        buildTurtleShellGeometry(),
        TURTLE_SHELL_COLOURS,
        0x5e1101,
      ),
      neck: colourTurtleFacets(
        buildProfileLoftBody(TURTLE_NECK_SECTIONS, 7),
        TURTLE_SKIN_COLOURS,
        0x5e1102,
      ),
      head: colourTurtleFacets(
        buildProfileLoftBody(TURTLE_HEAD_SECTIONS, 6),
        TURTLE_SKIN_COLOURS,
        0x5e1103,
      ),
      plastron: colourTurtleFacets(
        buildProfileLoftBody(TURTLE_PLASTRON_SECTIONS, 7, true),
        TURTLE_UNDERSIDE_COLOURS,
        0x5e1104,
      ),
      frontFlipper: colourTurtleFacets(
        buildProfileLoftBody(TURTLE_FRONT_FLIPPER_SECTIONS, 6),
        TURTLE_SKIN_COLOURS,
        0x5e1105,
      ),
      rearFlipper: colourTurtleFacets(
        buildProfileLoftBody(TURTLE_REAR_FLIPPER_SECTIONS, 6),
        TURTLE_SKIN_COLOURS,
        0x5e1106,
      ),
      tail: colourTurtleFacets(
        new THREE.ConeGeometry(0.1, 0.28, 4, 1),
        TURTLE_SKIN_COLOURS,
        0x5e1107,
      ),
      eyeSocket: new THREE.IcosahedronGeometry(1, 0),
      eye: new THREE.IcosahedronGeometry(1, 0),
    }),
    [],
  );
}

/** Green turtle, built as a deliberately coarse faceted model. */
export function SeaTurtle({
  depth,
  preview = false,
}: {
  depth?: { get: () => number };
  preview?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const frontFlippers = useRef<Array<THREE.Group | null>>([]);
  const rearFlippers = useRef<Array<THREE.Group | null>>([]);
  const routeProgress = useRef(0.12);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const routePoint = useMemo(() => new THREE.Vector3(), []);
  const routeAhead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(TURTLE_DEPTH_METRES),
    [],
  );
  const geometries = useSeaTurtleGeometries();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (
      !group ||
      preview ||
      (depth && !isLagoonLifeActive(depth.get()))
    ) {
      return;
    }
    const time = state.clock.elapsedTime;

    // Cruise beside the reef, then surge briefly while leaving it and again
    // on the homeward leg. Smooth envelopes avoid snapping between speeds.
    const progress = routeProgress.current;
    const departureSurge =
      THREE.MathUtils.smoothstep(progress, 0.16, 0.21) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.29, 0.35));
    const returnSurge =
      THREE.MathUtils.smoothstep(progress, 0.72, 0.78) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.91, 0.97));
    const surge = Math.max(departureSurge, returnSurge);
    const routeSpeed = 0.009 + surge * 0.027;
    routeProgress.current =
      (routeProgress.current + Math.min(delta, 0.05) * routeSpeed) % 1;
    const nextProgress = (routeProgress.current + 0.004 + surge * 0.002) % 1;

    TURTLE_ROUTE.getPointAt(routeProgress.current, routePoint);
    TURTLE_ROUTE.getPointAt(nextProgress, routeAhead);
    const bob = Math.sin(time * 0.42) * 0.1;
    const nextBob = Math.sin((time + 0.16) * 0.42) * 0.1;

    setReefOrbitPoint(
      group.position,
      reefFrame,
      routePoint.x,
      routePoint.y,
      TURTLE_DEPTH_Y + routePoint.z + bob,
    );
    setReefOrbitPoint(
      ahead,
      reefFrame,
      routeAhead.x,
      routeAhead.y,
      TURTLE_DEPTH_Y + routeAhead.z + nextBob,
    );
    group.lookAt(ahead);
    group.rotateY(NOSE_TOWARDS_POSITIVE_X);
    group.rotateZ(Math.sin(time * 0.35) * 0.04);

    // Flippers row rather than flap: turtles fly, they do not paddle.
    const stroke = Math.sin(time * 1.15);
    frontFlippers.current.forEach((flipper, index) => {
      if (!flipper) return;
      const side = index === 0 ? 1 : -1;
      flipper.rotation.x = side * (0.2 + stroke * 0.36);
    });
    rearFlippers.current.forEach((flipper, index) => {
      if (!flipper) return;
      const side = index === 0 ? 1 : -1;
      flipper.rotation.x = side * (0.03 - stroke * 0.07);
    });
  });

  return (
    <group ref={groupRef} scale={0.32}>
      <mesh geometry={geometries.shell}>
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0}
          flatShading
        />
      </mesh>
      <mesh geometry={geometries.plastron}>
        <meshStandardMaterial
          vertexColors
          roughness={0.9}
          metalness={0}
          flatShading
        />
      </mesh>

      <mesh geometry={geometries.neck}>
        <meshStandardMaterial
          vertexColors
          roughness={0.86}
          metalness={0}
          flatShading
        />
      </mesh>
      <mesh geometry={geometries.head}>
        <meshStandardMaterial
          vertexColors
          roughness={0.86}
          metalness={0}
          flatShading
        />
      </mesh>

      {TURTLE_SIDES.map((side, index) => (
        <group
          key={`front-${side}`}
          ref={(node) => {
            frontFlippers.current[index] = node;
          }}
          position={[0.32, -0.055, side * 0.58]}
          rotation={[side === 1 ? 1 : -0.2, 0, 0]}
        >
          <group
            rotation={[
              0,
              side === 1 ? -0.7 : 1.9,
              side === 1 ? -0.6 : 0.05,
            ]}
          >
            <mesh geometry={geometries.frontFlipper}>
              <meshStandardMaterial
                vertexColors
                roughness={0.88}
                metalness={0}
                flatShading
              />
            </mesh>
          </group>
        </group>
      ))}

      {TURTLE_SIDES.map((side, index) => (
        <group
          key={`rear-${side}`}
          ref={(node) => {
            rearFlippers.current[index] = node;
          }}
          position={[-0.71, -0.09, side * 0.48]}
          rotation={[side * 0.03, 0, 0]}
        >
          <group rotation={[0, side * -1.72, side * 0.04]}>
            <mesh geometry={geometries.rearFlipper}>
              <meshStandardMaterial
                vertexColors
                roughness={0.88}
                metalness={0}
                flatShading
              />
            </mesh>
          </group>
        </group>
      ))}

      <mesh
        geometry={geometries.tail}
        position={[-1.13, -0.045, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.62}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0}
          flatShading
        />
      </mesh>

      {TURTLE_SIDES.map((side) => (
        <group key={`face-${side}`}>
          <mesh
            geometry={geometries.eyeSocket}
            position={[1.19, 0.23, side * 0.223]}
            scale={[0.067, 0.062, 0.017]}
          >
            <meshStandardMaterial
              color="#24372a"
              roughness={0.78}
              metalness={0}
              flatShading
            />
          </mesh>
          <mesh
            geometry={geometries.eye}
            position={[1.195, 0.232, side * 0.234]}
            scale={[0.045, 0.043, 0.013]}
          >
            <meshStandardMaterial
              color="#061612"
              roughness={0.5}
              metalness={0}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Giant jack (uru'ati): French Polynesia's largest jackfish. */
export function GiantJack({
  depth,
  preview = false,
}: {
  depth?: { get: () => number };
  preview?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fishRefs = useRef<Array<THREE.Group | null>>([]);
  const tailRefs = useRef<Array<THREE.Group | null>>([]);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(GIANT_JACK_DEPTH_METRES),
    [],
  );
  const geometries = useGiantJackGeometries();
  const formation = preview
    ? GIANT_JACK_PREVIEW_FORMATION
    : GIANT_JACK_FORMATION;
  const individualMotion = useMemo(() => {
    const random = seededRandom(0x6a4c4b);
    return GIANT_JACK_FORMATION.map((_, index) => ({
      phase: random() * Math.PI * 2,
      driftSpeed: 0.26 + random() * 0.18,
      bobSpeed: 0.38 + random() * 0.2,
      swaySpeed: 0.22 + random() * 0.2,
      tailSpeed: 1.45 + random() * 0.5,
      drift: index === 0 ? 0.025 : 0.1 + random() * 0.05,
      bob: index === 0 ? 0.035 : 0.08 + random() * 0.05,
      sway: index === 0 ? 0.025 : 0.09 + random() * 0.05,
      roll: index === 0 ? 0.018 : 0.035 + random() * 0.025,
    }));
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    if (!preview && depth && !isLagoonLifeActive(depth.get())) {
      return;
    }
    const time = state.clock.elapsedTime;
    if (!preview) {
      // Stay in open water between the camera and the reef face. The formation
      // needs extra clearance because the two friends trail outside this ellipse.
      const angle = time * 0.075 - 0.7;
      const nextAngle = angle + 0.025;
      const y = GIANT_JACK_DEPTH_Y + Math.sin(angle * 2 + 0.3) * 0.18;
      const nextY =
        GIANT_JACK_DEPTH_Y + Math.sin(nextAngle * 2 + 0.3) * 0.18;

      setReefOrbitPoint(
        group.position,
        reefFrame,
        Math.cos(angle) * 1.35,
        6.8 + Math.sin(angle) * 0.95,
        y,
      );
      setReefOrbitPoint(
        ahead,
        reefFrame,
        Math.cos(nextAngle) * 1.35,
        6.8 + Math.sin(nextAngle) * 0.95,
        nextY,
      );
      group.lookAt(ahead);
      group.rotateY(NOSE_TOWARDS_POSITIVE_X);
      group.rotateZ(Math.sin(time * 0.55) * 0.025);
    }

    formation.forEach((fish, index) => {
      const member = fishRefs.current[index];
      const tail = tailRefs.current[index];
      const motion = individualMotion[index];

      if (member) {
        member.position.set(
          fish.x + Math.sin(time * motion.driftSpeed + motion.phase) * motion.drift,
          fish.y + Math.sin(time * motion.bobSpeed + motion.phase * 1.7) * motion.bob,
          fish.z + Math.cos(time * motion.swaySpeed + motion.phase * 0.7) * motion.sway,
        );
        member.rotation.set(
          Math.sin(time * motion.bobSpeed + motion.phase) * motion.roll,
          Math.sin(time * motion.swaySpeed + motion.phase * 1.3) * motion.roll * 0.75,
          Math.cos(time * motion.driftSpeed + motion.phase * 0.8) * motion.roll * 0.65,
        );
      }
      if (tail) {
        tail.rotation.y =
          Math.sin(time * motion.tailSpeed + fish.tailPhase) * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef} scale={0.42}>
      {formation.map((fish, index) => (
        <group
          key={fish.id}
          ref={(node) => {
            fishRefs.current[index] = node;
          }}
          position={[fish.x, fish.y, fish.z]}
          scale={fish.scale}
        >
          <mesh geometry={geometries.body}>
            <meshStandardMaterial
              color="#82928f"
              roughness={0.62}
              metalness={0.08}
              flatShading
            />
          </mesh>
          <mesh geometry={geometries.staticFins}>
            <meshStandardMaterial
              color="#4d615e"
              roughness={0.7}
              metalness={0.03}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
          <mesh geometry={geometries.eyeRims}>
            <meshStandardMaterial
              color="#c2a24c"
              roughness={0.58}
              metalness={0.02}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
          <mesh geometry={geometries.pupils}>
            <meshStandardMaterial
              color="#101817"
              roughness={0.55}
              metalness={0}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>

          <group
            ref={(node) => {
              tailRefs.current[index] = node;
            }}
            position={[-1.43, 0, 0]}
          >
            <mesh geometry={geometries.tail}>
              <meshStandardMaterial
                color="#4d615e"
                roughness={0.7}
                metalness={0.03}
                side={THREE.DoubleSide}
                flatShading
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

type SharkFinPoint = readonly [x: number, y: number];

const SHARK_BODY_SECTIONS: readonly ProfileLoftSection[] = [
  { x: -1.42, top: 0.07, bottom: -0.07, halfWidth: 0.08 },
  { x: -1.2, top: 0.13, bottom: -0.11, halfWidth: 0.14 },
  { x: -0.84, top: 0.23, bottom: -0.19, halfWidth: 0.22 },
  { x: -0.44, top: 0.31, bottom: -0.25, halfWidth: 0.3 },
  { x: 0.04, top: 0.35, bottom: -0.28, halfWidth: 0.34 },
  { x: 0.5, top: 0.33, bottom: -0.27, halfWidth: 0.36 },
  { x: 0.9, top: 0.26, bottom: -0.23, halfWidth: 0.31 },
  { x: 1.24, top: 0.15, bottom: -0.16, halfWidth: 0.21 },
  { x: 1.52, top: -0.005, bottom: -0.065, halfWidth: 0.025 },
];

const SHARK_BACK_COLOURS = [
  "#81713f",
  "#927f46",
  "#a28d50",
  "#b19b5a",
  "#bba866",
];
const SHARK_FLANK_COLOURS = [
  "#5f5b39",
  "#6c6540",
  "#7b7145",
  "#897b49",
  "#97874f",
];
const SHARK_BELLY_COLOURS = [
  "#958d69",
  "#a49a72",
  "#b2a67b",
  "#beb388",
];
const SHARK_SIDES = [1, -1] as const;

const SHARK_FIRST_DORSAL: readonly SharkFinPoint[] = [
  [0.5, 0.23],
  [0.2, 0.37],
  [-0.18, 0.89],
  [-0.27, 0.42],
  [-0.38, 0.2],
];
const SHARK_SECOND_DORSAL: readonly SharkFinPoint[] = [
  [-0.62, 0.16],
  [-0.75, 0.25],
  [-0.96, 0.49],
  [-1.01, 0.22],
  [-1.08, 0.11],
];
const SHARK_ANAL_FIN: readonly SharkFinPoint[] = [
  [-0.61, -0.14],
  [-0.87, -0.36],
  [-1.08, -0.1],
];
const SHARK_PECTORAL_FIN: readonly SharkFinPoint[] = [
  [0.56, 0.11],
  [0.27, 0.38],
  [-0.55, 0.94],
  [-0.14, 0.19],
];
const SHARK_PELVIC_FIN: readonly SharkFinPoint[] = [
  [-0.5, 0.07],
  [-0.69, 0.2],
  [-1.03, 0.46],
  [-0.81, 0.09],
];
const SHARK_TAIL: readonly SharkFinPoint[] = [
  [0, 0.08],
  [-0.78, 0.82],
  [-0.62, 0.22],
  [-0.33, 0.02],
  [-0.68, -0.43],
  [0, -0.07],
];

/** Closes a fin into a low-poly wedge, thick at its buried root and thin outside. */
function buildTaperedFin(
  points: readonly SharkFinPoint[],
  rootHalfThickness: number,
  tipHalfThickness: number,
) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: rootHalfThickness * 2,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -rootHalfThickness);

  // Every outline starts and ends on the body, so that closing edge is the
  // root. Perpendicular distance from it gives one taper rule that works for
  // dorsal, paired, anal, and both caudal lobes without changing silhouettes.
  const [rootStartX, rootStartY] = points[0];
  const [rootEndX, rootEndY] = points[points.length - 1];
  const rootDx = rootEndX - rootStartX;
  const rootDy = rootEndY - rootStartY;
  const rootLength = Math.hypot(rootDx, rootDy) || 1;
  const distanceFromRoot = (x: number, y: number) =>
    Math.abs(rootDx * (y - rootStartY) - rootDy * (x - rootStartX)) /
    rootLength;
  const maximumDistance = Math.max(
    ...points.map(([x, y]) => distanceFromRoot(x, y)),
    0.001,
  );
  const position = geometry.getAttribute("position");

  for (let vertex = 0; vertex < position.count; vertex += 1) {
    const distance = distanceFromRoot(
      position.getX(vertex),
      position.getY(vertex),
    );
    const progress = THREE.MathUtils.clamp(
      distance / maximumDistance,
      0,
      1,
    );
    const rootWeight = Math.pow(
      1 - THREE.MathUtils.smoothstep(progress, 0, 1),
      1.25,
    );
    const halfThickness = THREE.MathUtils.lerp(
      tipHalfThickness,
      rootHalfThickness,
      rootWeight,
    );
    const side = position.getZ(vertex) < 0 ? -1 : 1;
    position.setZ(vertex, side * halfThickness);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/** One connected body, with related palettes selected per broad triangle. */
function colourSharkBodyFacets(source: THREE.BufferGeometry) {
  const geometry = source.index ? source.toNonIndexed() : source.clone();
  source.dispose();
  const position = geometry.getAttribute("position");
  const colours = new Float32Array(position.count * 3);
  const random = seededRandom(0x5a4b11);

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const centreY =
      (position.getY(vertex) +
        position.getY(vertex + 1) +
        position.getY(vertex + 2)) /
      3;
    const palette =
      centreY > 0.09
        ? SHARK_BACK_COLOURS
        : centreY < -0.09
          ? SHARK_BELLY_COLOURS
          : SHARK_FLANK_COLOURS;
    const colour = new THREE.Color(
      palette[Math.floor(random() * palette.length)],
    );

    for (let corner = 0; corner < 3; corner += 1) {
      const offset = (vertex + corner) * 3;
      colours[offset] = colour.r;
      colours[offset + 1] = colour.g;
      colours[offset + 2] = colour.b;
    }
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function useLemonSharkGeometries() {
  return useMemo(
    () => ({
      body: colourSharkBodyFacets(
        buildProfileLoftBody(SHARK_BODY_SECTIONS, 8, true),
      ),
      firstDorsal: colourFacets(
        buildTaperedFin(SHARK_FIRST_DORSAL, 0.055, 0.005),
        SHARK_BACK_COLOURS,
        0x5a4b12,
      ),
      secondDorsal: colourFacets(
        buildTaperedFin(SHARK_SECOND_DORSAL, 0.04, 0.004),
        SHARK_BACK_COLOURS,
        0x5a4b13,
      ),
      anal: colourFacets(
        buildTaperedFin(SHARK_ANAL_FIN, 0.032, 0.003),
        SHARK_BELLY_COLOURS,
        0x5a4b14,
      ),
      pectoral: colourFacets(
        buildTaperedFin(SHARK_PECTORAL_FIN, 0.056, 0.005),
        SHARK_BACK_COLOURS,
        0x5a4b15,
      ),
      pelvic: colourFacets(
        buildTaperedFin(SHARK_PELVIC_FIN, 0.03, 0.004),
        SHARK_FLANK_COLOURS,
        0x5a4b16,
      ),
      tail: colourFacets(
        buildTaperedFin(SHARK_TAIL, 0.065, 0.006),
        SHARK_BACK_COLOURS,
        0x5a4b17,
      ),
      faceDetails: buildWrappedSideMarkings(
        [
          [
            [1.43, -0.075],
            [0.72, -0.14],
            [0.38, -0.13],
            [0.74, -0.102],
          ],
        ],
        SHARK_BODY_SECTIONS,
        0.006,
        0,
      ),
      eye: new THREE.IcosahedronGeometry(1, 0),
    }),
    [],
  );
}

/** Angular lemon-olive shark rebuilt around the supplied low-poly silhouette. */
export function LemonShark({
  depth,
  preview = false,
}: {
  depth?: { get: () => number };
  preview?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(SHARK_DEPTH_METRES),
    [],
  );
  const geometries = useLemonSharkGeometries();

  useFrame((state) => {
    const group = groupRef.current;
    if (
      !group ||
      preview ||
      (depth && !isLagoonLifeActive(depth.get()))
    ) {
      return;
    }
    const time = state.clock.elapsedTime;
    const angle = 2.2 - time * 0.075;
    const nextAngle = angle - 0.05;
    // An open-water ellipse keeps the full animal seaward of the reef face.
    // Its 120-metre lane keeps the shark below the turtle and jack routes.
    const y = SHARK_DEPTH_Y + Math.sin(time * 0.2) * 0.28;

    setReefOrbitPoint(
      group.position,
      reefFrame,
      0.25 + Math.cos(angle) * 1.9,
      6.7 + Math.sin(angle) * 1.45,
      y,
    );
    setReefOrbitPoint(
      ahead,
      reefFrame,
      0.25 + Math.cos(nextAngle) * 1.9,
      6.7 + Math.sin(nextAngle) * 1.45,
      y,
    );
    group.lookAt(ahead);
    group.rotateY(NOSE_TOWARDS_POSITIVE_X);
    group.rotateZ(Math.sin(time * 0.31) * 0.025);

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(time * 1.7) * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={0.52}>
      <mesh geometry={geometries.body}>
        <meshStandardMaterial
          vertexColors
          roughness={0.82}
          metalness={0.01}
          flatShading
        />
      </mesh>

      {[geometries.firstDorsal, geometries.secondDorsal, geometries.anal].map(
        (geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <meshStandardMaterial
              vertexColors
              roughness={0.82}
              metalness={0.01}
              flatShading
            />
          </mesh>
        ),
      )}

      {SHARK_SIDES.map((side) => (
        <group key={`paired-fins-${side}`}>
          <mesh
            geometry={geometries.pectoral}
            position={[0, -0.06, 0]}
            rotation={[side * (Math.PI / 2 + 0.16), 0, 0]}
          >
            <meshStandardMaterial
              vertexColors
              roughness={0.82}
              metalness={0.01}
              flatShading
            />
          </mesh>
          <mesh
            geometry={geometries.pelvic}
            position={[0, -0.08, 0]}
            rotation={[side * (Math.PI / 2 + 0.1), 0, 0]}
          >
            <meshStandardMaterial
              vertexColors
              roughness={0.82}
              metalness={0.01}
              flatShading
            />
          </mesh>
        </group>
      ))}

      <mesh geometry={geometries.faceDetails}>
        <meshStandardMaterial
          color="#5b5639"
          roughness={0.86}
          metalness={0}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {SHARK_SIDES.map((side) => (
        <group key={`shark-eye-${side}`}>
          <mesh
            geometry={geometries.eye}
            position={[1.08, 0.075, side * 0.263]}
            scale={[0.05, 0.052, 0.022]}
          >
            <meshStandardMaterial
              color="#080a08"
              roughness={0.42}
              metalness={0.02}
              flatShading
            />
          </mesh>
          <mesh
            geometry={geometries.eye}
            position={[1.1, 0.095, side * 0.282]}
            scale={[0.012, 0.012, 0.008]}
          >
            <meshStandardMaterial
              color="#d8d3ae"
              roughness={0.48}
              metalness={0}
              flatShading
            />
          </mesh>
        </group>
      ))}

      <group ref={tailRef} position={[-1.32, 0, 0]}>
        <mesh geometry={geometries.tail}>
          <meshStandardMaterial
            vertexColors
            roughness={0.82}
            metalness={0.01}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

/** None of this belongs at four hundred metres, so it leaves with the light. */
export function LagoonLife({ depth }: { depth: { get: () => number } }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (group) {
      group.visible = isLagoonLifeActive(depth.get());
    }
  });

  return (
    <group ref={groupRef}>
      <FishSchool depth={depth} />
      <SeaTurtle depth={depth} />
      <GiantJack depth={depth} />
      <LemonShark depth={depth} />
    </group>
  );
}
