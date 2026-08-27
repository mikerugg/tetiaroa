"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  isWithinDepthBand,
  loft,
  useDepthBand,
} from "./dive-creature-geometry";

/*
 * Deep-ocean life below the sperm whale's foraging band. Bodies are authored
 * towards +Z so their local geometry remains simple before scene placement.
 */

export const SQUID_DEPTH = 725;
const SQUID_VISIBILITY_BAND = 230;

type Buffers = { positions: number[]; indices: number[] };

/** A tapering limb that curls, for arms and tentacles. */
function limb(length: number, thickness: number, curl: number, seed: number) {
  const buffers: Buffers = { positions: [], indices: [] };
  const steps = 8;
  const sides = 5;

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const radius = thickness * (1 - progress * 0.82);
    const x = Math.sin(progress * Math.PI * 0.8) * curl;
    const y = -Math.pow(progress, 1.6) * curl * 0.7;
    const z = -progress * length;
    for (let side = 0; side < sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2 + seed;
      buffers.positions.push(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
        z,
      );
    }
  }

  for (let index = 0; index < steps; index += 1) {
    for (let side = 0; side < sides; side += 1) {
      const a = index * sides + side;
      const b = index * sides + ((side + 1) % sides);
      const c = (index + 1) * sides + side;
      const d = (index + 1) * sides + ((side + 1) % sides);
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
  const groupRef = useDepthBand(
    depth,
    SQUID_DEPTH,
    preview ? Infinity : SQUID_VISIBILITY_BAND,
  );
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
    for (let index = 0; index < count; index += 1) {
      // Two of the ten run longer: the feeding tentacles.
      const long = index === 0 || index === 5;
      built.push({
        angle: (index / count) * Math.PI * 2,
        geometry: limb(
          long ? 2.15 : 1.75,
          long ? 0.062 : 0.075,
          0.28 + (index % 3) * 0.09,
          index * 0.7,
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
    if (
      !preview &&
      !isWithinDepthBand(depth.get(), SQUID_DEPTH, SQUID_VISIBILITY_BAND)
    ) {
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
              <mesh
                position={[side * 0.075, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
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
