"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { whaleSwimFrameAtTime } from "./dive-whale-motion";

/*
 * The deep. A sperm whale in the foraging band and a giant squid below it,
 * which is not decoration: sperm whales dive to these depths specifically to
 * hunt Architeuthis, and this is the one place on the page where the two
 * would actually meet.
 *
 * Bodies are authored nose towards +Z. Object3D.lookAt aims a mesh's +Z at
 * its target, so that convention means no correcting turn afterwards.
 */

export const WHALE_DEPTH = 550;
export const SQUID_DEPTH = 725;

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export type Ring = {
  z: number;
  r: number;
  yScale?: number;
  /** 0 is a circle, 1 is close to a rectangle. A sperm whale's head is the
   *  latter, and lofting it round is what made it read as a sausage. */
  square?: number;
  /** Lifts a ring off the centreline, so the head can ride high over the body. */
  yOffset?: number;
};
type Buffers = { positions: number[]; indices: number[] };

export function loft(rings: Ring[], segments = 12) {
  const positions: number[] = [];
  const indices: number[] = [];

  rings.forEach((ring) => {
    // Superellipse: exponent 1 is a circle, lower values square it off.
    const exponent = 1 - (ring.square ?? 0) * 0.72;
    for (let s = 0; s < segments; s += 1) {
      const a = (s / segments) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      positions.push(
        Math.sign(ca) * Math.pow(Math.abs(ca), exponent) * ring.r,
        Math.sign(sa) *
          Math.pow(Math.abs(sa), exponent) *
          ring.r *
          (ring.yScale ?? 1) +
          (ring.yOffset ?? 0),
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
      // Winding matters: (a, c, b) puts the face normal on the INSIDE, which
      // front-face culls the near surface and lets you see straight through
      // the animal — and lights it inside-out into the bargain.
      indices.push(a, b, c, b, d, c);
    }
  }

  const front = positions.length / 3;
  positions.push(0, rings[rings.length - 1].yOffset ?? 0, rings[rings.length - 1].z);
  const last = (rings.length - 1) * segments;
  for (let s = 0; s < segments; s += 1) {
    indices.push(front, last + s, last + ((s + 1) % segments));
  }

  const back = positions.length / 3;
  positions.push(0, rings[0].yOffset ?? 0, rings[0].z);
  for (let s = 0; s < segments; s += 1) {
    indices.push(back, (s + 1) % segments, s);
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

/**
 * A flat outline given real thickness: a top face, a bottom face, and a rim
 * joining them. Flukes and flippers on an animal this size read as paper
 * without it.
 */
function slab(points: Array<[number, number, number]>, thickness: number) {
  const half = thickness / 2;
  const positions: number[] = [];
  const indices: number[] = [];
  const count = points.length;

  for (const [x, y, z] of points) {
    positions.push(x, y + half, z);
  }
  for (const [x, y, z] of points) {
    positions.push(x, y - half, z);
  }

  for (let i = 1; i < count - 1; i += 1) {
    // Top fan faces +Y; the bottom is the same fan reversed.
    indices.push(0, i, i + 1);
    indices.push(count, count + i + 1, count + i);
  }

  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    indices.push(i, count + i, j, j, count + i, count + j);
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

/** A tapering limb that curls, for arms and tentacles. */
function limb(length: number, thickness: number, curl: number, seed: number) {
  const buffers: Buffers = { positions: [], indices: [] };
  const steps = 8;
  const sides = 5;

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const r = thickness * (1 - t * 0.82);
    const x = Math.sin(t * Math.PI * 0.8) * curl;
    const y = -Math.pow(t, 1.6) * curl * 0.7;
    const z = -t * length;
    for (let s = 0; s < sides; s += 1) {
      const a = (s / sides) * Math.PI * 2 + seed;
      buffers.positions.push(x + Math.cos(a) * r, y + Math.sin(a) * r, z);
    }
  }

  for (let i = 0; i < steps; i += 1) {
    for (let s = 0; s < sides; s += 1) {
      const a = i * sides + s;
      const b = i * sides + ((s + 1) % sides);
      const c = (i + 1) * sides + s;
      const d = (i + 1) * sides + ((s + 1) % sides);
      buffers.indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(buffers.positions), 3),
  );
  geometry.setIndex(buffers.indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Fades a group in only while the camera is near its depth. */
function useDepthBand(
  depth: { get: () => number },
  centre: number,
  band: number,
) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const group = ref.current;
    if (group) {
      group.visible = Math.abs(depth.get() - centre) < band;
    }
  });
  return ref;
}

/**
 * Sperm whale. The silhouette is all in the head: a squared-off block that is
 * a third of the animal, with the narrow lower jaw slung underneath and a row
 * of knuckles instead of a dorsal fin.
 */
export function SpermWhale({
  depth,
  anchor,
  axis,
  /** Holds it still at the origin, for inspecting the shape in the model lab. */
  preview = false,
}: {
  depth: { get: () => number };
  anchor?: THREE.Vector3;
  axis?: THREE.Vector3;
  preview?: boolean;
}) {
  const groupRef = useDepthBand(depth, WHALE_DEPTH, preview ? Infinity : 210);
  const swimRef = useRef<THREE.Group>(null);
  const flukeRef = useRef<THREE.Group>(null);
  const flipperRefs = useRef<Array<THREE.Group | null>>([]);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const swimAxis = useMemo(
    () => axis?.clone().normalize() ?? new THREE.Vector3(),
    [axis],
  );
  const outward = useMemo(
    () => new THREE.Vector3().crossVectors(swimAxis, WORLD_UP).normalize(),
    [swimAxis],
  );

  const body = useMemo(
    () =>
      loft(
        [
          { z: -1.5, r: 0.02, yScale: 1.9, square: 0.4 },
          { z: -1.36, r: 0.045, yScale: 1.7, square: 0.4 },
          { z: -1.18, r: 0.08, yScale: 1.45, square: 0.38 },
          { z: -0.98, r: 0.12, yScale: 1.25, square: 0.35 },
          { z: -0.74, r: 0.163, yScale: 1.12, square: 0.32 },
          { z: -0.46, r: 0.203, yScale: 1.05, square: 0.32 },
          { z: -0.16, r: 0.232, yScale: 1.02, square: 0.35 },
          { z: 0.12, r: 0.248, yScale: 1.04, square: 0.42, yOffset: 0.008 },
          { z: 0.34, r: 0.255, yScale: 1.1, square: 0.55, yOffset: 0.016 },
          // The head block: a third of the animal, deep, square in section,
          // riding high enough over the body to leave a visible step behind
          // it, and ending in a flat wall rather than tapering to a point.
          { z: 0.5, r: 0.258, yScale: 1.2, square: 0.78, yOffset: 0.028 },
          { z: 0.75, r: 0.262, yScale: 1.26, square: 0.88, yOffset: 0.034 },
          { z: 1.02, r: 0.262, yScale: 1.28, square: 0.9, yOffset: 0.036 },
          { z: 1.26, r: 0.256, yScale: 1.27, square: 0.9, yOffset: 0.036 },
          { z: 1.42, r: 0.23, yScale: 1.24, square: 0.88, yOffset: 0.036 },
          { z: 1.47, r: 0.18, yScale: 1.18, square: 0.85, yOffset: 0.036 },
        ],
        18,
      ),
    [],
  );

  const fluke = useMemo(
    () =>
      // Authored around its own root, not the body's centre, so the group
      // below can pivot at the tail. Pivoting at the origin swung the flukes
      // clean off the back of the animal.
      slab(
        [
          [0, 0, 0],
          [0.44, 0.015, -0.06],
          [1.02, 0.04, -0.38],
          [0.5, 0.015, -0.36],
          [0, 0, -0.18],
          [-0.5, 0.015, -0.36],
          [-1.02, 0.04, -0.38],
          [-0.44, 0.015, -0.06],
        ],
        0.045,
      ),
    [],
  );

  const flipper = useMemo(
    () =>
      // A small narrow paddle. In the reference it is about 8% of body
      // length; the previous outline was closer to 16% and read as a wing.
      slab(
        [
          [0, 0, 0],
          [0.24, -0.085, -0.07],
          [0.27, -0.115, -0.19],
          [0.16, -0.07, -0.22],
          [0.03, -0.01, -0.13],
        ],
        0.03,
      ),
    [],
  );

  useFrame((state) => {
    const swim = swimRef.current;
    if (!swim) {
      return;
    }
    const time = state.clock.elapsedTime;
    if (!preview && anchor && axis) {
      // The old triangle wave flipped the whale's heading at each endpoint.
      // Each endpoint now has a compact loop through open water. It brings the
      // whale back to the same lane with the opposite tangent, so neither its
      // position nor its heading snaps when the return pass begins.
      const frame = whaleSwimFrameAtTime(time);

      swim.position
        .copy(anchor)
        .addScaledVector(swimAxis, frame.along)
        .addScaledVector(outward, frame.outward)
        .setY(anchor.y + Math.sin(time * 0.22) * 0.7);
      ahead
        .copy(swim.position)
        .addScaledVector(swimAxis, frame.tangentAlong * 2)
        .addScaledVector(outward, frame.tangentOutward * 2);
      swim.lookAt(ahead);
    }

    if (flukeRef.current) {
      // Whales beat vertically, unlike everything else down here.
      flukeRef.current.rotation.x = Math.sin(time * 0.85) * 0.18;
    }

    // Pectorals: a slow trim, not a flap. Signed per side because the far one
    // is mirrored, and an unsigned angle would send them opposite ways.
    const trim = Math.sin(time * 0.5) * 0.15;
    const sweep = Math.cos(time * 0.37) * 0.07;
    flipperRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }
      const side = index === 0 ? 1 : -1;
      group.rotation.z = side * trim;
      group.rotation.x = sweep;
    });
  });

  const skin = "#3f444b";

  return (
    <group ref={groupRef}>
      <group ref={swimRef} scale={2.5}>
        <mesh geometry={body}>
          <meshStandardMaterial color={skin} roughness={0.9} flatShading />
        </mesh>

        {/* Lower jaw: a thin bar at the very bottom of the head block */}
        {/* Jaw, hinged at its back end so it can hang open without the
            hinge lifting out of the hull. The underside is not flat — it runs
            about -0.288 where the jaw meets it — so the pivot sits there and
            the front swings clear. */}
        <group position={[0, -0.255, 0.62]} rotation={[0.075, 0, 0]}>
          <mesh position={[0, 0, 0.3]}>
            <boxGeometry args={[0.1, 0.055, 0.6]} />
            <meshStandardMaterial
              color="#8d919a"
              roughness={0.88}
              flatShading
            />
          </mesh>
        </group>

        {/* One small eye a side, at the back corner of the head */}
        {[1, -1].map((side) => (
          // Seated just proud of the hull. The superellipse puts the surface
          // at x = 0.258 at this height, and the 18-segment facets sit a
          // fraction inside that, so anything under ~0.25 is swallowed.
          <mesh key={side} position={[side * 0.25, -0.085, 0.52]}>
            <boxGeometry args={[0.038, 0.04, 0.05]} />
            <meshStandardMaterial color="#15171b" roughness={0.4} />
          </mesh>
        ))}

        {/* A single low hump. No dorsal fin, and no spikes. */}
        <mesh position={[0, 0.225, -0.38]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.075, 0.085, 4]} />
          <meshStandardMaterial color={skin} roughness={0.9} flatShading />
        </mesh>

        {/* Knuckles: barely there, stepping down towards the tail */}
        {[-0.62, -0.78, -0.94].map((z, index) => (
          <mesh
            key={z}
            position={[0, 0.155 - index * 0.028, z]}
            scale={[0.035, 0.022 - index * 0.004, 0.05]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={skin} roughness={0.9} flatShading />
          </mesh>
        ))}

        {[1, -1].map((side, index) => (
          <group
            key={side}
            ref={(element) => {
              flipperRefs.current[index] = element;
            }}
            position={[side * 0.2, -0.2, 0.3]}
          >
            <mesh geometry={flipper} scale={[side, 1, 1]}>
              <meshStandardMaterial
                color={skin}
                roughness={0.9}
                side={THREE.DoubleSide}
                flatShading
              />
            </mesh>
          </group>
        ))}

        <group ref={flukeRef} position={[0, 0, -1.44]}>
          <mesh geometry={fluke}>
            <meshStandardMaterial
              color={skin}
              roughness={0.9}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
/**
 * Giant squid, built to the reference: a sharply pointed faceted cone for the
 * mantle, a head band carrying two outsized cream-ringed eyes, and long arms
 * tapering to points beneath.
 *
 * Authored along +Z with the mantle tip forward, then stood upright by a
 * single -90 degree turn on the outer group. That keeps the ring maths simple
 * while giving the reference's hovering, arms-down pose.
 *
 * It hovers rather than swims, so unlike the whale it gets a slow yaw and
 * sway instead of lookAt.
 */
export function GiantSquid({
  depth,
  anchor,
  axis,
  preview = false,
}: {
  depth: { get: () => number };
  anchor?: THREE.Vector3;
  axis?: THREE.Vector3;
  preview?: boolean;
}) {
  const groupRef = useDepthBand(depth, SQUID_DEPTH, preview ? Infinity : 230);
  const driftRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);

  const mantle = useMemo(
    () =>
      loft(
        [
          // Head band: slightly wider than the mantle base, carrying the eyes.
          { z: -0.52, r: 0.2 },
          { z: -0.4, r: 0.3 },
          { z: -0.24, r: 0.35 },
          { z: -0.08, r: 0.345 },
          // Mantle: a long cone to a sharp posterior point.
          { z: 0.04, r: 0.315 },
          { z: 0.2, r: 0.305 },
          { z: 0.44, r: 0.283 },
          { z: 0.72, r: 0.244 },
          { z: 1.02, r: 0.184 },
          { z: 1.3, r: 0.1 },
          { z: 1.56, r: 0.014 },
        ],
        // Few segments on purpose: the reference is chunky and faceted.
        9,
      ),
    [],
  );

  const arms = useMemo(() => {
    const built: Array<{ angle: number; geometry: THREE.BufferGeometry }> = [];
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      // Two of the ten run longer: the feeding tentacles.
      const long = i === 0 || i === 5;
      built.push({
        angle: (i / count) * Math.PI * 2,
        geometry: limb(
          long ? 2.15 : 1.75,
          long ? 0.062 : 0.075,
          0.28 + (i % 3) * 0.09,
          i * 0.7,
        ),
      });
    }
    return built;
  }, []);

  useFrame((state) => {
    const drift = driftRef.current;
    if (!drift) {
      return;
    }
    const time = state.clock.elapsedTime;

    if (!preview && anchor && axis) {
      // Holds station off to the left, bobbing and sculling back and forth.
      const sway = Math.sin(time * 0.16);
      drift.position
        .copy(anchor)
        .addScaledVector(axis, -8.5 + sway * 3.2)
        .setY(anchor.y + Math.sin(time * 0.42) * 0.85);
    }

    // Hovering, not swimming: a slow turn on the spot with a little list.
    drift.rotation.y = time * 0.09;
    drift.rotation.z = Math.sin(time * 0.23) * 0.09;

    if (armsRef.current) {
      armsRef.current.children.forEach((child, index) => {
        child.rotation.x = Math.sin(time * 0.65 + index * 0.6) * 0.11;
        child.rotation.y = Math.cos(time * 0.5 + index * 0.45) * 0.08;
      });
    }
  });

  const flesh = "#d8382a";
  const sclera = "#f0d4ac";

  return (
    <group ref={groupRef}>
      <group ref={driftRef} scale={1.6}>
        {/* Stand the whole animal upright: authored +Z becomes world +Y. */}
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={mantle}>
            <meshStandardMaterial
              color={flesh}
              roughness={0.62}
              flatShading
            />
          </mesh>

          {/* The eyes, which on a real one are the size of dinner plates */}
          {[1, -1].map((side) => (
            <group key={side} position={[side * 0.29, 0, -0.2]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.165, 0.145, 0.11, 9]} />
                <meshStandardMaterial
                  color={sclera}
                  roughness={0.55}
                  flatShading
                />
              </mesh>
              <mesh position={[side * 0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.082, 0.082, 0.03, 8]} />
                <meshStandardMaterial color="#141013" roughness={0.3} />
              </mesh>
            </group>
          ))}

          <group ref={armsRef}>
            {arms.map((arm) => (
              <group key={arm.angle} rotation={[0, 0, arm.angle]}>
                <mesh geometry={arm.geometry} position={[0.15, 0, -0.44]}>
                  <meshStandardMaterial
                    color={flesh}
                    roughness={0.66}
                    flatShading
                  />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
