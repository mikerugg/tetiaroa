"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import {
  MAX_DIVE_DEPTH,
  INTAKE_DEPTH,
  lightAtDepth,
} from "./swac-content";
import {
  SHELF_TOP_DEPTH,
  UNITS_PER_METRE,
  slopeAcross,
  slopePoint,
} from "./dive-coordinates";
import { LagoonLife } from "./dive-marine-life";
import { GiantSquid, SQUID_DEPTH } from "./dive-deep-life";
import { SpermWhale, WHALE_DEPTH } from "./dive-sperm-whale";
import {
  JELLY_DEPTH,
  JELLY_MAX_DEPTH,
  JELLY_MIN_DEPTH,
  JellyfishSchool,
} from "./dive-jellyfish";
import { PipeIntake } from "./dive-intake";
import {
  SUBMERSIBLE_DEPTH,
  Submersible,
} from "./dive-submersible";
import { createStarfishGeometry } from "./dive-reef-geometry";
import {
  causticsFragmentShader,
  causticsVertexShader,
  snowFragmentShader,
  snowVertexShader,
} from "./dive-shaders";

const COLUMN_UNITS = MAX_DIVE_DEPTH * UNITS_PER_METRE;
const SNOW_COUNT = 900;
const SNOW_COLUMN_HEIGHT = 90;
const JELLY_LIGHT_FADE_DISTANCE = 55;
const JELLY_LIGHT_MINIMUM = 0.025;
const SUBMERSIBLE_LIGHT_FADE_START = 125;
const SUBMERSIBLE_LIGHT_FADE_END = 158;
const SURFACE_EFFECT_MAX_DEPTH = 60;
const INTAKE_LIGHT_REVEAL_DISTANCE = 240;

function jellyLayerLightLevel(depth: number) {
  const distanceFromLayer =
    depth < JELLY_MIN_DEPTH
      ? JELLY_MIN_DEPTH - depth
      : depth > JELLY_MAX_DEPTH
        ? depth - JELLY_MAX_DEPTH
        : 0;
  const proximity =
    1 -
    THREE.MathUtils.smoothstep(
      distanceFromLayer,
      0,
      JELLY_LIGHT_FADE_DISTANCE,
    );
  return THREE.MathUtils.lerp(1, JELLY_LIGHT_MINIMUM, proximity);
}

/**
 * The diver yields their lamp to the sub's inspection lights, then keeps it
 * down until the jellyfish have passed. This envelope hands control back while
 * the existing jelly envelope is already at its minimum, avoiding a flash of
 * white light between the two encounters.
 */
function submersibleApproachLightLevel(depth: number) {
  const approach = THREE.MathUtils.smoothstep(
    depth,
    SUBMERSIBLE_LIGHT_FADE_START,
    SUBMERSIBLE_LIGHT_FADE_END,
  );
  const jellyHandoff =
    1 - THREE.MathUtils.smoothstep(depth, JELLY_MIN_DEPTH, JELLY_MAX_DEPTH);
  return THREE.MathUtils.lerp(
    1,
    JELLY_LIGHT_MINIMUM,
    approach * jellyHandoff,
  );
}

/**
 * Deterministic PRNG (mulberry32). The snow field must be identical on every
 * render — Math.random() in a useMemo is both a React purity violation and a
 * guarantee that the field reshuffles whenever the component happens to
 * re-render.
 */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const CausticsMaterial = shaderMaterial(
  { uTime: 0, uIntensity: 1, uColor: new THREE.Color("#7ff5e6") },
  causticsVertexShader,
  causticsFragmentShader,
);

const SnowMaterial = shaderMaterial(
  {
    uTime: 0,
    uStretch: 0,
    uColumnHeight: SNOW_COLUMN_HEIGHT,
    uCameraY: 0,
    uColor: new THREE.Color("#cfe9e4"),
    uOpacity: 0.5,
  },
  snowVertexShader,
  snowFragmentShader,
);

extend({ CausticsMaterial, SnowMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    causticsMaterial: ThreeElements["shaderMaterial"] & {
      uTime?: number;
      uIntensity?: number;
      uColor?: THREE.Color;
    };
    snowMaterial: ThreeElements["shaderMaterial"] & {
      uTime?: number;
      uStretch?: number;
      uColumnHeight?: number;
      uCameraY?: number;
      uColor?: THREE.Color;
      uOpacity?: number;
    };
  }
}

/**
 * Water colour through the column. Sampled rather than computed so the ramp
 * matches what the SVG fallback paints.
 */
const DEPTH_COLOUR_STOPS: ReadonlyArray<readonly [number, string]> = [
  [0, "#1fb6a6"],
  [40, "#12849a"],
  [200, "#0a3f66"],
  [400, "#04203f"],
  [MAX_DIVE_DEPTH, "#01070e"],
];

const scratchA = new THREE.Color();
const scratchB = new THREE.Color();

function sampleDepthColour(depth: number, target: THREE.Color) {
  const stops = DEPTH_COLOUR_STOPS;

  if (depth <= stops[0][0]) {
    return target.set(stops[0][1]);
  }

  for (let i = 1; i < stops.length; i += 1) {
    const [depthA, colourA] = stops[i - 1];
    const [depthB, colourB] = stops[i];
    if (depth <= depthB) {
      const t = (depth - depthA) / (depthB - depthA);
      scratchA.set(colourA);
      scratchB.set(colourB);
      return target.copy(scratchA).lerp(scratchB, t);
    }
  }

  return target.set(stops[stops.length - 1][1]);
}

type SceneProps = {
  /** Live depth in metres, driven by the page scroll. */
  depth: MotionValue<number>;
  velocity: MotionValue<number>;
};

function MarineSnow({ velocity }: Pick<SceneProps, "velocity">) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const stretch = useRef(0);

  const { offsets, scales, speeds } = useMemo(() => {
    const random = createRandom(0x5eed);
    const offsets = new Float32Array(SNOW_COUNT * 3);
    const scales = new Float32Array(SNOW_COUNT);
    const speeds = new Float32Array(SNOW_COUNT);

    for (let i = 0; i < SNOW_COUNT; i += 1) {
      // Bias the field into a shell around the camera path rather than a cube,
      // so density stays even as you descend.
      const angle = random() * Math.PI * 2;
      const radius = 1.2 + Math.pow(random(), 0.65) * 22;
      offsets[i * 3] = Math.cos(angle) * radius;
      offsets[i * 3 + 1] = (random() - 0.5) * SNOW_COLUMN_HEIGHT;
      offsets[i * 3 + 2] = Math.sin(angle) * radius;
      scales[i] = 0.012 + random() * 0.05;
      speeds[i] = 0.4 + random() * 1.6;
    }

    return { offsets, scales, speeds };
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    // Velocity is in progress-units per second; scale it to something the
    // vertex shader can stretch with, and ease it so it does not judder.
    const raw = Math.min(Math.abs(velocity.get()), 3);
    stretch.current += (raw - stretch.current) * 0.12;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uStretch.value = stretch.current;
    material.uniforms.uCameraY.value = state.camera.position.y;
  });

  return (
    <instancedMesh args={[undefined, undefined, SNOW_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 3]}
        />
        <instancedBufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <instancedBufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </planeGeometry>
      <snowMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function SeaSurface({ depth }: Pick<SceneProps, "depth">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) {
      return;
    }
    const metres = depth.get();
    mesh.visible = metres < SURFACE_EFFECT_MAX_DEPTH;
    if (!mesh.visible) {
      return;
    }
    material.uniforms.uTime.value = state.clock.elapsedTime;
    // Caustics are gone long before the thermocline.
    material.uniforms.uIntensity.value = Math.max(0, 1 - metres / 55);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[140, 140, 1, 1]} />
      <causticsMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
 * The flank. Tetiaroa is a drowned volcano, so the seabed drops away from the
 * reef and recedes as it goes. Everything below hangs off this one curve: the
 * rock face, the pipe strapped to it, the anchors, and the camera.
 * ------------------------------------------------------------------------- */

/** The pipe sits just off the rock, between the camera and the face. */
function pipePoint(metres: number, target: THREE.Vector3) {
  slopePoint(metres, target);
  target.x -= 1.55;
  target.z += 1.35;
  return target;
}

/**
 * The whole pipe as ONE curve: a horizontal run in from the plant, a
 * quarter-turn elbow at the reef edge, then the descent. Built as a single
 * path because two meshes butted together is exactly how you get a visible
 * break at the joint.
 *
 * The elbow radius is chosen so its bottom lands precisely on the descent
 * curve at ELBOW_DEPTH, which makes the join continuous by construction
 * rather than by eye.
 */
const ELBOW_DEPTH = 32;
/** Height of the horizontal run. Dropped below the surface so the pipe leaves
 *  frame under the depth readout rather than behind it. */
const RUN_HEIGHT = -0.9;
const ELBOW_H = 3.2;
/** Vertical radius chosen so the elbow bottoms out exactly on pipePoint(ELBOW_DEPTH). */
const ELBOW_V = ELBOW_DEPTH * UNITS_PER_METRE + RUN_HEIGHT;
const SHORE_RUN_LENGTH = 14;

function useSlopeCurve() {
  return useMemo(() => {
    const entry = pipePoint(0, new THREE.Vector3());
    const points: THREE.Vector3[] = [];

    // Horizontal run, heading out from under the shore.
    const elbowStartX = entry.x + ELBOW_H;
    const elbowStartZ = entry.z - 1.1;
    for (let i = 0; i <= 8; i += 1) {
      const u = i / 8;
      points.push(
        new THREE.Vector3(
          elbowStartX + SHORE_RUN_LENGTH * (1 - u),
          RUN_HEIGHT,
          elbowStartZ - 7 * (1 - u),
        ),
      );
    }

    // Quarter turn, horizontal into vertical. Elliptical, because the drop and
    // the reach are no longer equal.
    for (let i = 1; i <= 10; i += 1) {
      const a = (i / 10) * (Math.PI / 2);
      points.push(
        new THREE.Vector3(
          entry.x + ELBOW_H * (1 - Math.sin(a)),
          RUN_HEIGHT - ELBOW_V * (1 - Math.cos(a)),
          entry.z - 1.1 * (1 - Math.sin(a)),
        ),
      );
    }

    // The descent proper, picking up exactly where the elbow lets go.
    for (let i = 1; i <= 44; i += 1) {
      const depth =
        ELBOW_DEPTH + (i / 44) * (INTAKE_DEPTH - ELBOW_DEPTH);
      points.push(pipePoint(depth, new THREE.Vector3()));
    }

    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);
  }, []);
}

/*
 * The crest where the flank meets the lagoon. Both surfaces sample it through
 * these, at identical lateral positions, so the seam is one welded line rather
 * than two independently tessellated edges that happen to share a depth.
 */
const CREST_COLS = 26;
const CREST_SPREAD = 2.1;

function crestLateral(index: number) {
  return (index - (CREST_COLS - 1) / 2) * CREST_SPREAD;
}

/** A little irregularity along the crest, so it is not a ruled line. */
function crestRipple(lateral: number) {
  return (
    Math.sin(lateral * 0.42) * 0.36 + Math.sin(lateral * 1.07 + 1.4) * 0.17
  );
}

/**
 * The camera's frame at a given depth: where it sits, where it looks, and the
 * horizontal axis across the frame. Derived from the same offsets DiveRig
 * applies, so anything placed through it stays framed if the slope is retuned.
 */
function cameraFrame(depth: number) {
  const slope = slopePoint(depth, new THREE.Vector3());
  const pipe = pipePoint(depth, new THREE.Vector3());
  const camera = new THREE.Vector3(
    slope.x - 8.6,
    slope.y + 0.9,
    slope.z + 8.4,
  );
  const target = new THREE.Vector3(pipe.x + 1.6, pipe.y - 4.2, pipe.z - 2);
  const direction = target.clone().sub(camera).normalize();
  // Horizontal, so travelling along it holds depth constant.
  const right = new THREE.Vector3()
    .crossVectors(direction, new THREE.Vector3(0, 1, 0))
    .normalize();
  return { camera, direction, right };
}

/**
 * A point at `depth` that lands inside the camera's view cone when the camera
 * is `lead` metres shallower.
 *
 * The camera always looks downward, so anything at a fixed depth is only
 * visible while you are above it. Placing deep animals by eye put them behind
 * the viewer.
 */
function viewAnchor(depth: number, lead: number) {
  const { camera, direction } = cameraFrame(Math.max(0, depth - lead));
  const dy = -depth * UNITS_PER_METRE - camera.y;
  return camera.clone().addScaledVector(direction, dy / direction.y);
}

/**
 * A point at `depth` sitting a fraction of the way from the rock face towards
 * the camera. Travelling along slopeAcross() from here holds both the depth
 * and the distance from the wall constant, which is what stops a large animal
 * swimming into the flank.
 */
function wallLane(depth: number, towardCamera: number) {
  const slope = slopePoint(depth, new THREE.Vector3());
  const { camera } = cameraFrame(depth);
  const inboard = new THREE.Vector3(camera.x - slope.x, 0, camera.z - slope.z);
  return slope.clone().addScaledVector(inboard, towardCamera);
}

/** The across-frame axis, which is the same at every depth. */
function viewAxis() {
  return cameraFrame(0).right;
}

/** Where the shore run terminates. The motu is placed from this, so the pipe
 *  and the building it feeds can never drift apart. */
function shoreRunEnd() {
  const entry = pipePoint(0, new THREE.Vector3());
  return new THREE.Vector3(
    entry.x + ELBOW_H + SHORE_RUN_LENGTH,
    RUN_HEIGHT,
    entry.z - 1.1 - 7,
  );
}

/**
 * The sand lagoon on top of the reef shelf. Its seaward boundary is generated
 * from slopePoint/slopeAcross at SHELF_TOP_DEPTH, so it ends exactly on the
 * reef crest rather than sailing out over the drop.
 */
function SandLagoon() {
  const geometry = useMemo(() => {
    const cols = 34;
    // Matches the flank's crest tessellation exactly; anything else leaves
    // slivers of background showing through the join.
    const rows = CREST_COLS;
    // Far enough to meet the motu, which sits at the end of the shore run.
    const reach = 16;
    const random = createRandom(0x5a4d);

    const edge = slopePoint(SHELF_TOP_DEPTH, new THREE.Vector3());
    const across = slopeAcross(SHELF_TOP_DEPTH, new THREE.Vector3());
    // Perpendicular to the crest, pointing AWAY from the camera. The viewer
    // is on the ocean side of the rim, so the rock crest sits between them and
    // the lagoon, and the sand runs on back towards the motu.
    const inland = new THREE.Vector3(across.z, 0, -across.x);

    const positions = new Float32Array(cols * rows * 3);
    const colours = new Float32Array(cols * rows * 3);
    const rock = new THREE.Color("#5f7167");
    const sand = new THREE.Color("#a9a483");
    const blended = new THREE.Color();

    for (let c = 0; c < cols; c += 1) {
      // u = 0 at the crest, 1 at the far side of the lagoon.
      const u = c / (cols - 1);
      // Full weight on the crest, gone a fifth of the way across.
      const crestWeight = Math.max(0, 1 - u * 5);

      for (let r = 0; r < rows; r += 1) {
        const v = r / (rows - 1);
        const lateral = crestLateral(r);

        // The sand's own texture fades out at the crest, so the shared ripple
        // is the only thing shaping the seam.
        const sandWaves =
          (Math.sin(u * 18 + v * 9) * 0.12 +
            Math.sin(u * 6 - v * 14) * 0.08 +
            (random() - 0.5) * 0.05) *
          (1 - crestWeight);
        // Shallows up towards the beach it runs into.
        const shelving = Math.pow(u, 1.3) * 1.6;

        const index = (c * rows + r) * 3;
        positions[index] =
          edge.x + across.x * lateral + inland.x * (u * reach);
        positions[index + 1] =
          edge.y + crestRipple(lateral) * crestWeight + sandWaves + shelving;
        positions[index + 2] =
          edge.z + across.z * lateral + inland.z * (u * reach);

        // Carry the rock's colour a little way into the sand so the join is a
        // transition rather than a hard cut.
        blended.copy(rock).lerp(sand, Math.min(1, u * 4.5));
        colours[index] = blended.r;
        colours[index + 1] = blended.g;
        colours[index + 2] = blended.b;
      }
    }

    const indices: number[] = [];
    for (let c = 0; c < cols - 1; c += 1) {
      for (let r = 0; r < rows - 1; r += 1) {
        const a = c * rows + r;
        const b = a + 1;
        const d = a + rows;
        const e = d + 1;
        indices.push(a, b, d, b, e, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colours, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        roughness={0.97}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * A palm frond: a tapering blade that lifts off the crown and then droops.
 * Built as a two-vertex-wide strip along an arc — the droop and the taper are
 * what make a palm read as a palm rather than as a spiky ball.
 */
function createFrondGeometry() {
  const segments = 10;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = t * 1.2;
    const y = Math.sin(t * Math.PI * 0.5) * 0.32 - Math.pow(t, 2.2) * 0.78;
    const halfWidth =
      0.12 * Math.sin(Math.PI * Math.min(1, t * 1.3)) * (1 - t * 0.55);
    positions.push(x, y, -halfWidth, x, y, halfWidth);
  }

  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
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

/** One palm: a leaning tapered trunk, nine drooping fronds, and coconuts. */
function Palm({
  position,
  lean,
  height,
}: {
  position: [number, number, number];
  lean: [number, number];
  height: number;
}) {
  const frond = useMemo(() => createFrondGeometry(), []);
  const crown: [number, number, number] = [0.16, height, 0.05];

  return (
    <group position={position} rotation={[lean[0], 0, lean[1]]}>
      {/* Trunk, in two tapering sections so it bends the way palms do */}
      <mesh position={[0.02, height * 0.28, 0.01]} rotation={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.08, 0.13, height * 0.58, 7]} />
        <meshStandardMaterial color="#957c57" roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0.1, height * 0.78, 0.035]} rotation={[0, 0, -0.14]}>
        <cylinderGeometry args={[0.055, 0.08, height * 0.46, 7]} />
        <meshStandardMaterial color="#9c8360" roughness={0.92} flatShading />
      </mesh>

      {/* Coconuts under the crown */}
      {[0, 1, 2].map((index) => {
        const a = (index / 3) * Math.PI * 2;
        return (
          <mesh
            key={a}
            position={[
              crown[0] + Math.cos(a) * 0.11,
              crown[1] - 0.08,
              crown[2] + Math.sin(a) * 0.11,
            ]}
          >
            <sphereGeometry args={[0.062, 8, 6]} />
            <meshStandardMaterial color="#6d5636" roughness={0.9} flatShading />
          </mesh>
        );
      })}

      {Array.from({ length: 9 }, (_, index) => {
        const a = (index / 9) * Math.PI * 2 + 0.3;
        // Alternate the lift so the crown is not a flat wheel.
        const droop = index % 2 === 0 ? 0.16 : -0.06;
        return (
          <group key={a} position={crown} rotation={[0, -a, droop]}>
            <mesh geometry={frond} scale={[1, 1, 1]}>
              <meshStandardMaterial
                color={index % 3 === 0 ? "#5d9150" : "#4f8347"}
                roughness={0.88}
                side={THREE.DoubleSide}
                flatShading
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** A motu across the lagoon: beach, a little scrub, and a handful of palms. */
function IslandBeach() {
  const end = useMemo(() => shoreRunEnd(), []);
  const palms = useMemo(() => {
    const random = createRandom(0x9a17);
    return Array.from({ length: 7 }, (_, index) => ({
      // Pushed out to the rim so the plant building keeps the middle.
      position: [
        Math.cos((index / 7) * Math.PI * 2) * (2.6 + random() * 1.4),
        0.32,
        Math.sin((index / 7) * Math.PI * 2) * (1.8 + random()),
      ] as [number, number, number],
      lean: [(random() - 0.5) * 0.22, (random() - 0.5) * 0.26] as [number, number],
      height: 1.9 + random() * 1.1,
    }));
  }, []);

  return (
    <group position={[end.x, 0, end.z]}>
      {/* Beach */}
      {/* Reef pedestal. A cone, not a sphere: a sphere reads as a boulder
          sitting in the water rather than as ground the motu is built on. */}
      <mesh position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]} scale={[6.2, 1, 4.5]}>
        <coneGeometry args={[1, 6.6, 22]} />
        <meshStandardMaterial color="#848b6b" roughness={0.97} flatShading />
      </mesh>
      {/* Dry sand cap */}
      <mesh position={[0, 0.16, 0]} scale={[4.9, 0.5, 3.5]}>
        <sphereGeometry args={[1, 22, 14]} />
        <meshStandardMaterial color="#e6dab4" roughness={0.95} />
      </mesh>
      {/* Scrub behind the sand */}
      <mesh position={[-0.4, 0.12, -0.7]} scale={[3.2, 0.55, 1.9]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color="#5c7a4d" roughness={0.95} flatShading />
      </mesh>
      {/* Riser out of the seabed run, into the plant */}
      <mesh position={[0, (RUN_HEIGHT + 0.62) / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.62 - RUN_HEIGHT, 14]} />
        <meshStandardMaterial color="#2c4a53" roughness={0.62} metalness={0.22} />
      </mesh>

      {/* The plant: where the seawater gives up its chill and turns around */}
      <group position={[0, 0.62, 0]}>
        {/* Keep the original block-and-roof silhouette, with sturdier proportions. */}
        <mesh position={[0, 0.41, 0]}>
          <boxGeometry args={[2.05, 0.78, 1.35]} />
          <meshStandardMaterial color="#d0d5cc" roughness={0.88} flatShading />
        </mesh>
        <mesh
          position={[0, 1.01, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[1, 1, 0.7]}
        >
          <coneGeometry args={[1.45, 0.45, 4]} />
          <meshStandardMaterial color="#78624c" roughness={0.9} flatShading />
        </mesh>

        {/* Two large facade marks survive the distant surface camera. */}
        <mesh position={[-1.03, 0.37, 0.14]}>
          <boxGeometry args={[0.035, 0.58, 0.36]} />
          <meshStandardMaterial color="#35565a" roughness={0.82} />
        </mesh>
        <mesh position={[0.38, 0.5, 0.685]}>
          <boxGeometry args={[0.64, 0.24, 0.035]} />
          <meshStandardMaterial color="#496663" roughness={0.84} />
        </mesh>
      </group>

      {palms.map((palm) => (
        <Palm key={`${palm.position[0]}-${palm.position[2]}`} {...palm} />
      ))}
    </group>
  );
}

/** Starfish are the reef wall's only remaining attached life. */
const WALL_ROWS = 74;
const WALL_BASE_DEPTH = MAX_DIVE_DEPTH + 60;
/** Rare enough that finding one feels incidental, not decorative. */
const STARFISH_COUNT = 10;
const EXTRA_SHALLOW_STARFISH_COUNT = 4;
const EXTRA_SHALLOW_STARFISH_MAX_DEPTH = 180;
const STARFISH_EDGE_MARGIN = 0.45;
/** Compresses more of the ordered depth bands into the upper reef. */
const STARFISH_SHALLOW_BIAS = 1.9;

/** The deterministic part of the flank's relief, evaluable at any point. */
function wallRelief(depth: number, lateral: number) {
  const r =
    ((depth - SHELF_TOP_DEPTH) / (WALL_BASE_DEPTH - SHELF_TOP_DEPTH)) *
    (WALL_ROWS - 1);
  const c = lateral / CREST_SPREAD + (CREST_COLS - 1) / 2;
  const u = r * 0.16;
  const v = c * 0.42;
  return {
    relief:
      Math.sin(u * 1.6 + v * 0.9) * 0.85 +
      Math.sin(u * 4.1 - v * 2.3) * 0.42 +
      Math.sin(u * 9.4 + v * 5.7) * 0.16,
    row: r,
  };
}

/** A point on the rock face, plus the outward direction to grow away from it. */
function wallPoint(depth: number, lateral: number) {
  const centre = slopePoint(depth, new THREE.Vector3());
  const across = slopeAcross(depth, new THREE.Vector3());
  const seaward = new THREE.Vector3(-across.z, 0, across.x);
  const { relief, row } = wallRelief(depth, lateral);
  const shaped = relief * Math.min(1, row / 5);
  const crestWeight = Math.max(0, 1 - row / 6);

  const position = new THREE.Vector3(
    centre.x + across.x * lateral + shaped * 0.55 + seaward.x * 0.18,
    centre.y + shaped * 0.7 + crestRipple(lateral) * crestWeight,
    centre.z + across.z * lateral - shaped * 0.35 + seaward.z * 0.18,
  );

  return { position, seaward };
}

type Placed = { matrix: THREE.Matrix4; colour: THREE.Color };

function useReefWallStars() {
  return useMemo(() => {
    const random = createRandom(0x2ee1);
    const shallowRandom = createRandom(0x51a113);
    const halfSpan = (CREST_SPREAD * (CREST_COLS - 1)) / 2;
    const stars: Placed[] = [];
    const colours = ["#d4694a", "#c9543f", "#4f6f9c", "#d9a05b", "#a8455c"];
    const depthSpan = WALL_BASE_DEPTH - SHELF_TOP_DEPTH;

    const placeStar = (depth: number, sample: () => number) => {
      const lateral =
        (sample() - 0.5) * 2 * (halfSpan - STARFISH_EDGE_MARGIN);
      const { position, seaward } = wallPoint(depth, lateral);
      const size = 0.16 + sample() * 0.16;
      const lie = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        seaward,
      );
      lie.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          sample() * Math.PI * 2,
        ),
      );
      stars.push({
        matrix: new THREE.Matrix4().compose(
          position,
          lie,
          new THREE.Vector3(size, size, size),
        ),
        colour: new THREE.Color(
          colours[Math.floor(sample() * colours.length)],
        ),
      });
    };

    for (let index = 0; index < STARFISH_COUNT; index += 1) {
      // Keep one jittered sample in each ordered band, then curve the bands
      // towards the shallows. Deep stars remain possible all the way down the
      // wall, while the upper reef gets several more sightings.
      const depthProgress = Math.pow(
        (index + random()) / STARFISH_COUNT,
        STARFISH_SHALLOW_BIAS,
      );
      const depth =
        SHELF_TOP_DEPTH + depthProgress * depthSpan;
      placeStar(depth, random);
    }

    // Add a few more discoveries only to the upper wall. A separate seed
    // leaves the existing full-depth scatter unchanged.
    const shallowDepthSpan =
      EXTRA_SHALLOW_STARFISH_MAX_DEPTH - SHELF_TOP_DEPTH;
    for (let index = 0; index < EXTRA_SHALLOW_STARFISH_COUNT; index += 1) {
      const depth =
        SHELF_TOP_DEPTH +
        ((index + shallowRandom()) / EXTRA_SHALLOW_STARFISH_COUNT) *
          shallowDepthSpan;
      placeStar(depth, shallowRandom);
    }

    return stars;
  }, []);
}

function InstancedSet({
  items,
  children,
}: {
  items: Placed[];
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    items.forEach((item, index) => {
      mesh.setMatrixAt(index, item.matrix);
      mesh.setColorAt(index, item.colour);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [items]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}

function ReefWallLife() {
  const stars = useReefWallStars();
  const starGeometry = useMemo(() => createStarfishGeometry(), []);

  return (
    <InstancedSet items={stars}>
      <primitive object={starGeometry} attach="geometry" />
      <meshStandardMaterial
        roughness={0.82}
        side={THREE.DoubleSide}
        flatShading
      />
    </InstancedSet>
  );
}

/** The rock face itself, as a displaced ribbon following the fall line. */
function SlopeTerrain() {
  const geometry = useMemo(() => {
    const rows = 74;
    const cols = CREST_COLS;
    // The flank only starts where the reef wall does. Above this the lagoon
    // stays open water, which is what the first scroll stop is describing.
    const startDepth = SHELF_TOP_DEPTH;
    const random = createRandom(0xf1a4);
    const positions = new Float32Array(rows * cols * 3);

    const centre = new THREE.Vector3();
    const across = new THREE.Vector3();

    for (let r = 0; r < rows; r += 1) {
      const depth =
        startDepth + (r / (rows - 1)) * (WALL_BASE_DEPTH - startDepth);
      slopePoint(depth, centre);
      slopeAcross(depth, across);

      for (let c = 0; c < cols; c += 1) {
        const offset = crestLateral(c);
        const u = r * 0.16;
        const v = c * 0.42;

        // Layered ridges plus a little grit, so it reads as basalt rather
        // than as a bent plane.
        const relief =
          Math.sin(u * 1.6 + v * 0.9) * 0.85 +
          Math.sin(u * 4.1 - v * 2.3) * 0.42 +
          Math.sin(u * 9.4 + v * 5.7) * 0.16 +
          (random() - 0.5) * 0.5;

        // Fade the displacement out over the first few rows so the crest is a
        // clean line the lagoon can butt up against. Left ragged, the two
        // surfaces miss each other by up to ten metres.
        const edgeFade = Math.min(1, r / 5);
        const shaped = relief * edgeFade;
        // The top rows hand their shaping over to the shared crest ripple,
        // which the lagoon uses too, so the two stay welded but irregular.
        const crestWeight = Math.max(0, 1 - r / 6);

        const index = (r * cols + c) * 3;
        positions[index] = centre.x + across.x * offset + shaped * 0.55;
        positions[index + 1] =
          centre.y + shaped * 0.7 + crestRipple(offset) * crestWeight;
        positions[index + 2] = centre.z + across.z * offset - shaped * 0.35;
      }
    }

    const indices: number[] = [];
    for (let r = 0; r < rows - 1; r += 1) {
      for (let c = 0; c < cols - 1; c += 1) {
        const a = r * cols + c;
        const b = a + 1;
        const d = a + cols;
        const e = d + 1;
        indices.push(a, d, b, b, d, e);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#38534d"
        roughness={0.94}
        metalness={0.04}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** The pipe, its anchor collars, and the concrete ballast holding it down. */
function IntakePipe({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 180, 0.3, 14, false),
    [curve],
  );

  useEffect(() => () => tubeGeometry.dispose(), [tubeGeometry]);

  // Anchored every hundred metres, which is roughly how these are actually laid.
  const anchors = useMemo(() => {
    const marks: Array<{ position: THREE.Vector3; quaternion: THREE.Quaternion }> = [];
    const up = new THREE.Vector3(0, 1, 0);
    const ahead = new THREE.Vector3();
    const behind = new THREE.Vector3();

    for (let metres = 80; metres < INTAKE_DEPTH - 40; metres += 100) {
      const position = pipePoint(metres, new THREE.Vector3());
      pipePoint(metres + 8, ahead);
      pipePoint(metres - 8, behind);
      const tangent = ahead.clone().sub(behind).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);
      marks.push({ position, quaternion });
    }

    return marks;
  }, []);

  // Cones on the shore run, pointing the way the water actually goes.
  const arrows = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return [0.045, 0.085, 0.125].map((t) => {
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).multiplyScalar(-1);
      return {
        position,
        quaternion: new THREE.Quaternion().setFromUnitVectors(up, tangent),
      };
    });
  }, [curve]);

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#2c4a53" roughness={0.62} metalness={0.22} />
      </mesh>

      {arrows.map((arrow, index) => (
        <mesh key={index} position={arrow.position} quaternion={arrow.quaternion}>
          <coneGeometry args={[0.3, 0.7, 10]} />
          <meshStandardMaterial
            color="#59e8dc"
            emissive="#59e8dc"
            emissiveIntensity={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}

      {anchors.map((anchor, index) => (
        <group
          key={index}
          position={anchor.position}
          quaternion={anchor.quaternion}
        >
          {/* Banding */}
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 0.34, 16]} />
            <meshStandardMaterial
              color="#6f8790"
              roughness={0.45}
              metalness={0.55}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * The intake itself: a screened bellmouth held clear of the seabed on a frame,
 * so it draws clean water and not sediment. The pumps are ashore.
 */
function IntakeStructure({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const position = useMemo(() => curve.getPointAt(1), [curve]);

  return (
    <group position={position}>
      <PipeIntake />
    </group>
  );
}

function DiveRig({ depth, velocity }: SceneProps) {
  const fogRef = useRef<THREE.FogExp2>(null);
  const backgroundColour = useRef(new THREE.Color("#1fb6a6"));
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const curve = useSlopeCurve();
  const submersibleAxis = useMemo(
    () => slopeAcross(SUBMERSIBLE_DEPTH, new THREE.Vector3()),
    [],
  );
  const submersibleFrame = useMemo(
    () => cameraFrame(SUBMERSIBLE_DEPTH),
    [],
  );
  const submersibleBack = useMemo(
    () =>
      new THREE.Vector3(
        submersibleFrame.direction.x,
        0,
        submersibleFrame.direction.z,
      ).normalize(),
    [submersibleFrame],
  );
  const submersibleAnchor = useMemo(
    () =>
      viewAnchor(SUBMERSIBLE_DEPTH, 0)
        // Set the sub deeper into the shot, then carry it screen-right. From
        // here its pipe-facing bow is nearly perpendicular to the camera,
        // giving the inspection a clear side profile.
        .addScaledVector(submersibleBack, 4)
        .addScaledVector(submersibleFrame.right, 2),
    [submersibleBack, submersibleFrame],
  );
  const submersibleInspectionTarget = useMemo(
    // This lower section sits on the camera's sightline during the encounter,
    // so the pool of light remains visible while the sub turns toward it.
    () => pipePoint(SUBMERSIBLE_DEPTH + 32, new THREE.Vector3()),
    [],
  );

  const diveLightRef = useRef<THREE.PointLight>(null);
  const intakeLightRef = useRef<THREE.PointLight>(null);
  const scratchSlope = useRef(new THREE.Vector3());
  const scratchPipe = useRef(new THREE.Vector3());

  useFrame((state) => {
    const metres = depth.get();

    // The camera hangs off the same curve as the pipe, a few metres inboard,
    // so the flank stays in frame the whole way down.
    slopePoint(metres, scratchSlope.current);
    pipePoint(metres, scratchPipe.current);

    state.camera.position.set(
      scratchSlope.current.x - 8.6,
      // Only a little above the pipe: the HUD is claiming this depth, so the
      // camera had better be at it.
      scratchSlope.current.y + 0.9,
      scratchSlope.current.z + 8.4 + Math.sin(state.clock.elapsedTime * 0.16) * 0.25,
    );
    // Aim down the wall rather than across it, so the drop is the subject.
    state.camera.lookAt(
      scratchPipe.current.x + 1.6,
      scratchPipe.current.y - 4.2,
      scratchPipe.current.z - 2,
    );

    // A dive light riding with the camera, so the rock face nearby actually
    // reads. Without it the flank is a silhouette at every depth.
    if (diveLightRef.current) {
      diveLightRef.current.position.copy(state.camera.position);
      // Near the surface the sun does the work and a full-power lamp just
      // blows out the lagoon floor. It takes over as the daylight dies, then
      // yields first to the sub's inspection lamps and then to the jellyfish.
      const fullIntensity = 18 + (1 - lightAtDepth(metres)) * 105;
      diveLightRef.current.intensity =
        fullIntensity *
        Math.min(
          submersibleApproachLightLevel(metres),
          jellyLayerLightLevel(metres),
        );
    }

    sampleDepthColour(metres, backgroundColour.current);
    state.scene.background = backgroundColour.current;

    if (fogRef.current) {
      fogRef.current.color.copy(backgroundColour.current);
      // Thicker with depth: visibility collapses below the thermocline.
      fogRef.current.density = 0.016 + (metres / MAX_DIVE_DEPTH) * 0.055;
    }

    if (keyLightRef.current) {
      // Surface light dies on the real attenuation curve.
      keyLightRef.current.intensity = 0.15 + lightAtDepth(metres) * 3.2;
    }

    if (intakeLightRef.current) {
      intakeLightRef.current.visible =
        metres > INTAKE_DEPTH - INTAKE_LIGHT_REVEAL_DISTANCE;
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={["#0a3f66", 0.02]} />
      <ambientLight intensity={0.55} />
      <pointLight
        ref={diveLightRef}
        intensity={18}
        distance={34}
        decay={1.7}
        color="#bfeff0"
      />
      <directionalLight
        ref={keyLightRef}
        position={[-6, 30, 8]}
        intensity={2.6}
        color="#cdfff6"
      />
      {/* A working light at the intake, the only thing lit down there. */}
      <pointLight
        ref={intakeLightRef}
        position={pipePoint(INTAKE_DEPTH, new THREE.Vector3())}
        intensity={26}
        distance={22}
        decay={1.6}
        color="#59e8dc"
      />

      <SeaSurface depth={depth} />
      <SandLagoon />
      <ReefWallLife />
      <IslandBeach />
      <SlopeTerrain />
      <LagoonLife depth={depth} />
      <Submersible
        depth={depth}
        anchor={submersibleAnchor}
        axis={submersibleAxis}
        inspectionTarget={submersibleInspectionTarget}
      />
      <JellyfishSchool
        depth={depth}
        anchor={viewAnchor(JELLY_DEPTH, 25)}
        axis={slopeAcross(JELLY_DEPTH, new THREE.Vector3())}
      />
      {/* Short leads: fog below 600 m eats anything further out. */}
      <SpermWhale
        depth={depth}
        anchor={wallLane(WHALE_DEPTH, 0.6)}
        axis={slopeAcross(WHALE_DEPTH, new THREE.Vector3())}
      />
      <GiantSquid
        depth={depth}
        anchor={viewAnchor(SQUID_DEPTH, 35)}
        axis={viewAxis()}
      />

      <IntakePipe curve={curve} />
      <IntakeStructure curve={curve} />
      <MarineSnow velocity={velocity} />
    </>
  );
}

export default function DiveScene3D({
  depth,
  velocity,
  active,
}: SceneProps & { active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 160 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <DiveRig depth={depth} velocity={velocity} />
    </Canvas>
  );
}

export { COLUMN_UNITS };
