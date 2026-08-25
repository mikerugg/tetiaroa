"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  SHELF_TOP_DEPTH,
  UNITS_PER_METRE,
  reefFrameAtDepth,
} from "./dive-coordinates";
import type { ReefFrame } from "./dive-coordinates";

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

type Ring = { z: number; r: number; yScale?: number };

const LEMON_SHARK_BODY_RINGS: readonly Ring[] = [
  { z: -1.25, r: 0.035, yScale: 0.85 },
  { z: -1.05, r: 0.12, yScale: 0.85 },
  { z: -0.7, r: 0.2, yScale: 0.95 },
  { z: -0.3, r: 0.25, yScale: 1 },
  { z: 0.1, r: 0.24, yScale: 1 },
  { z: 0.5, r: 0.18, yScale: 1 },
  { z: 0.9, r: 0.11, yScale: 1.05 },
  { z: 1.2, r: 0.06, yScale: 1.15 },
];

/** Lofts a closed body through a series of elliptical cross-sections. */
function buildBody(rings: readonly Ring[], segments = 12) {
  const positions: number[] = [];
  const indices: number[] = [];

  rings.forEach((ring) => {
    for (let s = 0; s < segments; s += 1) {
      const a = (s / segments) * Math.PI * 2;
      positions.push(
        Math.cos(a) * ring.r,
        Math.sin(a) * ring.r * (ring.yScale ?? 1),
        ring.z,
      );
    }
  });

  for (let i = 0; i < rings.length - 1; i += 1) {
    for (let s = 0; s < segments; s += 1) {
      const a = i * segments + s;
      const b = i * segments + ((s + 1) % segments);
      const c = (i + 1) * segments + s;
      const d = (i + 1) * segments + ((s + 1) % segments);
      // Outward winding. (a, c, b) normals the faces inward, so front-face
      // culling makes the body see-through and lights it from the inside.
      indices.push(a, b, c, b, d, c);
    }
  }

  // Caps, so the nose and tail root are closed.
  const noseIndex = positions.length / 3;
  positions.push(0, 0, rings[0].z);
  for (let s = 0; s < segments; s += 1) {
    indices.push(noseIndex, (s + 1) % segments, s);
  }

  const tailIndex = positions.length / 3;
  const last = (rings.length - 1) * segments;
  positions.push(0, 0, rings[rings.length - 1].z);
  for (let s = 0; s < segments; s += 1) {
    indices.push(tailIndex, last + s, last + ((s + 1) % segments));
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

/** A conforming lower-half skin that follows a lofted body end to end. */
function buildLowerBodySurface(
  rings: readonly Ring[],
  segments = 7,
  lift = 0.004,
) {
  const positions: number[] = [];
  const indices: number[] = [];
  const rowSize = segments + 1;

  rings.forEach((ring) => {
    const radius = ring.r + lift;
    for (let segment = 0; segment <= segments; segment += 1) {
      const angle = Math.PI + (segment / segments) * Math.PI;
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * (ring.yScale ?? 1),
        ring.z,
      );
    }
  });

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = ring * rowSize + segment;
      const b = a + 1;
      const c = (ring + 1) * rowSize + segment;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
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

/** A flat fin, given its outline. Rendered double-sided, so no thickness. */
function buildFin(points: Array<[number, number, number]>) {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  for (let i = 1; i < points.length - 1; i += 1) {
    positions.push(...points[0], ...points[i], ...points[i + 1]);
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

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
      indices.push(a, b, c, b, d, c);
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

const TURTLE_DEPTH_METRES = 40;
const GIANT_JACK_DEPTH_METRES = 80;
const SHARK_DEPTH_METRES = 120;
const TURTLE_DEPTH_Y = -TURTLE_DEPTH_METRES * UNITS_PER_METRE;
const GIANT_JACK_DEPTH_Y = -GIANT_JACK_DEPTH_METRES * UNITS_PER_METRE;
const SHARK_DEPTH_Y = -SHARK_DEPTH_METRES * UNITS_PER_METRE;

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

type DepthSignal = { get: () => number };

/** Masked butterflyfish working a loose circuit over the shallow reef. */
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
    return Array.from({ length: FISH_COUNT }, () => {
      return {
        acrossRadius: 4.2 + random(),
        oceanRadius: 3.4 + random() * 0.5,
        height: -1.1 - random() * 2.4,
        lagoonHeight: -0.72 - random() * 0.22,
        phase: random() * Math.PI * 2,
        speed: 0.065 + random() * 0.04,
        surgeRate: 0.055 + random() * 0.04,
        surgeAmount: 0.18 + random() * 0.16,
        pathPhase: random() * Math.PI * 2,
        acrossWander: 0.12 + random() * 0.22,
        oceanWander: 0.08 + random() * 0.1,
        driftRate: 0.06 + random() * 0.08,
        driftAmount: 0.08 + random() * 0.18,
        bobRate: 0.3 + random() * 0.5,
        bobAmplitude: 0.035 + random() * 0.055,
        rollRate: 0.3 + random() * 0.55,
        rollAmplitude: 0.018 + random() * 0.047,
        scale: 0.1 + random() * 0.08,
        acrossCentre: (random() - 0.5) * 1.5,
        oceanCentre: 1.85 + (random() - 0.5) * 0.3,
        tailBeat: 3.2 + random() * 2,
        tailPhase: random() * Math.PI * 2,
        tailAmplitude: 0.18 + random() * 0.14,
      };
    });
  }, []);

  // A fixed world-space orbit looks narrow on the wide desktop composition.
  // Scale only the tangent axis so the school uses a similar share of every
  // viewport without giving up any of its camera-side reef clearance.
  const orbitWidthScale = THREE.MathUtils.clamp(aspect / (16 / 9), 0.45, 1.5);
  const ultrawideBlend = THREE.MathUtils.clamp(
    (orbitWidthScale - 1) / 0.5,
    0,
    1,
  );
  const orbitAcrossBias = THREE.MathUtils.lerp(0.5, -1, ultrawideBlend);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tailJoint = useMemo(() => new THREE.Object3D(), []);
  const tailMatrix = useMemo(() => new THREE.Matrix4(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

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
      const angle =
        fish.phase +
        time * fish.speed +
        Math.sin(time * fish.surgeRate + fish.pathPhase) * fish.surgeAmount;
      const across =
        orbitAcrossBias +
        fish.acrossCentre +
        (Math.cos(angle) * fish.acrossRadius +
          Math.sin(angle * 2 + fish.pathPhase) * fish.acrossWander +
          Math.sin(time * fish.driftRate + fish.pathPhase) *
            fish.driftAmount) *
          orbitWidthScale;
      const ocean =
        fish.oceanCentre +
        Math.sin(angle) * fish.oceanRadius +
        Math.sin(angle * 3 + fish.pathPhase) * fish.oceanWander;
      const lagoonLift =
        1 - THREE.MathUtils.smoothstep(ocean, 1.5, 4.5);
      const bobble =
        Math.sin(time * fish.bobRate + fish.phase * 1.7) *
          fish.bobAmplitude *
          THREE.MathUtils.lerp(1, 0.58, lagoonLift) +
        Math.sin(angle * 2 - fish.pathPhase) * 0.018;
      const y =
        THREE.MathUtils.lerp(fish.height, fish.lagoonHeight, lagoonLift) +
        bobble;

      setReefOrbitPoint(dummy.position, reefFrame, across, ocean, y);

      // Sample the same warped route a moment ahead so each fish steers into
      // its own speed changes and meanders instead of following a rigid oval.
      const nextTime = time + 0.18;
      const nextAngle =
        fish.phase +
        nextTime * fish.speed +
        Math.sin(nextTime * fish.surgeRate + fish.pathPhase) *
          fish.surgeAmount;
      const nextAcross =
        orbitAcrossBias +
        fish.acrossCentre +
        (Math.cos(nextAngle) * fish.acrossRadius +
          Math.sin(nextAngle * 2 + fish.pathPhase) * fish.acrossWander +
          Math.sin(nextTime * fish.driftRate + fish.pathPhase) *
            fish.driftAmount) *
          orbitWidthScale;
      const nextOcean =
        fish.oceanCentre +
        Math.sin(nextAngle) * fish.oceanRadius +
        Math.sin(nextAngle * 3 + fish.pathPhase) * fish.oceanWander;
      const nextLagoonLift =
        1 - THREE.MathUtils.smoothstep(nextOcean, 1.5, 4.5);
      const nextBobble =
        Math.sin(nextTime * fish.bobRate + fish.phase * 1.7) *
          fish.bobAmplitude *
          THREE.MathUtils.lerp(1, 0.58, nextLagoonLift) +
        Math.sin(nextAngle * 2 - fish.pathPhase) * 0.018;
      const nextY =
        THREE.MathUtils.lerp(
          fish.height,
          fish.lagoonHeight,
          nextLagoonLift,
        ) + nextBobble;
      setReefOrbitPoint(
        ahead,
        reefFrame,
        nextAcross,
        nextOcean,
        nextY,
      );
      dummy.lookAt(ahead);
      dummy.rotateY(NOSE_TOWARDS_NEGATIVE_Z);
      dummy.rotateZ(
        Math.sin(time * fish.rollRate + fish.pathPhase) * fish.rollAmplitude +
          Math.sin(angle * 2 + fish.pathPhase) * 0.015,
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
          color={BUTTERFLY_YELLOW}
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
          color={BUTTERFLY_FIN}
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
          color={BUTTERFLY_FIN}
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

/** Green turtle. Reverted to the stretched-sphere build. */
function SeaTurtle() {
  const groupRef = useRef<THREE.Group>(null);
  const frontFlippers = useRef<THREE.Group>(null);
  const rearFlippers = useRef<THREE.Group>(null);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(TURTLE_DEPTH_METRES),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const time = state.clock.elapsedTime;
    const angle = time * 0.1;
    const nextAngle = angle + 0.05;
    const y = TURTLE_DEPTH_Y + Math.sin(time * 0.32) * 0.4;

    setReefOrbitPoint(
      group.position,
      reefFrame,
      0.5 + Math.cos(angle) * 2.2,
      6.5 + Math.sin(angle) * 1.7,
      y,
    );
    setReefOrbitPoint(
      ahead,
      reefFrame,
      0.5 + Math.cos(nextAngle) * 2.2,
      6.5 + Math.sin(nextAngle) * 1.7,
      y,
    );
    group.lookAt(ahead);
    group.rotateY(NOSE_TOWARDS_POSITIVE_X);

    // Flippers row rather than flap: turtles fly, they do not paddle.
    const stroke = Math.sin(time * 1.25) * 0.5;
    if (frontFlippers.current) {
      frontFlippers.current.rotation.z = stroke;
    }
    if (rearFlippers.current) {
      rearFlippers.current.rotation.z = stroke * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={0.34}>
      {/* Carapace */}
      <mesh scale={[1.05, 0.34, 0.86]}>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color="#5c6b46" roughness={0.85} flatShading />
      </mesh>
      {/* Plastron */}
      <mesh position={[0, -0.12, 0]} scale={[0.92, 0.16, 0.76]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#c3b78c" roughness={0.9} flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[1.02, 0.02, 0]} scale={[0.34, 0.24, 0.24]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#67764f" roughness={0.85} flatShading />
      </mesh>

      <group ref={frontFlippers}>
        {[1, -1].map((side) => (
          <mesh
            key={side}
            position={[0.42, 0, side * 0.78]}
            rotation={[0, side * -0.5, 0]}
            scale={[0.72, 0.07, 0.28]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#5c6b46" roughness={0.85} flatShading />
          </mesh>
        ))}
      </group>

      <group ref={rearFlippers}>
        {[1, -1].map((side) => (
          <mesh
            key={side}
            position={[-0.72, 0, side * 0.56]}
            rotation={[0, side * 0.6, 0]}
            scale={[0.4, 0.06, 0.2]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#5c6b46" roughness={0.85} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Giant jack (uru'ati): French Polynesia's largest jackfish. */
function BigFish() {
  const groupRef = useRef<THREE.Group>(null);
  const fishRefs = useRef<Array<THREE.Group | null>>([]);
  const tailRefs = useRef<Array<THREE.Group | null>>([]);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(GIANT_JACK_DEPTH_METRES),
    [],
  );
  const geometries = useGiantJackGeometries();
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
    const time = state.clock.elapsedTime;
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

    GIANT_JACK_FORMATION.forEach((fish, index) => {
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
      {GIANT_JACK_FORMATION.map((fish, index) => (
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

/**
 * Lemon shark. The tells are the blunt snout, the yellow-brown back over a
 * pale belly, and the two dorsal fins of almost equal size — which is what
 * separates one from "a big fish".
 */
function LemonShark() {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const reefFrame = useMemo(
    () => reefFrameAtDepth(SHARK_DEPTH_METRES),
    [],
  );

  const bodyGeometry = useMemo(
    () => buildBody(LEMON_SHARK_BODY_RINGS, 14),
    [],
  );
  const bellyGeometry = useMemo(
    () => buildLowerBodySurface(LEMON_SHARK_BODY_RINGS),
    [],
  );

  const dorsalOne = useMemo(
    () =>
      buildFin([
        [0, 0.16, -0.34],
        [0, 0.54, 0.0],
        [0, 0.14, 0.16],
      ]),
    [],
  );
  // Nearly the same size as the first, which is the lemon shark's signature.
  const dorsalTwo = useMemo(
    () =>
      buildFin([
        [0, 0.14, 0.52],
        [0, 0.46, 0.78],
        [0, 0.12, 0.9],
      ]),
    [],
  );
  const pectoral = useMemo(
    () =>
      buildFin([
        [0.14, -0.1, -0.42],
        [0.62, -0.24, -0.1],
        [0.2, -0.12, 0.02],
      ]),
    [],
  );
  // One continuous heterocercal fin: the upper lobe remains the long one,
  // while the centre panel joins both lobes across the peduncle.
  const caudal = useMemo(
    () =>
      buildFinSet([
        [
          [0, 0.04, 1.14],
          [0, 0.52, 1.78],
          [0, 0.06, 1.5],
        ],
        [
          [0, 0.04, 1.14],
          [0, 0.06, 1.5],
          [0, -0.02, 1.44],
          [0, -0.04, 1.14],
        ],
        [
          [0, -0.04, 1.14],
          [0, -0.26, 1.46],
          [0, -0.02, 1.44],
        ],
      ]),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
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
    group.rotateY(NOSE_TOWARDS_NEGATIVE_Z);

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(time * 1.7) * 0.38;
    }
  });

  const skin = "#b9a469";
  const belly = "#e6dcbb";

  return (
    <group ref={groupRef} scale={0.62}>
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial color={skin} roughness={0.78} flatShading />
      </mesh>
      {/* Pale underside follows the same rings from snout to peduncle. */}
      <mesh geometry={bellyGeometry}>
        <meshStandardMaterial
          color={belly}
          roughness={0.8}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {[dorsalOne, dorsalTwo].map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial
            color={skin}
            roughness={0.78}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>
      ))}

      {[1, -1].map((side) => (
        <mesh
          key={side}
          geometry={pectoral}
          scale={[side, 1, 1]}
        >
          <meshStandardMaterial
            color={skin}
            roughness={0.78}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>
      ))}

      <group ref={tailRef} position={[0, 0, 1.2]}>
        <mesh geometry={caudal} position={[0, 0, -1.2]}>
          <meshStandardMaterial
            color={skin}
            roughness={0.78}
            side={THREE.DoubleSide}
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
      group.visible = depth.get() < 175;
    }
  });

  return (
    <group ref={groupRef}>
      <FishSchool depth={depth} />
      <SeaTurtle />
      <BigFish />
      <LemonShark />
    </group>
  );
}
